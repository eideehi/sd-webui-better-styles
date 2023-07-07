import csv
import json
import os
import subprocess
from pathlib import Path
from typing import Callable, Optional, Tuple, List, Dict

import gradio as gr
from PIL import Image
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from gradio import Blocks
from pydantic import BaseModel, parse_obj_as

from modules import scripts, script_callbacks, shared


class IdMap(BaseModel):
    max_id: int
    values: Dict[str, int]


class Style(BaseModel):
    name: str
    image: str | None = None
    checkpoint: str | None = None
    prompt: str | None = None
    negativePrompt: str | None = None
    samplingMethod: str | None = None
    samplingSteps: int | None = None
    cfgScale: float | None = None
    seed: int | None = None
    restoreFaces: bool | None = None
    tiling: bool | None = None
    hiresFix: bool | None = None
    upscaler: str | None = None
    hiresSteps: int | None = None
    denoisingStrength: float | None = None
    upscaleBy: float | None = None
    clipSkip: int | None = None
    etaNoiseSeedDelta: int | None = None


class StyleGroup(BaseModel):
    name: str
    styles: List[Style]


SETTINGS_SECTION = ("better_styles", "Better Styles")
WEBUI_ROOT = Path().absolute()
EXTENSION_ROOT = scripts.basedir()
EXTENSION_DIR = Path(EXTENSION_ROOT)
LOCALIZATION_DIR = EXTENSION_DIR.joinpath("locales")
USER_DATA_DIR = EXTENSION_DIR.joinpath("user-data")
UPDATE_INFO_JSON = USER_DATA_DIR.joinpath("update-info.json")
ID_MAPPING_JSON = USER_DATA_DIR.joinpath("id-mapping.json")
ID_MAPS_JSON = USER_DATA_DIR.joinpath("id-maps.json")
STYLES_JSON = USER_DATA_DIR.joinpath("styles.json")
IMAGES_DIR = USER_DATA_DIR.joinpath("images")

id_maps: Dict[str, IdMap] = {}
available_localization = []
localization_dict = {}


# noinspection DuplicatedCode
def print_version() -> None:
    git = os.environ.get('GIT', "git")
    try:
        result = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                         shell=True).decode("utf-8")
    except subprocess.CalledProcessError:
        git = "git"
        try:
            result = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                             shell=True).decode("utf-8")
        except subprocess.CalledProcessError:
            result = None

    if result:
        version = result.strip()
        print(f"[Better Styles] Version {version}")
    else:
        print(f"[Better Styles] Version 1.2.0")


def load_id_map() -> None:
    global id_maps

    if ID_MAPS_JSON.is_file():
        id_maps = parse_obj_as(Dict[str, IdMap], json.loads(ID_MAPS_JSON.read_text(encoding="UTF-8")))
        return

    if ID_MAPPING_JSON.is_file():
        id_maps = {}
        id_map = json.loads(ID_MAPPING_JSON.read_text(encoding="UTF-8"))
        for key, value in id_map.items():
            max_id = value.pop("max")
            id_maps[key] = IdMap(max_id=max_id, values=value)
        update_id_maps_json()
        ID_MAPPING_JSON.unlink()


def update_id_maps_json():
    ID_MAPS_JSON.write_text(json.dumps({k: v.dict() for k, v in id_maps.items()}, ensure_ascii=False), encoding="UTF-8")


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


def style_data_encoder(data: List[StyleGroup]) -> str:
    return json.dumps([d.dict() for d in data], ensure_ascii=False)


def load_styles_json() -> List[StyleGroup]:
    STYLES_JSON.parent.mkdir(parents=True, exist_ok=True)
    if STYLES_JSON.is_file():
        return parse_obj_as(List[StyleGroup], json.loads(STYLES_JSON.read_text(encoding="UTF-8")))

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
    if category not in id_maps:
        id_map = IdMap(max_id=1, values={key: 1})
        id_maps[category] = id_map
        update_id_maps_json()
        return "1"

    id_map = id_maps[category]
    if key in id_map.values:
        return str(id_map.values[key])

    image_id = get_available_id(id_map)
    id_map.values[key] = image_id

    if image_id > id_map.max_id:
        id_map.max_id = image_id

    update_id_maps_json()
    return str(image_id)


