import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// axios instance (recommended)
const api = axios.create({
  baseURL: BASE_URL,
});

// attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem("token") || "null");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

export const fetchBidsSummary = async () => {
  const { data } = await api.get("/admin/bids/summary");
  return data; // { success:true, data:{...} }
};

export const fetchRecentBidsList = async ({
  type = "liveBids",
  range = "all",
  page = 1,
  limit = 25,
  search = "",
}) => {
  const params = { type, range, page, limit };
  if (search?.trim()) params.search = search.trim();

  const { data } = await api.get("/admin/bids/recent-bids-list", { params });
  return data; // { success:true, data:{ bids:[], pagination:{} } }
};
