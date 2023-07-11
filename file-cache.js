const { existsSync, readFileSync, writeFileSync, unlinkSync } = require('fs');
const { tmpdir } = require('os');

class FileCache {
  /**
   * Creates an instance of FileCache.
   * @param {string} [filename] - Optional custom filename for the cache.
   */
  constructor(filename) {
    this.filename = filename ? filename : `${tmpdir()}/file_cache.json`;
    this.#loadCache();
  }

  #loadCache() {
    try {
      if (existsSync(this.filename)) {
        const data = readFileSync(this.filename, 'utf8');
        this.cache = JSON.parse(data);
      } else {
        this.cache = {};
      }
    } catch (error) {
      console.error('Error loading cache:', error);
      this.cache = {};
    }
  }

  #saveCache() {
    try {
      writeFileSync(this.filename, JSON.stringify(this.cache), 'utf8');
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  /**
   * Sets a value in the cache for the given key.
   * @param {string} key - The cache key.
   * @param {*} value - The value to be cached.
   */
  set(key, value) {
    this.cache[key] = value;
    this.#saveCache();
  }

  /**
   * Sets a value in the cache for the given key.
   * @param {string} key - The cache key.
   * @param {*} value - The value to be cached.
   */
  get(key) {
    return this.cache[key];
  }

  /**
   * Retrieves and removes the value from the cache for the given key.
   * @param {string} key - The cache key.
   * @returns {*} The cached value.
   */
  take(key) {
    const value = this.cache[key];
    delete this.cache[key];
    this.#saveCache();
    return value;
  }

  /**
   * Removes the value from the cache for the given key.
   * @param {string} key - The cache key.
   */
  delete(key) {
    delete this.cache[key];
    this.#saveCache();
  }

  /**
   * Clears the cache by removing all key-value pairs.
   */
  clear() {
    this.cache = {};
    unlinkSync(this.filename);
  }
}

module.exports = FileCache;