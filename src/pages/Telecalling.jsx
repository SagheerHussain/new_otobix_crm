import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Plus, Filter, Download, MoreHorizontal,
    Phone, Mail, Calendar, Clock, MapPin, Car,
    User, AlertCircle, CheckCircle2, X
} from 'lucide-react';
import { useHeader } from '../context/HeaderContext';
import Table from '../components/Table';

// --- Components ---

const StatusBadge = ({ status }) => {
    let colors = 'bg-gray-100 text-gray-700';
    if (status === 'Scheduled') colors = 'bg-blue-100 text-blue-700';
    if (status === 'Pending') colors = 'bg-yellow-100 text-yellow-700';
    if (status === 'Completed') colors = 'bg-emerald-100 text-emerald-700';
    if (status === 'Cancelled') colors = 'bg-red-100 text-red-700';

    return (
        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide border border-transparent ${colors}`}>
            {status}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    let colors = 'bg-gray-100 text-gray-700';
    if (priority === 'High') colors = 'bg-red-50 text-red-600 border-red-100';
    if (priority === 'Medium') colors = 'bg-orange-50 text-orange-600 border-orange-100';
    if (priority === 'Low') colors = 'bg-blue-50 text-blue-600 border-blue-100';

    return (
        <span className={`px-2 py-0.5 text-[10px] font-medium border ${colors}`}>
            {priority}
        </span>
    );
};

const AddCallModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Add Lead Call Record</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Enter details for the new appointment call</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 1. Appointment Details */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Appointment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select className="form-input">
                                <option value="">Select Priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <input type="text" placeholder="Allocated To" className="form-input" />
                            <input type="text" placeholder="Appointment Source" className="form-input" />
                            <input type="text" placeholder="Inspection Status" className="form-input" />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 md:col-span-3 my-2"></div>

                    {/* 2. Customer Info */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input type="text" placeholder="Customer Name" className="form-input" />
                            <input type="tel" placeholder="Contact Number" className="form-input" />
                            <input type="email" placeholder="Email Address" className="form-input" />
                            <input type="text" placeholder="City" className="form-input" />
                            <input type="text" placeholder="Zip Code" className="form-input" />
                            <div className="md:col-span-3">
                                <input type="text" placeholder="Address for Inspection" className="form-input w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 md:col-span-3 my-2"></div>

                    {/* 3. Vehicle Details */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Car className="w-4 h-4" /> Vehicle Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="text" placeholder="Make" className="form-input" />
                            <input type="text" placeholder="Model" className="form-input" />
                            <input type="text" placeholder="Variant" className="form-input" />
                            <input type="number" placeholder="Year" className="form-input" />
                            <input type="text" placeholder="Odometer" className="form-input" />
                            <input type="text" placeholder="Serial Num" className="form-input" />
                            <input type="text" placeholder="Vehicle Status" className="form-input" />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 md:col-span-3 my-2"></div>

                    {/* 4. Inspection & NCD */}
                    <div className="md:col-span-3">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Additional Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="date" placeholder="Req. Inspection Date" className="form-input" />
                            <input type="time" placeholder="Req. Inspection Time" className="form-input" />
                            <input type="text" placeholder="NCD/UCD Name" className="form-input" />
                            <input type="text" placeholder="Rep Name" className="form-input" />
                            <input type="text" placeholder="Rep Contact" className="form-input" />
                            <input type="text" placeholder="Bank Source" className="form-input" />
                            <input type="text" placeholder="Reference Name" className="form-input" />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="md:col-span-3">
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Remarks</label>
                        <textarea className="form-input w-full h-24 resize-none" placeholder="Enter remarks..."></textarea>
                    </div>

                </form>

                <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur-sm px-6 py-4 border-t border-gray-100 flex justify-end gap-3 z-10">
                    <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 text-slate-700 font-medium hover:bg-gray-100 transition-colors text-sm">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-5 py-2.5 bg-primary text-white font-medium hover:bg-blue-600 shadow-none transition-colors text-sm">
                        Save Record
                    </button>
                </div>
            </div>
            <style jsx>{`
                .form-input {
                    @apply w-full px-4 py-2.5 border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder:text-slate-400;
                }
            `}</style>
        </div>
    );
};

// --- Mock Data Generator ---
const generateMockData = (count) => {
    const makes = ['Toyota', 'Honda', 'Ford', 'Hyundai', 'Tata', 'Maruti', 'Kia', 'BMW', 'Mercedes'];
    const models = {
        'Toyota': ['Camry', 'Corolla', 'Innova', 'Fortuner'],
        'Honda': ['Civic', 'City', 'Amaze', 'CR-V'],
        'Ford': ['EcoSport', 'Endeavour', 'Figo'],
        'Hyundai': ['Creta', 'Verna', 'i20', 'Tucson'],
        'Tata': ['Nexon', 'Harrier', 'Safari', 'Tiago'],
        'Maruti': ['Swift', 'Baleno', 'Brezza', 'Ertiga'],
        'Kia': ['Seltos', 'Sonet', 'Carens'],
        'BMW': ['3 Series', '5 Series', 'X1', 'X5'],
        'Mercedes': ['C-Class', 'E-Class', 'GLC', 'GLE']
    };
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const statuses = ['Scheduled', 'Pending', 'Completed', 'Cancelled'];
    const priorities = ['High', 'Medium', 'Low'];
    const agents = ['Agent A', 'Agent B', 'Agent C', 'Agent D', 'Agent E'];

    return Array.from({ length: count }, (_, i) => {
        const make = makes[Math.floor(Math.random() * makes.length)];
        const model = models[make][Math.floor(Math.random() * models[make].length)];
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 10)); // Next 10 days

        return {
            appointmentId: `APT-${1000 + i}`,
            timeStamp: new Date().toISOString(),
            emailAddress: `customer${i}@example.com`,
            appointmentSource: Math.random() > 0.5 ? 'Web' : 'Referral',
            vehicleStatus: 'Available',
            addressForInspection: `${100 + i} Mock Street`,
            zipCode: '10001',
            yearOfManufacture: 2015 + Math.floor(Math.random() * 9),
            make: make,
            model: model,
            variant: ['Auto', 'Manual'][Math.floor(Math.random() * 2)],
            odometerReading: 10000 + Math.floor(Math.random() * 90000),
            requestedInspectionDate: date.toISOString().split('T')[0],
            requestedInspectionTime: `${9 + Math.floor(Math.random() * 8)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            customerName: `Customer ${i + 1}`,
            customerContactNumber: `+1 555-01${(i % 99).toString().padStart(2, '0')}`,
            city: cities[Math.floor(Math.random() * cities.length)],
            allocatedTo: agents[Math.floor(Math.random() * agents.length)],
            inspectionStatus: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
        };
    });
};


