"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyCache {
    /**
     * Initializes the cache with a specified maximum size and time-to-live (TTL).
     * Sets up a periodic task to clean up expired cache entries.
     *
     * @param maxSize - The maximum number of entries the cache can hold. Defaults to 3.
     * @param ttl - The time-to-live for each cache entry in milliseconds. Defaults to 2 hours.
     */
    constructor(maxSize = 3, ttl = 2 * 60 * 60 * 1000) {
        this.maxSize = maxSize; // Max cache size
        this.ttl = ttl; // TTL in milliseconds
        this.cache = new Map(); // Key-value store with expiration timestamps
        // Periodically clean expired keys (every 5 seconds)
        setInterval(() => this.cleanup(), 5000);
    }
    /**
     * Gets the singleton instance of the cache.
     * @returns The singleton instance of MyCache
     */
    static getInstance() {
        if (!MyCache.instance) {
            MyCache.instance = new MyCache();
        }
        return MyCache.instance;
    }
    /**
     * Add a key-value pair to the cache or update an existing key.
     * @param key - The key to set
     * @param value - The value to set
     * @returns { success: boolean, message: string }
     *    success: Whether the operation was successful
     *    message: A message describing the result (success or failure reason)
     */
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key); //Refresh key position for LRU
        }
        else if (this.cache.size >= this.maxSize) {
            this.cleanup(); // Clean up expired keys
            if (this.cache.size >= this.maxSize) {
                return {
                    success: false,
                    message: "Cache is full",
                };
            }
        }
        const expiresAt = Date.now() + this.ttl;
        this.cache.set(key, { value, expiresAt });
        return {
            success: true,
            message: "Cache stored successfully",
        };
    }
    /**
     * Get a value from the cache.
     * @param key - The key to retrieve
     * @returns The value associated with the key, or null if the key does not exist or has expired
     */
    get(key) {
        if (!this.cache.has(key)) {
            return null;
        }
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        const { value, expiresAt } = entry;
        if (expiresAt <= Date.now()) {
            this.cache.delete(key);
            return null;
        }
        // Refresh LRU order
        this.cache.delete(key);
        this.cache.set(key, { value, expiresAt });
        return value;
    }
    /**
     * Delete a key from the cache.
     * @param key - The key to delete
     * @returns A boolean indicating whether the key was successfully deleted
     */
    delete(key) {
        return this.cache.delete(key);
    }
    /**
     * Removes expired entries from the cache.
     * Iterates through the cache and deletes any entries
     * whose expiration time is less than or equal to the current time.
     */
    cleanup() {
        const now = Date.now();
        for (const [key, { expiresAt }] of this.cache) {
            if (expiresAt <= now) {
                this.cache.delete(key);
            }
        }
    }
    /**
     * Gets all key-value pairs from the cache.
     * @returns An array of objects with `key`, `value`, and `expiresIn` properties.
     * `expiresIn` is the number of seconds until the cache entry expires.
     */
    getAll() {
        const now = Date.now();
        return Array.from(this.cache).map(([key, { value, expiresAt }]) => ({
            key,
            value,
            expiresIn: Math.max(0, (expiresAt - now) / 1000),
        }));
    }
}
exports.default = MyCache.getInstance();
