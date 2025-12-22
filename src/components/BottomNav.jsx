import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Users,
    Plus,
    CheckCircle,
    Settings
} from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe md:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </NavLink>

                <NavLink to="/leads" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Users className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Leads</span>
                </NavLink>

                <button className="relative flex items-center justify-center -mt-6 group">
                    <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:bg-blue-600 transition-colors border-4 border-background-light">
                        <Plus className="w-8 h-8" />
                    </div>
                </button>

                <NavLink to="/tasks" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Tasks</span>
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Settings</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
