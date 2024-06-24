import {BinarySearchInsertComparator, LogItem} from "../types/types";

export function sortLogItemsByDate(item1: LogItem, item2: LogItem): number {
  return item1.date.getTime() - item2.date.getTime();
}


/**
 * Inserts the new item into the sortedArray at the correct position
 * using a binary search.
 * @param sortedArray the sorted array of items
 * @param newItem the new item to be inserted
 * @param comparator the sort function
 * @return {number} the index where the item was inserted
 */
export function binarySearchInsert<T>(sortedArray: T[], newItem: T, comparator: BinarySearchInsertComparator<T>) {
  let leftIndex = 0;
  let rightIndex = sortedArray.length;
  while (leftIndex < rightIndex) {
    const midIndex = Math.floor((leftIndex + rightIndex) / 2);
    const midItem = sortedArray[midIndex];
    const compareValue = comparator(midItem, newItem);
    if (compareValue < 0) {
      leftIndex = midIndex + 1;
    } else {
      rightIndex = midIndex;
    }
  }

  // Insert the log item here
  sortedArray.splice(leftIndex, 0, newItem);
  return leftIndex;
}