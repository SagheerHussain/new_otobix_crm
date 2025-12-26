import axios from "axios";

function resolveBaseUrl() {
  const env = import.meta.env.VITE_BASE_URL;

  // if env already ends with /api/admin use it, otherwise append
  if (env.endsWith("/api/admin")) return env;
  if (env.endsWith("/api")) return `${env}/admin`;
  return `${env}/api/admin`;
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 30000,
});

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ---------------------- Customers Summary ----------------------
export async function getCustomersSummary(token) {
  const res = await api.get("/customers/get-summary-counts", authHeaders(token));
  return res.data;
}

// ---------------------- Car Dropdowns ----------------------
export async function getCarDropdownsList({ token, page = 1, limit = 10, search = "" }) {
  const res = await api.get("/customers/car-dropdowns/get-list", {
    ...authHeaders(token),
    params: { page, limit, search },
  });
  return res.data;
}

export async function addCarDropdown({ token, make, model, variant }) {
  const res = await api.post(
    "/customers/car-dropdowns/add",
    { make, model, variant },
    authHeaders(token)
  );
  return res.data;
}

export async function editCarDropdown({ token, dropdownId, make, model, variant, isActive }) {
  const res = await api.put(
    "/customers/car-dropdowns/edit",
    { dropdownId, make, model, variant, isActive },
    authHeaders(token)
  );
  return res.data;
}

export async function deleteCarDropdown({ token, dropdownId }) {
  const res = await api.delete("/customers/car-dropdowns/delete", {
    ...authHeaders(token),
    data: { dropdownId },
  });
  return res.data;
}

export async function toggleCarDropdownStatus({ token, dropdownId }) {
  const res = await api.put(
    "/customers/car-dropdowns/toggle-status",
    { dropdownId },
    authHeaders(token)
  );
  return res.data;
}

// ---------------------- Banners ----------------------
export async function fetchBannersList({ token, view, type, status }) {
  const res = await api.post(
    "/banners/get-list",
    { view, type, status },
    authHeaders(token)
  );
  return res.data;
}

export async function addBanner({ token, file, screenName, status, type, view }) {
  const form = new FormData();
  form.append("file", file);
  form.append("screenName", screenName);
  form.append("status", status);
  form.append("type", type);
  form.append("view", view);

  const res = await api.post("/banners/add", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function deleteBanner({ token, bannerId }) {
  const res = await api.post("/banners/delete", { bannerId }, authHeaders(token));
  return res.data;
}

export async function updateBannerStatus({ token, bannerId, status }) {
  const res = await api.post("/banners/update-status", { bannerId, status }, authHeaders(token));
  return res.data;
}

export async function fetchBannersCount({ token, type, view }) {
  const res = await api.post("/banners/get-count", { type, view }, authHeaders(token));
  return res.data;
}
