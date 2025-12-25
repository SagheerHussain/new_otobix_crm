import { useEffect, useMemo, useState } from "react";
import { documentApi } from "../services/document";

export function useDocumentManager({ base, token }) {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [latest, setLatest] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const selected = useMemo(() => selectedDoc || latest, [selectedDoc, latest]);

  const refresh = async () => {
    setError("");
    setLoading(true);
    try {
      const [latestRes, listRes] = await Promise.all([
        documentApi.getLatest(base, token),
        documentApi.list(base, token, { page: 1, limit: 12 }),
      ]);

      const latestDoc = latestRes?.data || null;
      setLatest(latestDoc);

      const list = listRes?.items || [];
      setVersions(list);

      // default select latest
      if (latestDoc?.version) {
        setSelectedVersion(latestDoc.version);
        setSelectedDoc(latestDoc);
      } else {
        setSelectedVersion(null);
        setSelectedDoc(null);
      }
    } catch (e) {
      setError(e?.message || "Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!base || !token) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, token]);

  const pickVersion = async (version) => {
    setError("");
    setSelectedVersion(version);
    try {
      const res = await documentApi.getByVersion(base, token, version);
      setSelectedDoc(res?.data || null);
    } catch (e) {
      setError(e?.message || "Failed to fetch version");
    }
  };

  const upload = async ({ file, title }) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      await documentApi.upload(base, token, { file, title });
      await refresh();
      return true;
    } catch (e) {
      setError(e?.message || "Upload failed");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    loading,
    uploading,
    error,
    latest,
    versions,
    selectedVersion,
    selected,
    refresh,
    pickVersion,
    upload,
  };
}
