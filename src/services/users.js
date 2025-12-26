import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Your backend routes are under /api/user
const endpoints = {
  counts: "/user/users-length",
  all: "/user/all-users-list",
  pending: "/user/pending-users-list",
  approved: "/user/approved-users-list",
  rejected: "/user/rejected-users-list",
  updateByAdmin: "/user/update-user-through-admin", // PUT ?userId=...
};

function authHeaders(token) {
  // token could be string OR object depending on your storage
  const finalToken =
    typeof token === "string"
      ? token
      : token?.token || token?.accessToken || token?.jwt || token?.value || token;

  return finalToken ? { Authorization: `Bearer ${finalToken}` } : {};
}

export async function fetchUserCounts(token) {
  const { data } = await axios.get(`${BASE_URL}${endpoints.counts}`, {
    headers: authHeaders(token),
  });
  return data;
}

export async function fetchUsersAll(token) {
  const { data } = await axios.get(`${BASE_URL}${endpoints.all}`, {
    headers: authHeaders(token),
  });
  return data;
}

export async function fetchUsersPending(token) {
  const { data } = await axios.get(`${BASE_URL}${endpoints.pending}`, {
    headers: authHeaders(token),
  });
  return data;
}

export async function fetchUsersApproved(token) {
  const { data } = await axios.get(`${BASE_URL}${endpoints.approved}`, {
    headers: authHeaders(token),
  });
  return data;
}

export async function fetchUsersRejected(token) {
  const { data } = await axios.get(`${BASE_URL}${endpoints.rejected}`, {
    headers: authHeaders(token),
  });
  return data;
}

// ✅ Change to ANY status (Pending/Approved/Rejected) using existing backend endpoint
export async function updateUserApprovalStatus(token, userId, approvalStatus) {
  const { data } = await axios.put(
    `${BASE_URL}${endpoints.updateByAdmin}?userId=${encodeURIComponent(userId)}`,
    { approvalStatus },
    { headers: authHeaders(token) }
  );
  return data;
}


export async function updateProfile(token, formData) {
  const res = await axios.put(`${BASE_URL}/user/update-profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type manually for FormData; browser will set boundary.
    },
  });

  return res.data; // { success, message, user }
}