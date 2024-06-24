import {LogItem} from "../types/types";

export function sortItemsByDate(item1: LogItem, item2: LogItem): number {
  return item1.date.getTime() - item2.date.getTime();
}