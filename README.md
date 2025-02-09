# 🚀 LRU + TTL In-Memory Cache API (Node.js & TypeScript)

A **customizable in-memory caching API** with **LRU (Least Recently Used) eviction** and **TTL (Time-To-Live) expiration**, built using **Node.js, Express, and TypeScript**.

---

## 📌 Features

✅ **LRU Eviction**: Moves recently accessed items to the end.  
✅ **TTL Expiry**: Auto-deletes expired keys (default: `2min`).  
✅ **Cache Limit**: Prevents storing new items if max size is reached.  
✅ **Efficient GET & DELETE**: O(1) operations using `Map`.  
✅ **Express API**: Simple RESTful interface.

---

## ⚡ Installation & Setup

### 1️⃣ Clone Repository

```sh
git clone https://github.com/your-username/cache-api.git
cd cache-api
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Run the API

```sh
npm run dev
```

🔹 The server starts on http://localhost:3000

📌 API Endpoints

✅ Store a Key-Value Pair

-POST /cache

Request Body

```json
{
  "key": "city",
  "value": "Guwahati"
}
```

Response

```json
{
  "success": true,
  "message": "Cache stored successfully",
  "data": { "city": "Guwahati" }
}
```

🔹 If cache is full and no expired keys exist:

```json
{
    "success": false,
    "message": "Cache is full"
```

✅ Retrieve a Value

GET /cache/{key}

Response

```json
{
  "success": true,
  "data": { "city": "Guwahati" }
}
```

🔹 If key is expired or not found:

```json
{
  "success": false,
  "message": "Key not found or expired"
}
```

✅ Delete a Key

DELETE /cache/{key}

Response

```json
{
  "success": true,
  "message": `Deleted key: city`
}
```

🔹 If key is expired or not found:

```json
{
  "success": false,
  "message": "Key not found"
}
```

✅ Retrieve All Cache Items

GET /cache

Response

```json
{
  "success": true,
  "data": "data": [
        {
            "key": "city",
            "value": "Guwahati",
            "expiresIn": 32.087
        },
        {
            "key": "state",
            "value": "Assam",
            "expiresIn": 63.347
        }
    ]
}
```

🛠️ How It Works • TTL (Expiration): Entries auto-delete after 2min. • LRU (Least Recently Used): Whenever a key is fetched expiry time is renewed. • Cache Full?: Only expired items are removed. If no expired items exist, it returns an error instead of removing LRU. • \* • Periodic Cleanup: Every 5 seconds, expired keys are deleted.

🎯 Future Improvements

✅ Configurable TTL per key ✅ Persistent Storage (Redis) ✅ Web UI for Cache Monitoring

📜 License

This project is open-source and available under the MIT License.
