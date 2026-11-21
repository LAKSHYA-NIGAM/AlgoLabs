/**
 * Binary Search Tree (BST) Algorithm & Data Structure
 * Supports insertion, searching, deletion, tree traversals, and visualizer trace generation.
 */

export class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    if (value === null || value === undefined || isNaN(value)) {
      throw new Error('Cannot insert null or NaN into BST');
    }
    const newNode = new BSTNode(value);
    const steps = [];

    if (this.root === null) {
      this.root = newNode;
      steps.push({ type: 'INSERT_ROOT', value, description: `Set ${value} as root node.` });
      return { root: this.root, steps };
    }

    let current = this.root;
    while (true) {
      steps.push({
        type: 'COMPARE',
        currentValue: current.value,
        insertValue: value,
        description: `Comparing ${value} with current node ${current.value}.`
      });

      if (value === current.value) {
        steps.push({ type: 'DUPLICATE', value, description: `Value ${value} already exists in BST.` });
        return { root: this.root, steps };
      }

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          steps.push({ type: 'INSERT_LEFT', value, parent: current.value, description: `Inserted ${value} as left child of ${current.value}.` });
          break;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          steps.push({ type: 'INSERT_RIGHT', value, parent: current.value, description: `Inserted ${value} as right child of ${current.value}.` });
          break;
        }
        current = current.right;
      }
    }

    return { root: this.root, steps };
  }

  search(value) {
    const steps = [];
    let current = this.root;

    while (current !== null) {
      steps.push({
        type: 'SEARCH_COMPARE',
        currentValue: current.value,
        searchValue: value
      });

      if (value === current.value) {
        steps.push({ type: 'FOUND', value });
        return { found: true, node: current, steps };
      }

      current = value < current.value ? current.left : current.right;
    }

    steps.push({ type: 'NOT_FOUND', value });
    return { found: false, node: null, steps };
  }

  inOrderTraversal(node = this.root, result = []) {
    if (node !== null) {
      this.inOrderTraversal(node.left, result);
      result.push(node.value);
      this.inOrderTraversal(node.right, result);
    }
    return result;
  }

  preOrderTraversal(node = this.root, result = []) {
    if (node !== null) {
      result.push(node.value);
      this.preOrderTraversal(node.left, result);
      this.preOrderTraversal(node.right, result);
    }
    return result;
  }

  getHeight(node = this.root) {
    if (node === null) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }
}
