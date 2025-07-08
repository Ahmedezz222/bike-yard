// api.ts - Centralized API utility for frontend

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
  // Prepend base URL if url is relative (doesn't start with http)
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  const res = await fetch(fullUrl, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'API Error');
  }
  return data;
} 