const CACHE_KEY_TELECALLING = 'otobix_telecalling_cache';

const Telecalling = () => {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    // Cache / Generate Data - Immediate access
    const [allLeadCalls] = useState(() => {
        const cached = localStorage.getItem(CACHE_KEY_TELECALLING);
        if (cached) return JSON.parse(cached);
        const fresh = generateMockData(150);
        localStorage.setItem(CACHE_KEY_TELECALLING, JSON.stringify(fresh));
        return fresh;
    });

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Tab Counts Calculation
    const tabCounts = useMemo(() => {
        const counts = {
            'All': allLeadCalls.length,
            'Scheduled': 0,
            'Pending': 0,
            'Completed': 0,
            'Cancelled': 0
        };
        allLeadCalls.forEach(call => {
            if (counts[call.inspectionStatus] !== undefined) {
                counts[call.inspectionStatus]++;
            }
        });
        return counts;
    }, [allLeadCalls]);

    const tabs = [
        { label: 'All', count: tabCounts['All'] },
        { label: 'Scheduled', count: tabCounts['Scheduled'] },
        { label: 'Pending', count: tabCounts['Pending'] },
        { label: 'Completed', count: tabCounts['Completed'] },
        { label: 'Cancelled', count: tabCounts['Cancelled'] }
    ];

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 150);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        setTitle('Lead Calls');
        setSearchContent(
            <div className="relative group w-full max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search leads by ID, customer, or vehicle..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-none"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                    }}
                />
            </div>
        );
        setActionsContent(
            <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Call</span>
                </button>
            </div>
        );
    }, [setTitle, setSearchContent, setActionsContent, searchTerm]);

    // Filtering Logic - Memoized
    const { filteredCalls, currentCalls, totalItems, pagination } = useMemo(() => {
        const filtered = allLeadCalls.filter(call => {
            const matchesSearch =
                call.customerName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                call.appointmentId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                call.make.toLowerCase().includes(debouncedSearch.toLowerCase());

            const matchesTab = activeTab === 'All' || call.inspectionStatus === activeTab;

            return matchesSearch && matchesTab;
        });

        const total = filtered.length;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const sliced = filtered.slice(start, end);

        return {
            filteredCalls: filtered,
            currentCalls: sliced,
            totalItems: total,
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
    }, [allLeadCalls, debouncedSearch, activeTab, currentPage, itemsPerPage]);

    // Table Columns Definition
    const columns = [
        {
            header: 'Appointment ID',
            accessor: 'appointmentId',
            className: 'font-mono text-slate-500 font-medium',
            width: '120px'
        },
        {
            header: 'Customer',
            render: (row) => (
                <div>
                    <div className="font-semibold text-slate-900">{row.customerName}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {row.customerContactNumber}
                    </div>
                </div>
            )
        },
        {
            header: 'Vehicle',
            render: (row) => (
                <div>
                    <div className="font-medium text-slate-800">{row.yearOfManufacture} {row.make} {row.model}</div>
                    <div className="text-[10px] text-slate-500">{row.city}</div>
                </div>
            )
        },
        {
            header: 'Req. Date/Time',
            render: (row) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" /> {row.requestedInspectionDate}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                        <Clock className="w-3 h-3 text-slate-400" /> {row.requestedInspectionTime}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            render: (row) => <StatusBadge status={row.inspectionStatus} />
        },
        {
            header: 'Priority',
            render: (row) => <PriorityBadge priority={row.priority} />
        },
        {
            header: 'Allocated To',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                        {row.allocatedTo.charAt(0)}
                    </div>
                    <span className="text-slate-600">{row.allocatedTo}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (row) => (
                <button className="text-slate-400 hover:text-primary transition-colors p-1.5 hover:bg-slate-100">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            ),
            width: '60px'
        }
    ];

    return (
        <div className="flex flex-col h-full bg-background-light font-display">
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimizing Workspace</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Filter Tabs */}
                    <div className="flex-none md:px-0 z-10 bg-background-light mb-2">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.label}
                                    onClick={() => {
                                        setActiveTab(tab.label);
                                        setCurrentPage(1);
                                    }}
                                    className={`flex h-10 shrink-0 items-center justify-center px-4 text-[11px] font-black uppercase tracking-widest transition-all gap-3 border
                                            ${activeTab === tab.label
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${activeTab === tab.label ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block flex-1 overflow-hidden md:px-0">
                        <Table
                            columns={columns}
                            data={currentCalls}
                            pagination={pagination}
                            keyField="appointmentId"
                        />
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                        {currentCalls.map((call) => (
                            <div key={call.appointmentId} className="bg-white p-3 shadow-sm border border-gray-100 flex flex-col gap-3">
                                <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{call.customerName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{call.appointmentId}</span>
                                            <PriorityBadge priority={call.priority} />
                                        </div>
                                    </div>
                                    <StatusBadge status={call.inspectionStatus} />
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 text-xs">
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-slate-500 mb-0.5">Vehicle</p>
                                        <p className="font-medium text-slate-800">{call.yearOfManufacture} {call.make} {call.model} <span className="text-slate-400">({call.variant})</span></p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 mb-0.5">Req. Date</p>
                                        <p className="font-medium text-slate-800 flex items-center gap-1"><Calendar className="w-3 h-3" /> {call.requestedInspectionDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 mb-0.5">Req. Time</p>
                                        <p className="font-medium text-slate-800 flex items-center gap-1"><Clock className="w-3 h-3" /> {call.requestedInspectionTime}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-slate-500 mb-0.5">Location</p>
                                        <p className="font-medium text-slate-800 flex items-center gap-1"><MapPin className="w-3 h-3" /> {call.addressForInspection}, {call.city}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-1">
                                    <a href={`tel:${call.customerContactNumber}`} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 text-emerald-600 font-medium text-xs hover:bg-emerald-100 transition-colors">
                                        <Phone className="w-3.5 h-3.5" /> Call
                                    </a>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-700 font-medium text-xs hover:bg-slate-100 transition-colors">
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <AddCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={() => setIsModalOpen(false)} />
                </>
            )}
        </div>
    );
};

export default Telecalling;