def get_available_id(id_map: IdMap) -> int:
    min_id = 1
    while min_id in [value for key, value in id_map.values.items() if key != "max"]:
        min_id += 1

    if min_id == id_map.max_id:
        return id_map.max_id + 1

    return min_id


def save_image(input_file: str, output_file: str):
    input_path = Path(input_file)
    output_path = Path(output_file)
    if input_path.is_file():
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(input_path) as image:
            image.thumbnail((512, 512))
            image.save(output_path, "webp")


def delete_disused_images(group: str, disused_styles: List[Style]) -> None:
    for style in disused_styles:
        if style.image:
            path = IMAGES_DIR.joinpath(style.image)
            if path.is_file():
                path.unlink()

        category = "{}-images".format(group)
        if category in id_maps:
            id_map = id_maps[category]
            if remove_id(id_map, style.name):
                if not id_map.values:
                    id_maps.pop(category)

                if "groups" in id_maps:
                    remove_id(id_maps["groups"], group)

                update_id_maps_json()


def remove_id(id_map: IdMap, key: str) -> bool:
    if key not in id_map.values:
        return False

    value = id_map.values.pop(key)
    if value == id_map.max_id:
        max_id = 1
        for key, value in id_map.values.items():
            if key == "max" or not isinstance(value, int):
                continue
            max_id = max(max_id, value)
        id_map.max_id = max_id

    return True


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

    @app.post("/better-styles-api/v1/register-style/{group}")
    async def register_style(group: str, style: Style):
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
                    delete_disused_images(group, find_disused_images(updated_styles, overwritten_styles))
            if is_new_group:
                file_data.append(StyleGroup(name=group, styles=[style]))
        else:
            file_data.append(StyleGroup(name=group, styles=[style]))

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content=json.loads(json_data))

    @app.post("/better-styles-api/v1/delete-styles/{group}")
    async def delete_styles(group: str, styles: List[str]):
        file_data = load_styles_json()
        for style_data in file_data:
            if style_data.name == group:
                filtered_styles, removed_styles = filtering_styles(style_data.styles, lambda x: x.name in styles)
                style_data.styles = filtered_styles
                delete_disused_images(group, removed_styles)

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content=json.loads(json_data))

    @app.post("/better-styles-api/v1/import-styles-csv")
    async def import_styles_csv(group: str):
        file_data = load_styles_json()

        style_group = next((x for x in file_data if x.name == group), None)
        if not style_group:
            return JSONResponse(content={"status": "error", "error_code": 1})

        csv_file = WEBUI_ROOT.joinpath("styles.csv")
        if not csv_file.is_file():
            return JSONResponse(content={"status": "error", "error_code": 2})

        with csv_file.open("r", encoding="utf_8_sig") as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) < 3:
                    continue

                [name, positive, negative] = row
                if name == "name" or name == "None":
                    continue

                style = next((x for x in style_group.styles if x.name == name), None)
                if not style:
                    if not positive or positive.isspace():
                        positive = None

                    if not negative or negative.isspace():
                        negative = None

                    style_group.styles.append(Style(name=name, prompt=positive, negativePrompt=negative))

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content={"status": "success", "styles": json.loads(json_data)})


script_callbacks.on_app_started(on_app_started)


def on_ui_settings():
    shared.opts.add_option("better_styles_localization",
                           shared.OptionInfo("", _("Language of Better Styles (requires reload UI)"), gr.Dropdown,
                                             lambda: {"choices": available_localization},
                                             refresh=refresh_available_localization, section=SETTINGS_SECTION)),
    shared.opts.add_option("better_styles_hide_original_styles",
                           shared.OptionInfo(False, _("Hide the original Styles"), section=SETTINGS_SECTION))
    shared.opts.add_option("better_styles_hide_by_default",
                           shared.OptionInfo(False, _("Hide Better Styles by default"), section=SETTINGS_SECTION))


script_callbacks.on_ui_settings(on_ui_settings)


def initialize() -> None:
    print_version()
    load_id_map()
    refresh_available_localization()
    load_localization()


initialize()
