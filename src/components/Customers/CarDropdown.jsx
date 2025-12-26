import React, { useEffect, useMemo, useState } from "react";
import Table from "../Table";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import {
  getCarDropdownsList,
  addCarDropdown,
  editCarDropdown,
  deleteCarDropdown,
  toggleCarDropdownStatus,
} from "../../services/customers";

import CarDropdownModal from "./CarDropdownModal";
import ConfirmDialog from "./ConfirmDialog";
import Pill from "./ui/Pill";
import SectionShell from "./ui/SectionShell";
import IconButton from "./ui/IconButton";

function useDebounced(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function CarDropdown({ token, search, onAnyMutation }) {
  const debouncedSearch = useDebounced(search, 300);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [paginationApi, setPaginationApi] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
  });

  const [openModal, setOpenModal] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    onYes: null,
  });

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getCarDropdownsList({
        token,
        page,
        limit,
        search: debouncedSearch,
      });

      setRows(res.data || []);
      setPaginationApi(res.pagination || paginationApi);
    } finally {
      setLoading(false);
    }
  };

  // reset page on new search
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  const columns = useMemo(
    () => [
      {
        header: "Full Name",
        accessor: "fullName",
        width: "28%",
        className: "font-medium text-slate-900",
        render: (r) => (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <div className="truncate">{r.fullName}</div>
          </div>
        ),
      },
      { header: "Make", accessor: "make", width: "18%" },
      { header: "Model", accessor: "model", width: "20%" },
      { header: "Variant", accessor: "variant", width: "16%" },
      {
        header: "Status",
        width: "10%",
        render: (r) =>
          r.isActive ? (
            <Pill tone="green">Active</Pill>
          ) : (
            <Pill tone="red">Inactive</Pill>
          ),
      },
      {
        header: "Actions",
        width: "8%",
        align: "right",
        render: (r) => (
          <div className="flex items-center justify-end gap-2">
            <IconButton
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                setEditRow(r);
                setOpenModal(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </IconButton>

            <IconButton
              title={r.isActive ? "Deactivate" : "Activate"}
              onClick={(e) => {
                e.stopPropagation();
                setConfirm({
                  open: true,
                  title: r.isActive
                    ? "Deactivate dropdown?"
                    : "Activate dropdown?",
                  message: `This will mark "${r.fullName}" as ${
                    r.isActive ? "Inactive" : "Active"
                  }.`,
                  onYes: async () => {
                    await toggleCarDropdownStatus({ token, dropdownId: r._id });
                    setConfirm({
                      open: false,
                      title: "",
                      message: "",
                      onYes: null,
                    });
                    await fetchList();
                    onAnyMutation?.();
                  },
                });
              }}
            >
              {r.isActive ? (
                <ToggleRight className="w-5 h-5 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-500" />
              )}
            </IconButton>

            <IconButton
              title="Delete"
              danger
              onClick={(e) => {
                e.stopPropagation();
                setConfirm({
                  open: true,
                  title: "Delete dropdown?",
                  message: `This will permanently delete "${r.fullName}".`,
                  onYes: async () => {
                    await deleteCarDropdown({ token, dropdownId: r._id });
                    setConfirm({
                      open: false,
                      title: "",
                      message: "",
                      onYes: null,
                    });
                    await fetchList();
                    onAnyMutation?.();
                  },
                });
              }}
            >
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </div>
        ),
      },
    ],
    [token]
  );

  const pagination = useMemo(() => {
    const totalItems = paginationApi.totalItems || 0;
    const itemsPerPage = paginationApi.itemsPerPage || limit;
    const currentPage = paginationApi.currentPage || page;
    const totalPages = paginationApi.totalPages || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + rows.length;

    return {
      currentPage,
      totalPages,
      totalItems,
      startIndex,
      endIndex,
      canPrev: currentPage > 1,
      canNext: currentPage < totalPages,
      onPrev: () => setPage((p) => Math.max(1, p - 1)),
      onNext: () => setPage((p) => Math.min(totalPages, p + 1)),
      onSetPage: (p) => setPage(p),
    };
  }, [paginationApi, rows.length, page]);

  return (
    <div className="space-y-4">
      <SectionShell
        title="Car Dropdown Management"
        subtitle="Manage car dropdowns for make, model, variant"
        right={
          <button
            onClick={() => {
              setEditRow(null);
              setOpenModal(true);
            }}
            className="inline-flex items-center gap-2 px-3 cursor-pointer py-1 bg-primary text-white
                       hover:bg-primary/90 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Dropdown
          </button>
        }
      />

      {/* WOW Container */}
      <div className="px-4 md:px-0">
        <div className="h-[calc(100vh-300px)] bg-white border border-gray-200">
          <Table
            columns={columns}
            data={rows}
            keyField="_id"
            isLoading={loading}
            pagination={pagination}
            emptyMessage="No dropdowns found."
          />
        </div>
      </div>

      <CarDropdownModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        mode={editRow ? "edit" : "add"}
        initial={editRow}
        onSubmit={async ({ make, model, variant, isActive }) => {
          if (editRow) {
            await editCarDropdown({
              token,
              dropdownId: editRow._id,
              make,
              model,
              variant,
              isActive,
            });
          } else {
            await addCarDropdown({ token, make, model, variant });
          }
          setOpenModal(false);
          await fetchList();
          onAnyMutation?.();
        }}
      />

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onNo={() =>
          setConfirm({ open: false, title: "", message: "", onYes: null })
        }
        onYes={confirm.onYes}
      />
    </div>
  );
}
