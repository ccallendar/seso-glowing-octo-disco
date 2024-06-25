import {LogItem, LogSourceType} from "../types/types";

/**
 * A simple wrapper class around a LogSource that will preload
 * the next item to reduce the delay in waiting for the next item to load.
 *
 * This could be extended to preload more items (e.g. 10-20), but it wasn't trivial
 * so I decided to keep it simple.
 */
export class PreloadSource implements LogSourceType {
  source: LogSourceType;
  preloader: Promise<LogItem|false>;
  counter: number;

  constructor(source: LogSourceType) {
    this.source = source;
    this.counter = 0;

    // Preload the first item
    this.preloadNextItem();
  }

  async preloadNextItem() {
    this.preloader = this.source.popAsync()
  }

  pop(): LogItem|false {
    return this.source.pop();
  }

  async popAsync():Promise<LogItem|false> {
    const item = await this.preloader;

    if (item) {
      // Preload the next item (don't await)
      this.preloadNextItem();
    }

    return item;
  }
}