import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Plus, MoreHorizontal, MapPin, Phone,
    Navigation, Play, CheckCircle, Calendar, Clock,
    Filter, ChevronLeft, ChevronRight, Loader2, Car
} from 'lucide-react';
import { useHeader } from '../context/HeaderContext';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';

// --- Mobile Card Component ---
const InspectionCardMobile = ({ inspection, onClick }) => {
    const { status, time, appointmentId, vehicle, location, image, id } = inspection;

    let statusStyle = 'bg-gray-100 text-gray-700';
    if (status === 'Running') statusStyle = 'bg-purple-50 text-purple-600';
    if (status === 'Scheduled') statusStyle = 'bg-blue-50 text-blue-600';
    if (status === 'Pending Quality Check') statusStyle = 'bg-amber-50 text-amber-600';
    if (status === 'Inspection Approved') statusStyle = 'bg-emerald-50 text-emerald-600';
    if (status === 'Cancelled') statusStyle = 'bg-red-50 text-red-600';

    return (
        <div onClick={onClick} className={`flex flex-col gap-3 bg-white shadow-sm border border-gray-100 cursor-pointer ${status === 'Inspection Approved' ? 'opacity-80' : ''}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wide font-bold border border-transparent ${statusStyle}`}>
                        {status === 'Running' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>}
                        {status}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{time}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{appointmentId}</h3>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">{vehicle}</p>
                </div>
                {/* Placeholder Image or Real Image */}
                <div className="w-20 h-20 shrink-0 bg-slate-100 overflow-hidden relative border border-gray-100">
                    {image ? (
                        <img className="w-full h-full object-cover" src={image} alt={vehicle} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <span className="text-xs">No Img</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-2 mt-1 pt-3 border-t border-slate-50">
                <button className="flex-1 flex items-center justify-center gap-2 h-9 bg-transparent text-slate-600 font-medium text-xs hover:bg-slate-50 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};


const CACHE_KEY = 'otobix_inspections_cache';

const Inspection = () => {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [inspections, setInspections] = useState(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(!inspections.length);
    const [error, setError] = useState(null);
    const itemsPerPage = 15;

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Filter Chips - Memoized
    const filters = useMemo(() => [
        { label: 'All', count: inspections.length },
        { label: 'Scheduled', count: inspections.filter(i => i.status === 'Scheduled').length },
        { label: 'Re-Scheduled', count: inspections.filter(i => i.status === 'Re-Scheduled').length },
        { label: 'Cancelled', count: inspections.filter(i => i.status === 'Cancelled').length },
        { label: 'Running', count: inspections.filter(i => i.status === 'Running').length },
        { label: 'Inspected', count: inspections.filter(i => i.status === 'Inspected').length },
        { label: 'Pending Quality Check', count: inspections.filter(i => i.status === 'Pending Quality Check').length },
    ], [inspections]);

    // Update Header
    useEffect(() => {
        setTitle('Cars Lists');
        setSearchContent(
            <div className="relative group w-full max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search by ID, vehicle, location..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        );
        setActionsContent(
            <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-blue-600 transition-colors font-medium text-sm shadow-none">
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">New Inspection</span>
                </button>
            </div>
        );
    }, [setTitle, setSearchContent, setActionsContent, searchQuery]);

    // Fetch Data Effect - Only on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // If we have cached data, we don't necessarily show loader
                const response = await fetch('https://otobix-app-backend-development.onrender.com/api/car/cars-list', {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDBhYzc2NTA4OGQxYTA2ODc3MDU0NCIsInVzZXJOYW1lIjoiY3VzdG9tZXIiLCJ1c2VyVHlwZSI6IkN1c3RvbWVyIiwiaWF0IjoxNzY0MzMxNjMxLCJleHAiOjIwNzk2OTE2MzF9.oXw1J4ca1XoIAg-vCO2y0QqZIq0VWHdYBrl2y9iIv4Q'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();

                const mappedData = data.map(item => ({
                    id: item.id,
                    appointmentId: item.appointmentId,
                    vehicle: `${item.yearMonthOfManufacture ? new Date(item.yearMonthOfManufacture).getFullYear() : ''} ${item.make} ${item.model} ${item.variant}`,
                    location: `${item.inspectionLocation || item.registeredRto}`,
                    status: item.isInspected ? 'Inspected' : (item.auctionStatus === 'removed' ? 'Cancelled' : 'Scheduled'),
                    time: item.upcomingTime ? `${item.upcomingTime} mins` : new Date(item.yearMonthOfManufacture).toLocaleDateString(),
                    image: item.imageUrl,
                    customer: `Owner #${item.ownerSerialNumber}`
                }));

                setInspections(mappedData);
                localStorage.setItem(CACHE_KEY, JSON.stringify(mappedData));
            } catch (err) {
                setError(err.message);
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter Logic - Memoized
    const filteredData = useMemo(() => {
        return inspections.filter(item => {
            const matchesSearch =
                item.vehicle.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                item.appointmentId.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

            const matchesFilter = activeFilter === 'All' || item.status === activeFilter;

            return matchesSearch && matchesFilter;
        });
    }, [inspections, debouncedSearchQuery, activeFilter]);

    // Pagination Logic - Memoized
    const { currentData, pagination, totalItems } = useMemo(() => {
        const total = filteredData.length;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const sliced = filteredData.slice(start, end);

        return {
            totalItems: total,
            currentData: sliced,
            pagination: {
                currentPage,
                totalItems: total,
                totalPages: Math.ceil(total / itemsPerPage),
                startIndex: start,
                endIndex: Math.min(end, total),
                onNext: () => setCurrentPage(p => p + 1),
                onPrev: () => setCurrentPage(p => p - 1),
                onSetPage: (p) => setCurrentPage(p),
                canNext: start + itemsPerPage < total,
                canPrev: currentPage > 1
            }
        };
    }, [filteredData, currentPage, itemsPerPage]);

    // Table Columns
    const columns = [
        {
            header: 'ID',
            accessor: 'appointmentId',
            className: 'font-mono text-slate-500 font-medium text-xs',
            width: '120px'
        },
        {
            header: 'Vehicle',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                        {row.image ? <img src={row.image} className="w-full h-full object-cover" alt="Car" /> : <div className="w-full h-full flex items-center justify-center"><Car className="w-4 h-4 text-slate-300" /></div>}
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-xs">{row.vehicle}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-medium uppercase">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {row.location}
                </div>
            )
        },

        {
            header: 'Status',
            render: (row) => {
                let statusStyle = 'bg-gray-100 text-gray-700';
                if (row.status === 'Running') statusStyle = 'bg-purple-50 text-purple-700 border-purple-100';
                if (row.status === 'Scheduled') statusStyle = 'bg-blue-50 text-blue-700 border-blue-100';
                if (row.status === 'Pending Quality Check') statusStyle = 'bg-amber-50 text-amber-700 border-amber-100';
                if (row.status === 'Inspected') statusStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                if (row.status === 'Cancelled') statusStyle = 'bg-red-50 text-red-700 border-red-100';

                return (
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${statusStyle}`}>
                        {row.status}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            align: 'right',
            render: (row) => (
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View Details" onClick={(e) => { e.stopPropagation(); navigate(`/inspection/${row.id}`) }}>
                        <Navigation className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
            width: '100px'
        }
    ];

    return (
        <div className="flex flex-col h-full bg-background-light font-display">
            {/* Filter Section */}
            <div className="flex-none md:px-0 z-10 bg-background-light">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {filters.map(filter => (
                        <button
                            key={filter.label}
                            onClick={() => setActiveFilter(filter.label)}
                            className={`flex h-10 shrink-0 items-center justify-center px-4 text-[11px] font-black uppercase tracking-widest transition-all gap-3 border
                                ${activeFilter === filter.label
                                    ? 'bg-primary text-white border-primary shadow-md'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {filter.label}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${activeFilter === filter.label ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {filter.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-background-light">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block h-full overflow-hidden">
                            <Table
                                columns={columns}
                                data={currentData}
                                pagination={pagination}
                                keyField="id"
                                onRowClick={(row) => navigate(`/carsList/${row.id}`)}
                            />
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden flex flex-col gap-3 p-4 pb-20">
                            {currentData.length > 0 ? (
                                currentData.map((item) => (
                                    <InspectionCardMobile
                                        key={item.id}
                                        inspection={item}
                                        onClick={() => navigate(`/inspection/${item.id}`)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400 text-sm">
                                    No inspections found.
                                </div>
                            )}
                            {/* Mobile Pagination */}
                            {currentData.length > 0 && (
                                <div className="flex items-center justify-between pt-4">
                                    <span className="text-xs text-slate-500">Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</span>
                                    <div className="flex gap-2">
                                        <button disabled={!pagination.canPrev} onClick={pagination.onPrev} className="p-2 bg-white shadow-sm border border-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                                        <button disabled={!pagination.canNext} onClick={pagination.onNext} className="p-2 bg-white shadow-sm border border-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Inspection;
