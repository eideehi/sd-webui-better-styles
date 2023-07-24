/**
 * A simple sleep function that asynchronously pauses the execution for the specified duration.
 * This function can be useful for adding delays between actions or waiting for certain tasks to complete.
 * @param ms - The number of milliseconds to sleep.
 * @returns A Promise that resolves after the specified number of milliseconds.
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
