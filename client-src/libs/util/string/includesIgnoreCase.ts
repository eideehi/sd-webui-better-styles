/**
 * Checks if a string includes another string (case-insensitive).
 *
 * @param baseString - The string to search within.
 * @param searchString - The string to search for.
 * @param position - Optional. The position within the baseString to start the search.
 * @returns True if the baseString includes the searchString (case-insensitive), otherwise false.
 */
export function includesIgnoreCase(
  baseString: string,
  searchString: string,
  position?: number
): boolean {
  return baseString.toLowerCase().includes(searchString.toLowerCase(), position);
}
