// src/pages/KAMManagement/KAMManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useHeader } from "../context/HeaderContext";
import Table from "../components/Table";

import useDebouncedValue from "../components/KAM/useDebouncedValue";
import { fetchKams, createKam, updateKam, deleteKam } from "../services/kams";

import KAMModal from "../components/KAM/KAMModel";
import ConfirmDeleteModal from "../components/KAM/ConfirmDeleteModel";
import { buildKamColumns } from "../components/KAM/KAMColumns";

export default function KAMManagement() {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();

    const [kams, setKams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 150);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal states
    const [kamModalOpen, setKamModalOpen] = useState(false);
    const [kamModalMode, setKamModalMode] = useState("create"); // create | edit
    const [selectedKam, setSelectedKam] = useState(null);
    const [saving, setSaving] = useState(false);

    // Delete confirm
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const token = JSON.parse(localStorage.getItem("token"));

    const loadKams = async () => {
        setLoading(true);
        try {
            const list = await fetchKams({ token });
            console.log("list === >", list)
            setKams(list);
        } catch (e) {
            setKams([]);
            console.error("Failed to load KAMs:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKams();
    }, []);

    // Header (same style as your Telecalling page)
    useEffect(() => {
        setTitle("KAM Management");

        setSearchContent(
            <div className="relative group w-full max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name, email, phone, or region..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-none"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>
        );

        setActionsContent(
            <div className="flex items-center gap-2">
                <button
                    onClick={() => {
                        setSelectedKam(null);
                        setKamModalMode("create");
                        setKamModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add KAM</span>
                </button>
            </div>
        );
    }, [setTitle, setSearchContent, setActionsContent, searchTerm]);

    // Filter + pagination
    const { currentRows, pagination, emptyMessage } = useMemo(() => {
        const q = (debouncedSearch || "").trim().toLowerCase();

        const filtered = !q
            ? kams
            : kams.filter((k) => {
                const name = (k?.name || "").toLowerCase();
                const email = (k?.email || "").toLowerCase();
                const phone = (k?.phoneNumber || "").toLowerCase();
                const region = (k?.region || "").toLowerCase();
                return name.includes(q) || email.includes(q) || phone.includes(q) || region.includes(q);
            });

        const totalItems = filtered?.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const sliced = filtered?.slice(startIndex, endIndex);

        return {
            currentRows: sliced,
            emptyMessage: q ? "No KAM found for your search" : "No KAM records found",
            pagination: {
                currentPage,
                totalItems,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                startIndex,
                endIndex: Math.min(endIndex, totalItems),
                onNext: () => setCurrentPage((p) => p + 1),
                onPrev: () => setCurrentPage((p) => p - 1),
                onSetPage: (p) => setCurrentPage(p),
                canNext: startIndex + itemsPerPage < totalItems,
                canPrev: currentPage > 1,
            },
        };
    }, [kams, debouncedSearch, currentPage]);

    const onEdit = (row) => {
        setSelectedKam(row);
        setKamModalMode("edit");
        setKamModalOpen(true);
    };

    const onDelete = (row) => {
        setDeleteTarget(row);
        setConfirmOpen(true);
    };

    const columns = useMemo(() => buildKamColumns({ onEdit, onDelete }), []);

    const handleCreateOrUpdate = async (payload) => {
        setSaving(true);
        try {
            if (kamModalMode === "edit") {
                const id = selectedKam?.id || selectedKam?._id;
                await updateKam({ token, id, payload });
            } else {
                await createKam({ token, payload });
            }
            await loadKams();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        try {
            const id = deleteTarget?.id || deleteTarget?._id;

            await deleteKam({ token, id });

            // ✅ close modal first (UI instant)
            setConfirmOpen(false);
            setDeleteTarget(null);

            // ✅ update rows
            setKams((prev) => prev.filter((k) => (k.id || k._id) !== id));
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };



    return (
        <div className="flex flex-col h-full bg-background-light font-display">
            <div className="px-4 md:px-0">
                <div className="h-[calc(100vh-320px)] bg-white border border-gray-200">
                    <Table
                        columns={columns}
                        data={currentRows}
                        isLoading={loading}
                        pagination={pagination}
                        keyField="id"
                        emptyMessage={emptyMessage}
                    />
                </div>
            </div>


            {/* Optional mobile view kept minimal (same as before) */}
            <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {loading ? (
                    <div className="bg-white p-4 border border-gray-100 text-slate-400 text-sm">Loading...</div>
                ) : currentRows.length === 0 ? (
                    <div className="bg-white p-4 border border-gray-100 text-slate-400 text-sm">{emptyMessage}</div>
                ) : (
                    currentRows.map((k) => (
                        <div key={k?.id || k?._id} className="bg-white p-3 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-bold text-slate-900">{k?.name || "-"}</div>
                                    <div className="text-xs text-slate-500">{k?.email || "-"}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(k)}
                                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 hover:bg-gray-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(k)}
                                        className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                                <div>
                                    <div className="text-[10px] text-slate-400">Phone</div>
                                    <div className="font-mono">{k?.phoneNumber || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400">Region</div>
                                    <div>{k?.region || "-"}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <KAMModal
                open={kamModalOpen}
                mode={kamModalMode}
                initialData={selectedKam}
                busy={saving}
                onClose={() => setKamModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
            />

            <ConfirmDeleteModal
                open={confirmOpen}
                title="Delete KAM"
                message="Are you sure you want to delete?"
                busy={deleting}
                onCancel={() => {
                    setConfirmOpen(false);
                    setDeleteTarget(null);
                }}
                onYes={handleDelete}
            />
        </div>
    );
}
