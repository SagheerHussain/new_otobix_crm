const API_BASE = import.meta.env.VITE_BASE_URL

function joinUrl(base, path) {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

async function apiFetch(url, { token, method = "GET", body, isForm = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body) headers["Content-Type"] = "application/json";

  const res = await fetch(joinUrl(API_BASE, url), {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text().catch(() => "");
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) throw new Error(json?.message || text || "Request failed");
  return json;
}

export const documentApi = {
  getLatest: (base, token) => apiFetch(`${base}/latest`, { token }),
  list: (base, token, { page = 1, limit = 10 } = {}) =>
    apiFetch(`${base}?page=${page}&limit=${limit}`, { token }),
  getByVersion: (base, token, version) => apiFetch(`${base}/${version}`, { token }),

  upload: (base, token, { file, title } = {}) => {
    const fd = new FormData();
    fd.append("file", file);
    if (title) fd.append("title", title);
    return apiFetch(`${base}/upload`, { token, method: "POST", body: fd, isForm: true });
  },
};
