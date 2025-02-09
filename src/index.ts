import express, { Request, Response } from "express"
require("dotenv").config()
import MyCache from "./cache"

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())

// Add key  to the cache
app.post("/cache", (req: Request, res: Response) => {
  const { key, value } = req.body

  if (!key || !value) {
    res.status(400).json({
      success: false,
      message: "Missing key or value",
    })
    return
  }

  const message = MyCache.set(key, value)

  if (!message.success) {
    res.status(403).json({
      success: false,
      message: message.message,
    })
    return
  }

  res
    .status(201)
    .json({ success: true, message: message.message, data: { [key]: value } })
  return
})

// Retrieve a value
app.get("/cache/:key", (req: Request, res: Response) => {
  const key = req.params.key
  const value = MyCache.get(key)

  if (value === null) {
    res
      .status(404)
      .json({ success: false, message: "Key not found or expired" })
    return
  }

  res.json({ success: true, data: { [key]: value } })
})

// DELETE key from cache
app.delete("/cache/:key", (req: Request, res: Response) => {
  const key = req.params.key
  const deleted = MyCache.delete(key)

  if (!deleted) {
    res.status(404).json({ success: false, message: "Key not found" })
    return
  }

  res.json({ success: true, message: `Deleted key: ${key}` })
  return
})

//Get all cache
app.get("/cache", (req: Request, res: Response) => {
  const myCache = MyCache.getAll()

  res.json({ success: true, data: myCache })
  return
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
