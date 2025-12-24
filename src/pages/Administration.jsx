import React, { useEffect } from 'react';
import { Users, UserCheck, Settings, ChevronRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeader } from '../context/HeaderContext';

const AdminCard = ({ icon: Icon, title, description, colorClass, bgClass, hoverBgClass, to }) => {
    const CardContent = (
        <>
            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${bgClass} ${colorClass} ${hoverBgClass}`}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="ml-4 flex-1 py-0.5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
            </div>
        </>
    );

    if (to) {
        return (
            <Link to={to} className="w-full group flex items-start p-5 bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 hover:shadow-md hover:ring-primary/20 transition-all active:scale-[0.99] text-left">
                {CardContent}
            </Link>
        );
    }

    return (
        <button className="w-full group flex items-start p-5 bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 hover:shadow-md hover:ring-primary/20 transition-all active:scale-[0.99] text-left">
            {CardContent}
        </button>
    );
};


const Administration = () => {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();

    useEffect(() => {
        setTitle('Administration');
        setSearchContent(null);
        setActionsContent(
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <Bell className="w-6 h-6 text-slate-400" />
            </button>
        );
    }, [setTitle, setSearchContent, setActionsContent]);

    return (
        <div className="flex flex-col h-full bg-background-light font-display">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20 space-y-4">
                <AdminCard
                    icon={Users}
                    title="Users"
                    description="Manage system users, roles, and access permissions across the platform."
                    bgClass="bg-blue-50"
                    colorClass="text-blue-600"
                    hoverBgClass="group-hover:bg-blue-100"
                    to="/users"
                />

                <AdminCard
                    icon={UserCheck}
                    title="KAM Assignment"
                    description="Assign Key Account Managers to specific regions or client groups."
                    bgClass="bg-purple-50"
                    colorClass="text-purple-600"
                    hoverBgClass="group-hover:bg-purple-100"
                    to="/kams"
                />

                <AdminCard
                    icon={Settings}
                    title="Settings"
                    description="Configure application preferences, notifications, and security protocols."
                    bgClass="bg-slate-100"
                    colorClass="text-slate-600"
                    hoverBgClass="group-hover:bg-slate-200"
                />

                <div className="h-6"></div>
            </main>
        </div>
    );
};

export default Administration;
