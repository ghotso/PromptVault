export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

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


