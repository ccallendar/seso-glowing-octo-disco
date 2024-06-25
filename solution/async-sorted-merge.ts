"use strict";

import {PreloadSource} from "../lib/PreloadSource";
import {LogItem, LogItemWithSource, LogSourceType, PrinterType} from "../types/types";
import {binarySearchInsert, sortLogItemsByDate} from "../utils/utils";

// Print all entries, across all of the *async* sources, in chronological order.

export default async (logSources: LogSourceType[], printer: PrinterType, preload = true) => {
  return new Promise(async (resolve, reject) => {
    // 0. This will store the sorted items that haven't been printed yet
    const items: LogItemWithSource[] = [];

    // 1. Wrap all sources in a preloader to speed up async delays
    // It attempts to preload an item
    if (preload) {
      logSources = logSources.map((input: LogSourceType) => new PreloadSource(input));
    }

    // 2. Pop first item off each source
    const promises = logSources.map((source) =>
      source.popAsync().then((item: LogItem|false) => {
      if (item) {
        // 2A. attach the LogSource
        (item as LogItemWithSource).source = source;
        // 2B. add item into array in sorted order
        binarySearchInsert(items, item, sortLogItemsByDate);
      }
      return item;
    }));

    // 3. Resolve all promises at once, faster than sequentially doing it
    try {
      await Promise.all(promises);
    } catch (e: any) {
      reject(e);
      return undefined;
    }

    // 4. Repeat until there are no more items
    while (items.length > 0) {
      // 4A. Pop off and print the first item - it will be the oldest
      let oldest: LogItemWithSource = items.shift();
      printer.print(oldest);

      // 4B. Get the next item from the same source
      const { source } = oldest;
      try {
        const newItem: LogItem | false = await source.popAsync();
        if (newItem) {
          (newItem as LogItemWithSource).source = source;
          binarySearchInsert(items, newItem, sortLogItemsByDate);
        }
      } catch (e: any) {
        // TODO we might not want to abort, and instead continue logging?
        reject(e);
        return undefined;
      }
    }

    printer.done();
    console.log("Async sort complete.")
    resolve(undefined);
    return undefined;
  });
};
