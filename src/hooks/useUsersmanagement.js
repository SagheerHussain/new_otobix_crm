import { useCallback, useEffect, useState } from "react";
import {
  fetchUserCounts,
  fetchUsersAll,
  fetchUsersPending,
  fetchUsersApproved,
  fetchUsersRejected,
  updateUserApprovalStatus,
} from "../services/users";

const normalizeList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.users)) return payload.users;
  return [];
};

export function useUsersManagement(token) {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalUsersLength: 0,
    pendingUsersLength: 0,
    approvedUsersLength: 0,
    rejectedUsersLength: 0,
  });

  const [lists, setLists] = useState({
    all: [],
    pending: [],
    approved: [],
    rejected: [],
  });

  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const [countsRes, allRes, pendingRes, approvedRes, rejectedRes] =
        await Promise.all([
          fetchUserCounts(token),
          fetchUsersAll(token),
          fetchUsersPending(token),
          fetchUsersApproved(token),
          fetchUsersRejected(token),
        ]);

      setCounts({
        totalUsersLength: countsRes?.totalUsersLength ?? 0,
        pendingUsersLength: countsRes?.pendingUsersLength ?? 0,
        approvedUsersLength: countsRes?.approvedUsersLength ?? 0,
        rejectedUsersLength: countsRes?.rejectedUsersLength ?? 0,
      });

      setLists({
        all: normalizeList(allRes),
        pending: normalizeList(pendingRes),
        approved: normalizeList(approvedRes),
        rejected: normalizeList(rejectedRes),
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return; // no token, skip load
    load();
  }, [load, token]);

  const refresh = useCallback(() => load(), [load]);

  const updateStatus = useCallback(
    async (userId, nextStatus) => {
      if (!userId || !nextStatus) return;
      try {
        setUpdatingId(userId);
        await updateUserApprovalStatus(token, userId, nextStatus);
        await load();
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to update user status"
        );
      } finally {
        setUpdatingId("");
      }
    },
    [token, load]
  );

  return {
    loading,
    error,
    counts,
    lists,
    refresh,
    updateStatus,
    updatingId,
  };
}
