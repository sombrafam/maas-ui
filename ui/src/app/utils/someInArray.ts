/**
 * Returns whether something, or some of an array, is in another array.
 * @param {unknown} toCheck - the item or array of items to check
 * @param {unknown[]} arr - the array to check against
 * @returns {boolean} `toCheck` or an item in `toCheck` is inside `arr`
 */
export const someInArray = (toCheck: unknown, arr: unknown[]): boolean => {
  if (Array.isArray(toCheck)) {
    return toCheck.length && toCheck.some((item) => arr.includes(item));
  }
  return arr.includes(toCheck);
};
