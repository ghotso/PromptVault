"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (secret && secret.length > 0)
        return secret;
    if (process.env.NODE_ENV !== "production") {
        return "dev-secret-change-me";
    }
    throw new Error("JWT_SECRET is not set");
}
