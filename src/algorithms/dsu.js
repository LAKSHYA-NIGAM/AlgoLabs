/**
 * Disjoint Set Union (DSU) / Union-Find Data Structure
 * Implements Path Compression and Union by Rank
 */
export class DSU {
  constructor(size = 0) {
    const safeSize = Math.max(0, Number.isInteger(size) ? size : 0);
    this.size = safeSize;
    this.parent = Array.from({ length: safeSize }, (_, i) => i);
    this.rank = new Array(safeSize).fill(0);
  }

  /**
   * Find with Path Compression
   * @param {number} x
   * @param {number[]} pathHistory - optional array to record traversal path
   * @returns {number} representative root or -1 if out of bounds
   */
  find(x, pathHistory = null) {
    if (x < 0 || x >= this.size) {
      return -1;
    }
    if (pathHistory) {
      pathHistory.push(x);
    }
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x], pathHistory);
    }
    return this.parent[x];
  }

  /**
   * Non-destructive peek at root without modifying path
   * @param {number} x
   * @returns {number} representative root or -1 if out of bounds
   */
  getRoot(x) {
    if (x < 0 || x >= this.size) {
      return -1;
    }
    let curr = x;
    while (this.parent[curr] !== curr) {
      curr = this.parent[curr];
    }
    return curr;
  }

  /**
   * Union by Rank
   * @param {number} x
   * @param {number} y
   * @returns {{ success: boolean, rootX: number, rootY: number, rankX: number, rankY: number }}
   */
  union(x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      return {
        success: false,
        rootX: -1,
        rootY: -1,
        rankX: 0,
        rankY: 0,
      };
    }

    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return {
        success: false,
        rootX,
        rootY,
        rankX: this.rank[rootX],
        rankY: this.rank[rootY],
      };
    }

    // Attach smaller rank tree under larger rank tree
    let newRoot = rootX;
    let attached = rootY;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      newRoot = rootY;
      attached = rootX;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      newRoot = rootX;
      attached = rootY;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
      newRoot = rootX;
      attached = rootY;
    }

    return {
      success: true,
      rootX,
      rootY,
      newRoot,
      attached,
      rankX: this.rank[rootX],
      rankY: this.rank[rootY],
    };
  }

  /**
   * Check if two elements share the same root
   */
  connected(x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      return false;
    }
    return this.find(x) === this.find(y);
  }

  /**
   * Returns total count of distinct disjoint components
   * @returns {number}
   */
  getComponentCount() {
    if (this.size === 0) return 0;
    const roots = new Set();
    for (let i = 0; i < this.size; i++) {
      roots.add(this.getRoot(i));
    }
    return roots.size;
  }

  /**
   * Returns a deep clone of the current DSU state
   */
  clone() {
    const copy = new DSU(this.size);
    copy.parent = [...this.parent];
    copy.rank = [...this.rank];
    return copy;
  }

  /**
   * Groups vertices by their current root representative
   */
  getComponents(size = this.size) {
    const components = {};
    const safeLimit = Math.min(size, this.size);
    for (let i = 0; i < safeLimit; i++) {
      const root = this.getRoot(i);
      if (!components[root]) {
        components[root] = [];
      }
      components[root].push(i);
    }
    return components;
  }
}
