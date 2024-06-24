import {LogItem, LogSourceType} from "../types/types";

/**
 * A simple wrapper class that captures all the items from a source
 * so that it can be replayed to test different algorithms.
 *
 * It doesn't support popAsync since the async delay is random and not reproducible
 * without making changes to LogSource.
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