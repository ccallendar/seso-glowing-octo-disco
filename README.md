<img align="left" width="100px" height="100px" src="/assets/seso-eng-logo.png">

# Seso Engineering | Challenge: Log Sorting

<br>

## Instructions

We have a number of [**log sources**](https://github.com/sesolabor/coding-challenge/blob/master/lib/log-source.js). Each log source contains N log entries. Each entry is a javascript object with a timestamp and message. We don't know the number of log entries each source contains - however - we do know that the entries within each source are sorted 🕒 **chronologically** 🕒.

### The Objectives:

1. **_Drain all of the log sources_** for both the synchronous and asynchronous solutions.
   - [Synchronous](https://github.com/sesolabor/coding-challenge/blob/31313e303c53cebb96fa02f3aab473dd011e1d16/lib/log-source.js#L37)
   - [Asynchronous](https://github.com/sesolabor/coding-challenge/blob/31313e303c53cebb96fa02f3aab473dd011e1d16/lib/log-source.js#L45)
1. Print all of the entries, across all of the sources, in chronological order.
   - We don't need to store the log entries, just print them to stdout.
1. Do this _efficiently_. There are time and space complexities afoot!

We expect candidates to spend 1-3 hours on this exercise.

**We want to see you flex your CS muscles!!! Use the appropriate data structures to satisfy the time and space complexities inherent to the problem!!!**

## Pointers & Callouts

- We don't know how many logs each source contains. A source could contain millions of entries and be exabytes in size! In other words, reading the entirety of a log source into memory won't work well.
- Log sources could contain logs from last year, from yesterday, even from 100 years ago. We won't know the timeframe of a log source until we start looking.
- Consider what would happen when asked to merge 1 million log sources. Where might bottlenecks arise?

There are two parts of the challenge which you'll see when diving into things. You can get started by running `npm start`.

## Submitting

Create a GitHub repo and email your point of contact the link.

If - for whatever reason - you cannot create a GitHub repo for this challenge, it is also acceptable to 'zip' the directory and provide your submission as an email attachment.

## Solution

### TypeScript Changes

First I decided to convert the project into TypeScript as that is what I prefer.
I left the two existing JavaScript lib files (`log-source.js` and `printer.js`) untouched.
But all other files were converted to TypeScript.

A few npm dependencies were added - typescript, ts-node, ts-jest and some types.

I upgraded jest to a newer version to keep ts-jest happy.

Finally, the `package.json` start and test scripts were changed to use `ts-node` and `ts-jest`.

### Basics

Each log item has a Date value (until the source is drained).
The date is converted into a number to use for sorting the items.

### Initial Sync Solution - simple array sort

The first method I tried was a simple array sort.
Pop one item off each log source and put them in an array.
Then sort the array, unshift the first/oldest and print it out.
Then pop the next item from the same the source and insert it into array and re-sort.
Continue until all sources are drained.

It worked, but for a larger number of sources, it gets very slow due to having to 
re-sort the array after each insert.

### Optimized Sync Solution - binary search insertion

The next thing I tried was using a binary search algorithm to insert the items
into a sorted array.

It performs much better, and greatly reduces the time needed to keep the array sorted.
The code for that is in the `utils/utils.ts` file - the `binarySearchInsert()` function.

### Initial Async Solution

The async solution is very similar to the synchronous one.
Pop the first item off each source. To improve the wait time I used
`Promise.all()` to load them in parallel. 

One tiny thing to mention is that I attach the log source to the log item.
See the `LogItemWithSource` type in `types/types.ts`.
This allows me to know which log item belongs to which source.
There are other ways to do this - I could have used a `Map`, but for simplicity
I just assigned it to the same object. Normally I would create a new object that
contains the same properties as well as the source, but in this case I felt the
overhead of duplicating all those objects wasn't worth it. 

After the initial load of the first item from each source, then I pop 
one item off the same source as we did in the sync version.

The same binary search insertion algorithm was used.

This solution works, but the small millisecond delays that each `popAsync()` takes
really add up. And this makes the async solution take way longer.

### Optimization Async Solution - preload next item

To try and reduce the amount of time spent waiting for the next `popAsync()`,
I wrote a wrapper class (`lib/PreloadSource.ts`) that simply wraps the existing
`LogSource` and preloads the next item.

### Other Attempts

I originally had thought I could preload ~10-20 items for each log source and do it
all in parallel (using `Promise.all`), but unfortunately the `popAsync()` function
stores the last value in the instance, so you can't load them in parallel without
overwriting that value. I'm sure it is possible to load them and save 
the values in the right order in a 'preload' array, but I think I've spent too much
time on this task already!

### Replay Log Source

I also included an extra file `lib/ReplaySource.ts`.
I used it for testing different algorithms with the same log source.
It wraps a `LogSource` and stores the items in an array as they get popped of.
This allows it to be reused on two different algorithms, so they can be compared.
It doesn't work identically for the async case as the `popAsync()` function uses
a random delay ([0-8]ms) which isn't available without modifying `log-source.js`.
So instead I just hardcoded the average of 4ms for testing.