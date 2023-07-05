import json
import os
import subprocess
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Callable, Optional, Tuple, List, Any

import gradio as gr
from PIL import Image
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from gradio import Blocks

from modules import scripts, script_callbacks, shared


@dataclass
class Style:
    name: str
    image: Optional[str] = field(default=None)
    checkpoint: Optional[str] = field(default=None)
    prompt: Optional[str] = field(default=None)
    negativePrompt: Optional[str] = field(default=None)
    samplingMethod: Optional[str] = field(default=None)
    samplingSteps: Optional[int] = field(default=None)
    cfgScale: Optional[float] = field(default=None)
    seed: Optional[int] = field(default=None)
    restoreFaces: Optional[bool] = field(default=None)
    tiling: Optional[bool] = field(default=None)
    hiresFix: Optional[bool] = field(default=None)
    upscaler: Optional[str] = field(default=None)
    hiresSteps: Optional[int] = field(default=None)
    denoisingStrength: Optional[float] = field(default=None)
    upscaleBy: Optional[float] = field(default=None)
    clipSkip: Optional[int] = field(default=None)
    etaNoiseSeedDelta: Optional[int] = field(default=None)


@dataclass
class StyleGroup:
    name: str
    styles: List[Style]


class StyleGroupListDecoder(json.JSONDecoder):
    def decode(self, json_str: str, *args: Any, **kwargs: Any) -> List[StyleGroup]:
        data = json.loads(json_str, *args, **kwargs)
        style_map = {}
        for style_data in data:
            for style_dict in style_data["styles"]:
                style = Style(**style_dict)
                style_map[style.name] = style
            style_data["styles"] = list(style_map.values())
            style_map.clear()
        return [StyleGroup(**item) for item in data]


@dataclass
class RegisterStyleRequest:
    group: str
    style: Style


class RegisterStyleRequestDecoder(json.JSONDecoder):
    def decode(self, json_bytes: bytes, *args: Any, **kwargs: Any) -> RegisterStyleRequest:
        data = json.loads(json_bytes, *args, **kwargs)
        style_data = data["style"]
        style = Style(**style_data)
        return RegisterStyleRequest(group=data["group"], style=style)


GIT = os.environ.get('GIT', "git")
SETTINGS_SECTION = ("better_styles", "Better Styles")
WEBUI_ROOT = Path().absolute()
EXTENSION_ROOT = scripts.basedir()
EXTENSION_DIR = Path(EXTENSION_ROOT)
LOCALIZATION_DIR = EXTENSION_DIR.joinpath("locales")
USER_DATA_DIR = EXTENSION_DIR.joinpath("user-data")
UPDATE_INFO_JSON = USER_DATA_DIR.joinpath("update-info.json")
ID_MAPPING_JSON = USER_DATA_DIR.joinpath("id-mapping.json")
STYLES_JSON = USER_DATA_DIR.joinpath("styles.json")
IMAGES_DIR = USER_DATA_DIR.joinpath("images")

git = "git"
id_map = {}
available_localization = []
localization_dict = {}


# noinspection DuplicatedCode
def get_git_command() -> None:
    global git
    try:
        subprocess.run([git, "-v"], cwd=EXTENSION_ROOT, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                       check=True)
    except subprocess.CalledProcessError:
        git = GIT
        subprocess.run([git, "-v"], cwd=EXTENSION_ROOT, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                       check=True)


def print_version() -> None:
    result = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                     shell=True).decode("utf-8")
    print(f"Better Styles version is {result.strip()}")


def load_id_map() -> None:
    if ID_MAPPING_JSON.is_file():
        global id_map
        id_map = json.loads(ID_MAPPING_JSON.read_text(encoding="UTF-8"))


# noinspection DuplicatedCode
def refresh_available_localization() -> None:
    if LOCALIZATION_DIR.is_dir():
        global available_localization
        available_localization = [" "] + [f.stem for f in LOCALIZATION_DIR.glob("*.json") if f.is_file()]


def load_localization() -> None:
    try:
        localization = shared.opts.better_styles_localization
    except AttributeError:
        return

    if localization in available_localization:
        file_path = LOCALIZATION_DIR.joinpath("{}.json".format(localization))
        if file_path.is_file():
            global localization_dict
            localization_dict = json.loads(file_path.read_text(encoding="UTF-8"))


# noinspection DuplicatedCode
def _(text: str) -> str:
    if text in localization_dict:
        return localization_dict[text]
    return text


def filter_none_fields(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: filter_none_fields(v) for k, v in obj.items() if v is not None}
    elif isinstance(obj, list):
        return [filter_none_fields(elem) for elem in obj if elem is not None]
    else:
        return obj


def style_data_encoder(data: List[StyleGroup]) -> str:
    return json.dumps([filter_none_fields(asdict(d)) for d in data])


def load_styles_json() -> List[StyleGroup]:
    STYLES_JSON.parent.mkdir(parents=True, exist_ok=True)
    if STYLES_JSON.is_file():
        return json.loads(STYLES_JSON.read_text(encoding="UTF-8"), cls=StyleGroupListDecoder)

    return []


