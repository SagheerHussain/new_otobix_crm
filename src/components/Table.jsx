import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Table = ({
    columns,
    data,
    keyField = 'id',
    isLoading = false,
    pagination,
    onRowClick,
    emptyMessage = "No records found"
}) => {
    return (
        <div className="flex flex-col h-full bg-white border-b border-gray-100 overflow-hidden">
            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap 
                                        ${index === 0 ? 'pl-0 pr-4' : 'px-4'} 
                                        ${col.className || ''} 
                                        ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                                    style={{ width: col.width }}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-20 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        <span className="text-xs">Loading data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row[keyField] || rowIndex}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={`
                                        group transition-colors 
                                        ${onRowClick ? 'cursor-pointer hover:bg-blue-50/50' : 'hover:bg-gray-50/80'}
                                        ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} 
                                    `}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`py-2 text-xs text-slate-700 border-r border-transparent last:border-r-0 
                                                ${colIndex === 0 ? 'pl-0 pr-4' : 'px-4'} 
                                                ${col.className || ''} 
                                                ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                                        >
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex-none flex flex-wrap items-center justify-between gap-4 py-1.5 bg-gray-50 border-t border-gray-200 text-[11px] text-slate-500">
                    <div>
                        Showing <span className="font-medium text-slate-900">{pagination.startIndex + 1}</span> to <span className="font-medium text-slate-900">{Math.min(pagination.endIndex, pagination.totalItems)}</span> of <span className="font-medium text-slate-900">{pagination.totalItems}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={pagination.onPrev}
                                disabled={!pagination.canPrev}
                                className="p-1 border border-gray-200 bg-white hover:bg-gray-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-3 h-3" />
                            </button>

                            <div className="flex items-center gap-1">
                                {(() => {
                                    const pages = [];
                                    const { currentPage, totalPages, onSetPage } = pagination;

                                    let startPage = Math.max(1, currentPage - 2);
                                    let endPage = Math.min(totalPages, startPage + 4);

                                    if (endPage - startPage < 4) {
                                        startPage = Math.max(1, endPage - 4);
                                    }

                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => onSetPage(i)}
                                                className={`w-7 h-7 flex items-center justify-center border transition-colors ${currentPage === i
                                                    ? 'bg-primary text-white border-primary font-bold'
                                                    : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    return pages;
                                })()}
                            </div>

                            <button
                                onClick={pagination.onNext}
                                disabled={!pagination.canNext}
                                className="p-1 border border-gray-200 bg-white hover:bg-gray-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Jump to Page */}
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Go to</span>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-10 h-7 px-1 text-center border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder={pagination.currentPage}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const page = parseInt(e.target.value);
                                            if (page >= 1 && page <= pagination.totalPages) {
                                                pagination.onSetPage(page);
                                                e.target.value = ''; // Clear after jump
                                                e.target.blur();
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
