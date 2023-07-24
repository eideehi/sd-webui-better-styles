/**
 * Generates a random alphanumeric ID of a specified length.
 *
 * @param length - Optional. The length of the generated ID. Default is 24.
 * @returns The randomly generated ID.
 */
export function generateRandomId(length = 24): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
