"use strict";

import {LogSourceType, LogItem, LogItemWithSource, PrinterType} from "../types/types";
import {sortItemsByDate} from "../utils/utils";


// Print all entries, across all of the sources, in chronological order.

export default (logSources: LogSourceType[], printer: PrinterType) => {
  // 0. This will store the sorted items that haven't been printed yet
  const items: LogItemWithSource[] = [];

  // 1. Pop first item off each source, attach the LogSource and add to items array
  logSources.forEach((source) => {
    const item = source.pop();
    if (item) {
      const itemWithSource = (item as LogItemWithSource);
      itemWithSource.source = source;
      // TODO should use BST again?
      items.push(itemWithSource)
    }
  });

  // 2. Sort items, oldest first
  items.sort(sortItemsByDate);

  // 3. Keep popping off the first item - it will be the oldest
  // And add the next item from the same source, into the correct index in the sorted array
  while (items.length > 0) {
    let oldest: LogItemWithSource = items.shift();
    printer.print(oldest);

    // 3A. Get the next item from the same source
    const { source } = oldest;
    const newItem: LogItem|false = source.pop();
    if (newItem) {
      // Lazy way - add then sort again
      // Should use a BST or something more efficient
      const itemWithSource = (newItem as LogItemWithSource);
      itemWithSource.source = source;
      items.unshift(itemWithSource)
      items.sort(sortItemsByDate);
    }
  }

  printer.done();
  return console.log("Sync sort complete.");
};
