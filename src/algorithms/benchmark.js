/**
 * Algorithm Complexity & Performance Benchmark Suite
 * Compares operation counts (comparisons, assignments/swaps) and execution times.
 */

export function bubbleSortBenchmark(inputArray) {
  const arr = [...inputArray];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  return { sorted: arr, comparisons, swaps, algorithm: 'BubbleSort' };
}

export function mergeSortBenchmark(inputArray) {
  const arr = [...inputArray];
  let comparisons = 0;
  let assignments = 0;

  function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
      assignments++;
    }

    while (i < left.length) {
      result.push(left[i++]);
      assignments++;
    }
    while (j < right.length) {
      result.push(right[j++]);
      assignments++;
    }

    return result;
  }

  function sort(list) {
    if (list.length <= 1) return list;
    const mid = Math.floor(list.length / 2);
    const left = sort(list.slice(0, mid));
    const right = sort(list.slice(mid));
    return merge(left, right);
  }

  const sorted = sort(arr);
  return { sorted, comparisons, assignments, algorithm: 'MergeSort' };
}

export function compareSortingAlgorithms(size = 100) {
  const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
  const bubble = bubbleSortBenchmark(randomArray);
  const merge = mergeSortBenchmark(randomArray);

  return {
    inputSize: size,
    bubbleSort: { comparisons: bubble.comparisons, swaps: bubble.swaps },
    mergeSort: { comparisons: merge.comparisons, assignments: merge.assignments },
    efficiencyRatio: Math.round((bubble.comparisons / Math.max(1, merge.comparisons)) * 100) / 100
  };
}
