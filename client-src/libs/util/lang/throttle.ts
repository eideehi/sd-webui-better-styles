/**
 * Creates a throttled version of the given callback function.
 * @param callback The callback function to be throttled.
 * @param interval The interval in milliseconds during which the callback will be ignored after being executed.
 * @returns A throttled version of the callback function.
 */
export function throttle(callback: Callback, interval: number): Callback {
  let isThrottled = false;

  return () => {
    if (!isThrottled) {
      callback();
      isThrottled = true;
      window.setTimeout(() => (isThrottled = false), interval);
    }
  };
}
