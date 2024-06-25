
export interface LogItem {
  date: Date;
  msg: string;
}

export interface LogSourceType {
  pop: () => LogItem|false;
  popAsync: () => Promise<LogItem|false>;
}

export interface LogItemWithSource extends LogItem {
  source: LogSourceType;
}

export interface PrinterType {
  print: (item: LogItem) => void;
  done: () => void;
}

export type BinarySearchInsertComparator<T> = (item1: T, item2: T) => number;