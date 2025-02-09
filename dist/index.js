"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cache_1 = __importDefault(require("./cache"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use(express_1.default.json());
// Add key  to the cache
app.post("/cache", (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        res.status(400).json({
            success: false,
            message: "Missing key or value",
        });
        return;
    }
    const message = cache_1.default.set(key, value);
    if (!message.success) {
        res.status(403).json({
            success: false,
            message: message.message,
        });
        return;
    }
    res
        .status(201)
        .json({ success: true, message: message.message, data: { [key]: value } });
    return;
});
// Retrieve a value
app.get("/cache/:key", (req, res) => {
    const key = req.params.key;
    const value = cache_1.default.get(key);
    if (value === null) {
        res
            .status(404)
            .json({ success: false, message: "Key not found or expired" });
        return;
    }
    res.json({ success: true, data: { [key]: value } });
});
// DELETE key from cache
app.delete("/cache/:key", (req, res) => {
    const key = req.params.key;
    const deleted = cache_1.default.delete(key);
    if (!deleted) {
        res.status(404).json({ success: false, message: "Key not found" });
        return;
    }
    res.json({ success: true, message: `Deleted key: ${key}` });
    return;
});
//Get all cache
app.get("/cache", (req, res) => {
    const myCache = cache_1.default.getAll();
    res.json({ success: true, data: myCache });
    return;
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
