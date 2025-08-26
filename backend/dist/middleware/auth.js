"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../lib/env");
function requireAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const payload = jsonwebtoken_1.default.verify(token, (0, env_1.getJwtSecret)());
        req.auth = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
function requireAdmin(req, res, next) {
    if (!req.auth)
        return res.status(401).json({ error: "Unauthorized" });
    if (req.auth.role !== "ADMIN")
        return res.status(403).json({ error: "Forbidden" });
    next();
}
