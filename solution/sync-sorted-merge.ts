"use strict";

import {LogSourceType, LogItem, LogItemWithSource, PrinterType} from "../types/types";
import {binarySearchInsert, sortLogItemsByDate} from "../utils/utils";

// Print all entries, across all of the sources, in chronological order.
export default (logSources: LogSourceType[], printer: PrinterType, binarySearch = true) => {
  // 0. This will store the sorted items that haven't been printed yet
  const items: LogItemWithSource[] = [];

  // 1. Pop off the first item from each source
  // Add to array in the correct sorted position (oldest first)
  logSources.forEach((source) => {
    const item = source.pop();
    if (item) {
      // Attach the LogSource
      (item as LogItemWithSource).source = source;
      // Binary search to insert each item
      if (binarySearch) {
        binarySearchInsert(items, item, sortLogItemsByDate)
      } else {
        // Simple sort way - just add items and sort them
        items.push(item as LogItemWithSource);
      }
    }
  });

  if (!binarySearch) {
    items.sort(sortLogItemsByDate);
  }

  // 2. Repeat until there are no items left
  while (items.length > 0) {
    // 3A. Pop off and print the first item from the array - it will be the oldest
    let oldest: LogItemWithSource = items.shift();
    printer.print(oldest);

    // 3B. Get next item from the same source, and insert into the correct position
    const { source } = oldest;
    const newItem: LogItem|false = source.pop();
    if (newItem) {
      (newItem as LogItemWithSource).source = source;
      if (binarySearch) {
        binarySearchInsert(items, newItem, sortLogItemsByDate);
      } else {
        // Simple way - add item first and sort entire array
        items.unshift(newItem as LogItemWithSource);
        items.sort(sortLogItemsByDate);
      }
    }
  }

  printer.done();
  console.log("Sync sort complete.");
  return undefined;
};
