import React from 'react';
import { Menu } from 'lucide-react';
import { useHeader } from '../context/HeaderContext';

const Header = ({ onMenuClick }) => {
    const { title, searchContent, actionsContent } = useHeader();

    return (
        <header className="sticky top-0 z-20 h-10 flex items-center md:px-0 bg-transparent">
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={onMenuClick}
                    className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                {title && <h1 className="text-3xl text-slate-900 tracking-tighter font-semibold">{title}</h1>}
            </div>

            <div className="flex-1 flex items-center justify-end gap-6 ml-10">
                <div className="max-w-md w-full">
                    {searchContent}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {actionsContent}
                </div>
            </div>
        </header>
    );
};

export default Header;
