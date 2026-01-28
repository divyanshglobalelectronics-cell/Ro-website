// Secure API client: never expose sensitive data in error messages or logs
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function getFullUrl(path) {
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

export async function apiGet(path, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(getFullUrl(path), { headers });
  if (!res.ok) {
    const msg = res.status >= 500 ? 'Server error' : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiPost(path, body, token = null) {  
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(getFullUrl(path), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = res.status >= 500 ? 'Server error' : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiPut(path, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(getFullUrl(path), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = res.status >= 500 ? 'Server error' : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiDelete(path, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(getFullUrl(path), { method: 'DELETE', headers });
  if (!res.ok) {
    const msg = res.status >= 500 ? 'Server error' : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}
