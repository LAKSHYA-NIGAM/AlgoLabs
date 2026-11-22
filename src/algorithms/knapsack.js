/**
 * 0/1 Knapsack Dynamic Programming Engine
 * Computes maximum achievable value, DP state matrix, and selected item indices.
 */

export function solveKnapsack(capacity, items) {
  const cap = Math.floor(Number(capacity));
  if (isNaN(cap) || cap <= 0 || !Array.isArray(items) || items.length === 0) {
    return { maxValue: 0, selectedItems: [], dpTable: [[0]] };
  }

  // Filter valid items with positive integer/number weight and non-negative value
  const validItems = items.filter(
    (item) => item && typeof item.weight === 'number' && item.weight > 0 && typeof item.value === 'number' && item.value >= 0
  );

  const n = validItems.length;
  // Initialize (n + 1) x (cap + 1) table
  const dp = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { weight, value } = validItems[i - 1];
    for (let w = 0; w <= cap; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find chosen items
  let currW = cap;
  const selectedItems = [];
  for (let i = n; i > 0 && currW > 0; i--) {
    if (dp[i][currW] !== dp[i - 1][currW]) {
      selectedItems.push(validItems[i - 1]);
      currW -= validItems[i - 1].weight;
    }
  }

  return {
    maxValue: dp[n][cap],
    selectedItems: selectedItems.reverse(),
    dpTable: dp,
    totalWeight: selectedItems.reduce((acc, curr) => acc + curr.weight, 0),
  };
}
