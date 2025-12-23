import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeaders = () => {
  const rawToken = localStorage.getItem("token");
  let token = "";

  try {
    token = JSON.parse(rawToken); // because you stored JSON.stringify(token)
  } catch {
    token = rawToken || "";
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchAdminSummary = async () => {
  const { data } = await axios.get(
    `${BASE_URL}/admin/dashboard/get-reports-summary`,
    { headers: authHeaders() }
  );
  // expected: { ok:true, data:{ totalDealers,... } }
  return data;
};

export const fetchSalesManagerUsersLength = async () => {
  const { data } = await axios.get(`${BASE_URL}/user/users-length`, {
    headers: authHeaders(),
  });
  // expected: { success:true, approvedUsersLength, rejectedUsersLength, pendingUsersLength ... }
  return data;
};

export const fetchDealersByMonths = async (year) => {
  const { data } = await axios.get(
    `${BASE_URL}/admin/dashboard/get-dealers-by-months`,
    {
      headers: authHeaders(),
      params: year ? { year } : undefined, // if backend supports ?year=2025
    }
  );
  return data; // { ok:true, data:{series,categories,...}}
};