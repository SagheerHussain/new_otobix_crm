// src/api/kams.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; 
// IMPORTANT: BASE_URL should be: https://otobix-app-backend-development.onrender.com
// (without /api)

function extractErr(err, fallback) {
  return (
    err?.response?.data?.message ||
    (typeof err?.response?.data === "string" ? err.response.data : "") ||
    err?.message ||
    fallback
  );
}

// ✅ GET LIST
export async function fetchKams({ token }) {
  try {
    const res = await axios.get(`${BASE_URL}/admin/kams/get-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // your response: { ok:true, data:[...] }
    return Array.isArray(res?.data?.data) ? res.data.data : [];
  } catch (err) {
    throw new Error(extractErr(err, "Failed to fetch KAM list"));
  }
}

// ✅ CREATE (keep if your backend has this route)
export async function createKam({ token, payload }) {
  try {
    const res = await axios.post(`${BASE_URL}/admin/kams/create`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErr(err, "Failed to create KAM"));
  }
}

// ✅ UPDATE (YOUR BACKEND expects id in req.body)
export async function updateKam({ token, id, payload }) {
  try {
    const res = await axios.put(
      `${BASE_URL}/admin/kams/update`,
      { id, ...payload }, // ✅ id in body
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    throw new Error(extractErr(err, "Failed to update KAM"));
  }
}

// ✅ DELETE (YOUR BACKEND expects id in req.body)
export async function deleteKam({ token, id }) {
  try {
    const res = await axios.post(
      `${BASE_URL}/admin/kams/delete`,
      { id }, // ✅ body (backend expects req.body.id)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      (typeof err?.response?.data === "string" ? err.response.data : "") ||
      err?.message ||
      "Failed to delete KAM";

    throw new Error(msg);
  }
}



const safeBase = BASE_URL?.endsWith("/api") ? BASE_URL.slice(0, -4) : BASE_URL;

export const fetchKamsList = async (token) => {
  const res = await axios.get(`${safeBase}/api/admin/kams/get-list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const assignKamToDealer = async ({ token, dealerId, kamId }) => {
  const res = await axios.post(
    `${safeBase}/api/admin/kams/assign-to-dealer`,
    {
      dealerId,
      kamId: kamId || "", // ✅ empty string means unassign
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

