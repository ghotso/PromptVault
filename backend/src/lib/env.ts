export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (secret && secret.length > 0) return secret;
  
  // In production, we must have a JWT_SECRET
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is not set in production mode");
  }
  
  // In development/demo mode, use a fallback
  console.warn("JWT_SECRET not set, using development fallback");
  return "dev-jwt-secret-2024-promptvault";
}


