/**
 * Gets the boolean option value for the specified option name.
 * If the option value is not found or is not a boolean, the default value will be returned.
 * @param optionName - The name of the option.
 * @param defaultValue - The default boolean value to be returned if the option value is not found or is not a boolean.
 * @returns The boolean value of the option or the default value if the option is not found or is not a boolean.
 */
export function getBooleanOption(optionName: string, defaultValue: boolean): boolean;

/**
 * Gets the boolean option value for the specified option name and executes a callback function with the value.
 * If the option value is not found or is not a boolean, the callback will not be executed.
 * @param optionName - The name of the option.
 * @param callback - A callback function that will be executed with the boolean value of the option if found.
 */
export function getBooleanOption(optionName: string, callback: Callback1<boolean>): void;

export function getBooleanOption(
  optionName: string,
  arg2: boolean | Callback1<boolean>
): boolean | void {
  const value = opts[optionName];
  if (value == null || typeof value !== "boolean") {
    if (typeof arg2 === "boolean") return arg2;
  } else {
    if (typeof arg2 === "function") {
      arg2(value);
    } else {
      return value;
    }
  }
}
