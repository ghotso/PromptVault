export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  // Debug logging
  console.log("=== JWT SECRET DEBUG ===");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("JWT_SECRET exists:", !!secret);
  console.log("JWT_SECRET length:", secret?.length);
  console.log("JWT_SECRET first 10 chars:", secret?.substring(0, 10));
  console.log("========================");
  
  if (secret && secret.length > 0) return secret;
  
  // In production, we must have a JWT_SECRET
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is not set in production mode");
  }
  
  // In development/demo mode, use a fallback
  console.warn("JWT_SECRET not set, using development fallback");
  return "dev-jwt-secret-2024-promptvault";
}


