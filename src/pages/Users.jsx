import React, { useState, useEffect } from 'react';
import {
    Search, Plus, ChevronLeft, ChevronRight, Edit3, Trash2,
    Phone, Mail, MapPin
} from 'lucide-react';
import { useHeader } from '../context/HeaderContext';
import Table from '../components/Table';

// Mobile User Card Component
const UserCardMobile = ({ user }) => (
    <div className="bg-white p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-slate-500 font-medium">{user.designation}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50">
                    <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 bg-slate-50">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="flex flex-col gap-2 mt-1 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {user.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {user.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">{user.address}, {user.city}</span>
            </div>
        </div>
    </div>
);

import { usersData } from '../services/users';

const Users = () => {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Use shared data from services
    const allUsers = usersData.map((u, index) => ({
        id: index + 1,
        ...u,
        phone: u.phone || '+91 00000 00000',
        address: u.designation || 'Staff',
        city: u.allowedCities ? u.allowedCities[0] : 'KOLKATA'
    }));

    useEffect(() => {
        setTitle('Users');
        setSearchContent(
            <div className="relative group w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name, role, or email..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-bold uppercase tracking-widest placeholder:text-slate-300"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>
        );
        setActionsContent(
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add User</span>
            </button>
        );
    }, [setTitle, setSearchContent, setActionsContent, searchQuery]);

    const filteredUsers = allUsers.filter(user =>
        (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalItems = filteredUsers.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const pagination = {
        currentPage,
        totalItems,
        startIndex,
        endIndex: Math.min(endIndex, totalItems),
        onNext: () => setCurrentPage(p => p + 1),
        onPrev: () => setCurrentPage(p => p - 1),
        canNext: currentPage * itemsPerPage < totalItems,
        canPrev: currentPage > 1
    };

    // Table Columns
    const columns = [
        {
            header: 'Name',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-xs">{user.firstName} {user.lastName}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Designation',
            render: (user) => (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700">
                    {user.designation || 'Staff'}
                </span>
            )
        },
        {
            header: 'Email',
            render: (user) => (
                <span className="text-xs text-slate-600">{user.email}</span>
            )
        },
        {
            header: 'Allocated Cities',
            render: (user) => (
                <div className="flex flex-wrap gap-1">
                    {user.allowedCities && user.allowedCities.map((city, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                            {city}{idx < user.allowedCities.length - 1 ? ',' : ''}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (user) => (
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
            width: '80px'
        }
    ];

    return (
        <div className="flex flex-col h-full bg-background-light font-display">
            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-background-light">

                {/* Mobile View: Cards */}
                <div className="flex flex-col gap-4 md:hidden pb-20 p-4">
                    {currentUsers.length > 0 ? (
                        currentUsers.map(user => (
                            <UserCardMobile key={user.id} user={user} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            No users found matching "{searchQuery}"
                        </div>
                    )}
                    {/* Mobile Pagination */}
                    <div className="flex items-center justify-between pt-4">
                        <span className="text-xs text-slate-500">Page {currentPage}</span>
                        <div className="flex gap-2">
                            <button disabled={!pagination.canPrev} onClick={pagination.onPrev} className="p-2 bg-white shadow-sm disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                            <button disabled={!pagination.canNext} onClick={pagination.onNext} className="p-2 bg-white shadow-sm disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block h-full overflow-hidden md:px-0">
                    <Table
                        columns={columns}
                        data={currentUsers}
                        pagination={pagination}
                        keyField="id"
                    />
                </div>
            </div>
        </div>
    );
};

export default Users;
