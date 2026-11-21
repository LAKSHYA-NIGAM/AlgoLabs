/**
 * Longest Common Subsequence (LCS) Dynamic Programming Engine
 * Computes DP table, length of LCS, and step-by-step backtrack reconstruction.
 */

export function computeLCS(str1, str2) {
  const s1 = typeof str1 === 'string' ? str1 : '';
  const s2 = typeof str2 === 'string' ? str2 : '';
  const m = s1.length;
  const n = s2.length;

  // Initialize (m + 1) x (n + 1) DP table
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find all matched characters and coordinate trace
  let i = m;
  let j = n;
  const trace = [];
  const chars = [];

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      chars.unshift(s1[i - 1]);
      trace.unshift({ i, j, char: s1[i - 1], match: true });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      trace.unshift({ i, j, match: false, direction: 'up' });
      i--;
    } else {
      trace.unshift({ i, j, match: false, direction: 'left' });
      j--;
    }
  }

  return {
    length: dp[m][n],
    subsequence: chars.join(''),
    dpTable: dp,
    trace,
  };
}
