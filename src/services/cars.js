import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return "";
  try {
    return JSON.parse(raw) || "";
  } catch {
    return raw;
  }
};

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const fetchCarsSummaryCounts = async () => {
  const res = await axios.get(`${BASE_URL}/admin/cars/get-summary-counts`, {
    headers: authHeaders(),
  });
  return res.data;
};

// ✅ list API (with optional filters)
export const fetchCarsList = async ({ status, page = 1, limit = 10 }) => {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const res = await axios.get(
    `${BASE_URL}/admin/cars/get-cars-list?${params.toString()}`,
    { headers: authHeaders() }
  );

  return res.data;
};

export const fetchCarDetails = async (carId) => {
  const res = await fetch(`${BASE_URL}/car/details/${carId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Failed to fetch car details");
  return data;
};

// POST: /api/admin/cars/get-highest-bids-on-car
export const fetchHighestBidsOnCar = async (carId) => {
  const res = await fetch(`${BASE_URL}/admin/cars/get-highest-bids-on-car`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ carId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Failed to fetch highest bids");
  return data;
};