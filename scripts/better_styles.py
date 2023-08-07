import csv
import io
import json
import os
import subprocess
from pathlib import Path
from typing import Callable, Optional, Tuple, List, Dict, Any

import gradio as gr
from PIL import Image
from fastapi import FastAPI, Request, UploadFile, File, Form
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


class MoveStyleRequest(BaseModel):
    from_group: str
    to_group: str
    original_style_name: str
    style: Style


VERSION = "1.4.1"
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
        print(f"[Better Styles] Version {VERSION}")


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
        available_localization = ["Auto"] + [f.stem for f in LOCALIZATION_DIR.glob("*.json") if f.is_file()]


def load_localization() -> None:
    try:
        localization = shared.opts.better_styles_localization
    except AttributeError:
        localization = "Auto"

    if localization == "Auto" or localization.isspace():
        try:
            localization = shared.opts.localization
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
    data = [group for group in data if group.styles]
    return json.dumps([omit_none_fields(d.dict()) for d in data], ensure_ascii=False)


def omit_none_fields(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: omit_none_fields(v) for k, v in obj.items() if v is not None}
    elif isinstance(obj, list):
        return [omit_none_fields(elem) for elem in obj if elem is not None]
    else:
        return obj


def load_styles_json() -> List[StyleGroup]:
    STYLES_JSON.parent.mkdir(parents=True, exist_ok=True)
    if STYLES_JSON.is_file():
        return parse_obj_as(List[StyleGroup], json.loads(STYLES_JSON.read_text(encoding="UTF-8")))

    return []


def update_style(style_group: StyleGroup, group: str, style: Style):
    updated_styles = []
    deleted_style: Optional[Style] = None
    for item in style_group.styles:
        if item.name == style.name:
            deleted_style = item
            updated_styles.append(style)
        else:
            updated_styles.append(item)

    if not deleted_style:
        updated_styles.append(style)

    style_group.styles = updated_styles
    delete_disused_image(group, style, deleted_style)


def delete_styles(styles: List[Style], predicate: Callable[[Style], bool]) -> Tuple[List[Style], List[Style]]:
    updated_styles = []
    deleted_styles = []
    for style in styles:
        if predicate(style):
            deleted_styles.append(style)
        else:
            updated_styles.append(style)
    return updated_styles, deleted_styles


def get_image_path(group: str, style_name: str) -> Path:
    directory_id = get_or_create_id("groups", group)
    file_id = get_or_create_id("{}-images".format(group), style_name)
    file_name = "{}.webp".format(file_id)
    return IMAGES_DIR.joinpath(directory_id).joinpath(file_name)


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


def delete_disused_image(group: str, updated_style: Optional[Style], deleted_style: Optional[Style]) -> None:
    if not deleted_style or not deleted_style.image:
        return

    updated_image = None
    if updated_style:
        updated_image = updated_style.image

    if updated_image != deleted_style.image:
        path = IMAGES_DIR.joinpath(deleted_style.image)
        if path.is_file():
            path.unlink()
            print(f"[Better Styles] Delete disused thumbnail: {path}")

        category = "{}-images".format(group)
        if category in id_maps:
            id_map = id_maps[category]
            if remove_id(id_map, deleted_style.name):
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


