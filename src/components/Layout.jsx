import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import { HeaderProvider } from '../context/HeaderContext';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <HeaderProvider>
            <div className="flex h-screen bg-background-light overflow-hidden font-display">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* 2% Margin on Desktop */}
                <div className="hidden md:block md:w-[2%] shrink-0" />

                <div className="flex-1 md:flex-none md:w-[76%] flex flex-col overflow-hidden relative pt-2">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    {/* 2% Top Margin on Desktop */}
                    <div className="hidden md:block md:h-[2%] shrink-0" />

                    <main className="flex-1 overflow-hidden bg-background-light p-0">
                        <Outlet />
                    </main>

                    <BottomNav />
                </div>

                {/* Right Margin on Desktop */}
                <div className="hidden md:block md:w-[2%] shrink-0" />
            </div>
        </HeaderProvider>
    );
};

export default Layout;
