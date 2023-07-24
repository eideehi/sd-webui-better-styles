/**
 * Groups an array of objects by the specified object field and returns the result.
 * @param values The array of objects to be grouped.
 * @param getKey A function that extracts the key for grouping from each object.
 * @returns An object where keys are the grouped values and values are arrays of objects with the same key.
 */
export function groupBy<T>(values: T[], getKey: (value: T) => string): Record<string, T[]>;

/**
 * Groups an array of objects by the specified object field and converts the grouped objects using the getValue function.
 * @param values The array of objects to be grouped.
 * @param getKey A function that extracts the key for grouping from each object.
 * @param getValue A function that converts each object in the group.
 * @returns An object where keys are the grouped values and values are arrays of converted objects with the same key.
 */
export function groupBy<T, U>(
  values: T[],
  getKey: (value: T) => string,
  getValue: (value: T) => U
): Record<string, U[]>;

export function groupBy<T, U>(
  values: T[],
  getKey: (value: T) => string,
  getValue?: (value: T) => U
): Record<string, T[] | U[]> {
  const result: Record<string, T[] | U[]> = {};

  for (const value of values) {
    const key = getKey(value);

    if (!result[key]) {
      result[key] = [];
    }

    if (getValue) {
      const convertedValue = getValue(value);
      (result[key] as U[]).push(convertedValue);
    } else {
      (result[key] as T[]).push(value);
    }
  }

  return result;
}
