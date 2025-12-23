import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginAccount = async (payload) => {
  const resp = await axios.post(`${BASE_URL}/user/login`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  console.log("Inside Auth Response ===== >", resp);
  return resp.data;
};
