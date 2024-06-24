"use strict";

import {LogItem, LogItemWithSource, LogSourceType, PrinterType} from "../types/types";
import {sortItemsByDate} from "../utils/utils";

// Print all entries, across all of the *async* sources, in chronological order.

export default async (logSources: LogSourceType[], printer: PrinterType) => {
  return new Promise(async (resolve, reject) => {
    // 0. This will store the sorted items that haven't been printed yet
    const items: LogItemWithSource[] = [];

    // 1. Pop first item off each source, attach the LogSource and add to items array
    const promises: Promise<LogItemWithSource|false>[] = logSources.map((source) =>
      source.popAsync().then((item: LogItem|false) => {
      if (item) {
        const itemWithSource = (item as LogItemWithSource);
        itemWithSource.source = source;
        return itemWithSource;
      }
      return false;
    }));

    try {
      // Resolve all promises at once, faster than sequentially doing it
      const allItems: (LogItemWithSource|false)[] = await Promise.all(promises);
      // Filter out any false values
      allItems.forEach((item: LogItemWithSource|false) => {
        if (item) {
          items.push(item);
        }
      });
    } catch (e: any) {
      reject(e);
    }

    // 2. Sort items, oldest first
    items.sort(sortItemsByDate);

    // 3. Keep popping off the first item - it will be the oldest
    // And add the next item from the same source, into the correct index in the sorted array
    while (items.length > 0) {
      let oldest: LogItemWithSource = items.shift();
      printer.print(oldest);

      // 3A. Get the next item from the same source
      const { source } = oldest;
      const newItem: LogItem|false = await source.popAsync();
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
    console.log("Async sort complete.")
    resolve(undefined);
  });
};
