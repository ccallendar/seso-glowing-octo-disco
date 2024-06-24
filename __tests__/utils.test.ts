import {binarySearchInsert, sortLogItemsByDate} from "../utils/utils";
import {LogItem} from "../types/types";

describe("Utility functions", () => {
  it("should test binarySearchInsert function", () => {
    let sortedArray = [2,4,6,8,10];
    let newItem = 7;
    const comparator = (n1: number, n2: number) => n1 - n2;
    let index = binarySearchInsert(sortedArray, newItem, comparator);
    expect(index).toBe(3);
    expect(sortedArray).toHaveLength(6);
    expect(sortedArray[3]).toBe(newItem);

    sortedArray = [2,4,6,8,10];
    newItem = 4;
    index = binarySearchInsert(sortedArray, newItem, comparator);
    expect(index).toBe(1);
    expect(sortedArray).toHaveLength(6);
    expect(sortedArray[1]).toBe(newItem);
  });

  it("should test binarySearchInsert function with huge array", () => {
    let sortedArray: number[] = [];
    const max = 100000000;
    for (let i = 0; i < max; i++) {
      sortedArray.push(i);
    }
    let newItem = 19616448; // Math.floor(Math.random() * max);
    const comparator = (n1: number, n2: number) => n1 - n2;

    const index = binarySearchInsert(sortedArray, newItem, comparator);
    // Index will match the new item number
    expect(index).toBe(newItem);
    expect(sortedArray).toHaveLength(max + 1);
  });

  it("should test binarySearchInsert function with LogItem objects", () => {
    let sortedArray: LogItem[] = [
      { date: new Date(2024, 0, 24), msg: '0' },
      { date: new Date(2024, 1, 24), msg: '1' },
      { date: new Date(2024, 4, 24), msg: '4' },
      { date: new Date(2024, 5, 24), msg: '5' },
    ];

    let newItem: LogItem =  {
        date: new Date(2024, 2, 24),
        msg: '2'
      };
    const comparator = sortLogItemsByDate;

    let index = binarySearchInsert(sortedArray, newItem, comparator);
    expect(index).toBe(2);
    expect(sortedArray).toHaveLength(5);
    expect(sortedArray[2]).toBe(newItem);

    // Insert another item
    newItem = {
      date: new Date(2024, 3, 24),
      msg: '3'
    };
    index = binarySearchInsert(sortedArray, newItem, comparator);
    expect(index).toBe(3);
    expect(sortedArray).toHaveLength(6);
    expect(sortedArray[3]).toBe(newItem);
  });
});
