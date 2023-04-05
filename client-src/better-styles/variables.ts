import { createValueAccessor } from "../libs/webui";

/**
 * A collection of all style groups saved by the user, obtained via API from the server.
 */
let _styleGroups: StyleGroup[] = [];
export const styleGroups: ValueAccessor<StyleGroup[]> = createValueAccessor({
  get: () => _styleGroups,
  set: (value) => {
    _styleGroups = [...value];
    return true;
  },
});

/**
 * The directory where the images are saved. It is obtained via API from the server.
 */
let _imagesDir = "";
export const imagesDir: ValueAccessor<string> = createValueAccessor({
  get: () => _imagesDir,
  set: (value) => {
    _imagesDir = value;
    return true;
  },
});

/**
 * Parameters to update the image cache. Set when it is necessary to update the image due to adding or deleting styles.
 */
let _updateTimestamp = "";
export const updateTimestamp: ValueAccessor<string> = createValueAccessor({
  get: () => _updateTimestamp,
  set: (value) => {
    _updateTimestamp = value;
    return true;
  },
});

/**
 * The group name of the styles currently displayed.
 */
let _currentGroup = "default";
export const currentGroup: ValueAccessor<string> = createValueAccessor({
  get: () => _currentGroup,
  set: (value) => {
    _currentGroup = value;
    return true;
  },
});
