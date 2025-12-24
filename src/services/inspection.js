// src/api/adminInspectionRequests.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchInspectionRequests({
  token,
  page = 1,
  limit = 10,
  search = "",
}) {
  try {
    const res = await axios.get(
      `${BASE_URL}/admin/inspection-requests/get-list`,
      {
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    // keep same "text or default" style error message
    const msg =
      err?.response?.data?.message ||
      (typeof err?.response?.data === "string" ? err.response.data : "") ||
      err?.message ||
      "Failed to fetch inspection requests";

    throw new Error(msg);
  }
}