def update_styles(styles: List[Style], *args: Style) -> Tuple[List[Style], List[Style]]:
    updated_styles = {style.name: style for style in styles}
    overwritten_styles = []
    for style in args:
        if style.name in updated_styles:
            old_style = updated_styles[style.name]
            if not style.image and old_style.image:
                style.image = old_style.image
                old_style.image = None
            overwritten_styles.append(old_style)
        updated_styles[style.name] = style
    return list(updated_styles.values()), overwritten_styles


def filtering_styles(styles: List[Style], predicate: Callable[[Style], bool]) -> Tuple[List[Style], List[Style]]:
    filtered_styles = []
    removed_styles = []
    for style in styles:
        if predicate(style):
            removed_styles.append(style)
        else:
            filtered_styles.append(style)
    return filtered_styles, removed_styles


def get_image_path(group: str, style_name: str) -> str:
    directory_id = get_or_create_id("groups", group)
    file_id = get_or_create_id("{}-images".format(group), style_name)
    file_name = "{}.webp".format(file_id)
    return IMAGES_DIR.joinpath(directory_id).joinpath(file_name).as_posix()


def get_or_create_id(category: str, key: str) -> str:
    if category not in id_map:
        data = {"max": 1, key: 1}
        id_map[category] = data
        ID_MAPPING_JSON.write_text(json.dumps(id_map), encoding="UTF-8")
        return "1"

    data = id_map[category]
    if key in data:
        return str(data[key])

    max_id = data["max"] + 1
    data[key] = max_id
    data["max"] = max_id
    ID_MAPPING_JSON.write_text(json.dumps(id_map), encoding="UTF-8")
    return str(max_id)


def save_image(input_file: str, output_file: str):
    input_path = Path(input_file)
    output_path = Path(output_file)
    if input_path.is_file():
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(input_path) as image:
            image.thumbnail((512, 512))
            image.save(output_path, "webp")


def delete_disused_images(disused_styles: List[Style]) -> None:
    for style in disused_styles:
        if style.image:
            path = IMAGES_DIR.joinpath(style.image)
            if path.is_file():
                path.unlink()


def find_disused_images(styles1: List[Style], styles2: List[Style]) -> List[Style]:
    disused_images = []
    for style1 in styles1:
        for style2 in styles2:
            if style1.name != style2.name:
                continue
            if style1.image != style2.image and style2.image:
                disused_images.append(style2)
    return disused_images


def on_app_started(demo: Optional[Blocks], app: FastAPI) -> None:
    @app.get("/better-styles-api/v1/get-localization")
    async def get_localization(request: Request):
        return JSONResponse(content=localization_dict)

    @app.get("/better-styles-api/v1/images-dir")
    async def images_dir(request: Request):
        return JSONResponse(content={"imagesDir": IMAGES_DIR.relative_to(WEBUI_ROOT).as_posix()})

    @app.get("/better-styles-api/v1/all-style")
    async def all_style(request: Request):
        if STYLES_JSON.is_file():
            return FileResponse(path=STYLES_JSON, media_type="application/json")
        else:
            return JSONResponse(content=[])

    @app.post("/better-styles-api/v1/register-style")
    async def register_style(request: Request):
        request_data = RegisterStyleRequestDecoder().decode(await request.body())
        style = request_data.style
        group = request_data.group

        if style.image:
            image_path = get_image_path(group, style.name)
            save_image(style.image, image_path)
            style.image = Path(image_path).relative_to(IMAGES_DIR).as_posix()

        file_data = load_styles_json()
        if file_data:
            is_new_group = True
            for data in file_data:
                if data.name == group:
                    is_new_group = False
                    updated_styles, overwritten_styles = update_styles(data.styles, style)
                    data.styles = updated_styles
                    delete_disused_images(find_disused_images(updated_styles, overwritten_styles))
            if is_new_group:
                file_data.append(StyleGroup(group, [style]))
        else:
            file_data.append(StyleGroup(group, [style]))

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content=json.loads(json_data))

    @app.post("/better-styles-api/v1/delete-styles")
    async def delete_styles(request: Request):
        target_names = json.loads(await request.body())
        file_data = load_styles_json()
        for style_data in file_data:
            if style_data.name == target_names["group"]:
                filtered_styles, removed_styles = filtering_styles(style_data.styles,
                                                                   lambda x: x.name in target_names["styles"])
                style_data.styles = filtered_styles
                delete_disused_images(removed_styles)

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content=json.loads(json_data))


script_callbacks.on_app_started(on_app_started)


def on_ui_settings():
    shared.opts.add_option("better_styles_hide_original_styles",
                           shared.OptionInfo(False, _("Hide the original Styles"), section=SETTINGS_SECTION))
    shared.opts.add_option("better_styles_localization",
                           shared.OptionInfo("", _("Language of Better Styles (requires reload UI)"), gr.Dropdown,
                                             lambda: {"choices": available_localization},
                                             refresh=refresh_available_localization, section=SETTINGS_SECTION)),


script_callbacks.on_ui_settings(on_ui_settings)


def initialize() -> None:
    get_git_command()
    print_version()
    load_id_map()
    refresh_available_localization()
    load_localization()


initialize()
