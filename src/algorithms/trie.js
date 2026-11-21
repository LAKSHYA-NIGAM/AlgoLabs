/**
 * Trie (Prefix Tree) Search Engine
 * Supports word insertion, prefix search, autocomplete, and frequency ranking.
 */

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.frequency = 0;
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
    this.wordCount = 0;
  }

  insert(word, frequency = 1) {
    if (typeof word !== 'string' || word.trim().length === 0) return false;
    const sanitized = word.trim().toLowerCase();
    let current = this.root;

    for (const char of sanitized) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char);
    }

    if (!current.isEndOfWord) {
      this.wordCount++;
      current.isEndOfWord = true;
    }
    current.frequency = (current.frequency || 0) + frequency;
    return true;
  }

  search(word) {
    if (typeof word !== 'string') return false;
    const sanitized = word.trim().toLowerCase();
    let current = this.root;

    for (const char of sanitized) {
      if (!current.children.has(char)) return false;
      current = current.children.get(char);
    }
    return current.isEndOfWord;
  }

  startsWith(prefix) {
    if (typeof prefix !== 'string') return false;
    const sanitized = prefix.trim().toLowerCase();
    let current = this.root;

    for (const char of sanitized) {
      if (!current.children.has(char)) return false;
      current = current.children.get(char);
    }
    return true;
  }

  autocomplete(prefix, limit = 5) {
    if (typeof prefix !== 'string') return [];
    const sanitized = prefix.trim().toLowerCase();
    let current = this.root;

    for (const char of sanitized) {
      if (!current.children.has(char)) return [];
      current = current.children.get(char);
    }

    const results = [];
    const traverse = (node, path) => {
      if (node.isEndOfWord) {
        results.push({ word: path, frequency: node.frequency });
      }
      for (const [char, childNode] of node.children.entries()) {
        traverse(childNode, path + char);
      }
    };

    traverse(current, sanitized);
    // Sort descending by frequency then alphabetically
    results.sort((a, b) => b.frequency - a.frequency || a.word.localeCompare(b.word));
    return results.slice(0, limit);
  }
}