def on_app_started(demo: Optional[Blocks], app: FastAPI) -> None:
    @app.get("/better-styles-api/v1/get-localization")
    async def get_localization_api(request: Request):
        return JSONResponse(content=localization_dict)

    @app.get("/better-styles-api/v1/images-dir")
    async def images_dir_api(request: Request):
        return JSONResponse(content={"imagesDir": IMAGES_DIR.relative_to(WEBUI_ROOT).as_posix()})

    @app.get("/better-styles-api/v1/all-style")
    async def all_style_api(request: Request):
        if STYLES_JSON.is_file():
            return FileResponse(path=STYLES_JSON, media_type="application/json")
        else:
            return JSONResponse(content=[])

    @app.post("/better-styles-api/v1/save-style/{group}")
    async def save_style_api(group: str, style: Style):
        file_data = load_styles_json()
        if file_data:
            is_new_group = True
            for data in file_data:
                if data.name == group:
                    is_new_group = False
                    update_style(data, group, style)
            if is_new_group:
                file_data.append(StyleGroup(name=group, styles=[style]))
        else:
            file_data.append(StyleGroup(name=group, styles=[style]))

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content=json.loads(json_data))

    @app.post("/better-styles-api/v1/delete-styles")
    async def delete_styles_api(request: Dict[str, List[str]]):
        file_data = load_styles_json()
        for data in file_data:
            for group in list(request.keys()):
                if data.name != group:
                    continue

                styles = request.pop(group)
                updated_styles, deleted_styles = delete_styles(data.styles, lambda x: x.name in styles)
                data.styles = updated_styles

                for deleted_style in deleted_styles:
                    delete_disused_image(group, None, deleted_style)

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content=json.loads(json_data))

    @app.post("/better-styles-api/v1/move-style")
    async def move_style_api(request: MoveStyleRequest):
        from_group = request.from_group
        to_group = request.to_group
        original_style_name = request.original_style_name
        style = request.style
        file_data = load_styles_json()

        if not file_data:
            file_data.append(StyleGroup(name=to_group, styles=[style]))
        else:
            is_new_group = True
            for data in file_data:
                if data.name == from_group:
                    updated_styles, deleted_styles = delete_styles(data.styles, lambda x: x.name == original_style_name)
                    data.styles = updated_styles

                    for deleted_style in deleted_styles:
                        delete_disused_image(from_group, None, deleted_style)
                elif data.name == to_group:
                    is_new_group = False
                    update_style(data, to_group, style)
            if is_new_group:
                file_data.append(StyleGroup(name=to_group, styles=[style]))

        json_data = style_data_encoder(file_data)
        STYLES_JSON.write_text(json_data, encoding="UTF-8")
        return JSONResponse(content=json.loads(json_data))

    @app.get("/better-styles-api/v1/import-styles-csv")
    async def import_styles_csv_api(request: Request):
        file_data = load_styles_json()

        csv_file = WEBUI_ROOT.joinpath("styles.csv")
        if not csv_file.is_file():
            return JSONResponse(content={})

        style_group = next((x for x in file_data if x.name == "styles.csv"), None)
        if not style_group:
            style_group = StyleGroup(name="styles.csv", styles=[])
            file_data.append(style_group)

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
        return JSONResponse(content=json.loads(json_data))

    @app.get("/better-styles-api/v1/get-default-style/{tab_name}")
    async def get_default_style_api(tab_name: str):
        if tab_name != "txt2img" and tab_name != "img2img":
            return JSONResponse(content={})

        config_file = Path(shared.cmd_opts.ui_config_file)
        if not config_file.is_file():
            return JSONResponse(content={})

        config = json.loads(config_file.read_text(encoding="UTF-8"))
        style = {"prompt": config[f"{tab_name}/Prompt/value"],
                 "negativePrompt": config[f"{tab_name}/Negative prompt/value"],
                 "samplingMethod": config[f"{tab_name}/Sampling method/value"],
                 "samplingSteps": config[f"{tab_name}/Sampling steps/value"],
                 "cfgScale": config[f"{tab_name}/CFG Scale/value"], "seed": config[f"{tab_name}/Seed/value"],
                 "restoreFaces": config[f"{tab_name}/Restore faces/value"],
                 "tiling": config[f"{tab_name}/Tiling/value"], "hiresFix": config[f"{tab_name}/Hires. fix/value"],
                 "upscaler": config[f"{tab_name}/Upscaler/value"],
                 "hiresSteps": config[f"{tab_name}/Hires steps/value"],
                 "denoisingStrength": config[f"{tab_name}/Denoising strength/value"],
                 "upscaleBy": config[f"{tab_name}/Upscale by/value"],
                 "clipSkip": shared.opts.better_styles_default_clip_skip,
                 "etaNoiseSeedDelta": shared.opts.better_styles_default_eta_noise_seed_delta}

        return JSONResponse(content=style)

    @app.post("/better-styles-api/v1/upload-thumbnail")
    async def upload_thumbnail_api(group: str = Form(), style_name: str = Form(), file: UploadFile = File()):
        path = get_image_path(group, style_name)
        data = await file.read()
        with Image.open(io.BytesIO(data)) as image:
            path.parent.mkdir(parents=True, exist_ok=True)

            image.thumbnail((512, 512))
            image.save(path, "webp")
            print(f"[Better Styles] Thumbnail saved: {path}")

        return {"path": path.relative_to(IMAGES_DIR).as_posix()}


script_callbacks.on_app_started(on_app_started)


def on_ui_settings():
    shared.opts.add_option("better_styles_localization",
                           shared.OptionInfo("Auto", _("Language of Better Styles (requires reload UI)"), gr.Dropdown,
                                             lambda: {"choices": available_localization},
                                             refresh=refresh_available_localization, section=SETTINGS_SECTION)),
    shared.opts.add_option("better_styles_hide_original_styles",
                           shared.OptionInfo(False, _("Hide the original Styles"), section=SETTINGS_SECTION))
    shared.opts.add_option("better_styles_show_by_default",
                           shared.OptionInfo(False, _("Show the Better Styles by default"), section=SETTINGS_SECTION))
    shared.opts.add_option("better_styles_hide_import_styles_csv",
                           shared.OptionInfo(False, _("Hide \"Import styles.csv\" button"), section=SETTINGS_SECTION))
    shared.opts.add_option("better_styles_default_clip_skip",
                           shared.OptionInfo(1, _("Default Click skip. (Used when resetting the style)"), gr.Slider,
                                             {"minimum": 1, "maximum": 12, "step": 1}, section=SETTINGS_SECTION))
    shared.opts.add_option("better_styles_default_eta_noise_seed_delta",
                           shared.OptionInfo(0, _("Default Eta noise seed delta. (Used when resetting the style)"),
                                             gr.Number, {"precision": 0}, section=SETTINGS_SECTION))


script_callbacks.on_ui_settings(on_ui_settings)


def initialize() -> None:
    print_version()
    load_id_map()
    refresh_available_localization()
    load_localization()


initialize()
