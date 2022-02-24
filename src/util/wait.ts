/**
 * Wraps `setTimeout` in a Promise, which can be used like this:
 * ```
 * await wait(1000);
 * ```
 */
const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay));
export default wait;
