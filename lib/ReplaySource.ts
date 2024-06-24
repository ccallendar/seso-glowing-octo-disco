import {LogItem, LogSourceType} from "../types/types";

const P = require("bluebird");
/**
 * A simple wrapper class that captures all the items from a source
 * so that it can be replayed to test different algorithms.
 *
 * It doesn't support popAsync since the async delay is random and not reproducible
 * without making changes to LogSource.
 */
export class ReplaySource implements LogSourceType {
  source: LogSourceType;
  items: LogItem[];
  isReplay: boolean;
  replayIndex: number;

  constructor(source: LogSourceType) {
    this.source = source;
    this.items = [];
    this.isReplay = false;
    this.replayIndex = 0;
  }

  pop(): LogItem|false {
    let item: LogItem|false;
    if (this.isReplay) {
      if (this.replayIndex < this.items.length) {
        item = this.items[this.replayIndex];
        this.replayIndex++;
      } else {
        item = false;
      }
    } else {
      item = this.source.pop();
      if (item) {
        // Save this item for later replay
        this.items.push(item);
      } else {
        // Start replay
        this.isReplay = true;
        this.replayIndex = 0;
      }
    }

    return item;
  }

  // Doesn't support replay since the delay is not known
  async popAsync():Promise<LogItem|false> {
    // Won't be exactly the same - different delay

    let item: LogItem|false;
    if (this.isReplay) {
      if (this.replayIndex < this.items.length) {
        item = this.items[this.replayIndex];
        this.replayIndex++;
      } else {
        item = false;
      }

      // The real delay in log-source is a random number in [0-8]
      // But we don't know the delay, so use the average value of 4
      const delay = 4;
      return P.delay(delay).then(() => item);
    }

    item = await this.source.popAsync();
    if (item) {
      // Save this item for later replay
      this.items.push(item);
    } else {
      // Start replay
      this.isReplay = true;
      this.replayIndex = 0;
    }

    return item;
  }
}