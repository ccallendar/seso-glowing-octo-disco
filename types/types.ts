
export interface LogItem {
  date: Date;
  msg: string;
}

export interface LogSourceType {
  drained: boolean;
  last: LogItem;
  getNextPseudoRandomEntry: () => LogItem;
  pop: () => LogItem|false;
  popAsync: () => Promise<LogItem|false>;
}

export interface LogItemWithSource extends LogItem {
  source: LogSourceType;
}

export interface PrinterType {
  last: Date;
  logsPrinted: number;
  startTime: Date|undefined;
  print: (item: LogItem) => void;
  done: () => void;
}