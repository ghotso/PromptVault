// Auto-detect API base URL for Docker deployments
const getApiBase = () => {
  // If we have an environment variable, use it
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // Auto-detect based on current location
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
};

export const API_BASE = getApiBase();

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let err: any = null;
    try { err = await res.json(); } catch { /* ignore */ }
    throw new Error(err?.error || `Request failed: ${res.status}`);
  }
  return res.json();
}


