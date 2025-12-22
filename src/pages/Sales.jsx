import React, { useEffect } from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Truck,
    Users,
    ArrowRight,
    Search,
    ChevronRight,
    DollarSign,
    Target,
    Activity,
    Clock
} from 'lucide-react';
import { useHeader } from '../context/HeaderContext';

const SalesCard = ({ title, icon: Icon, description, count, color, trend }) => {
    return (
        <div className="bg-white border border-slate-100 group hover:border-primary transition-all duration-300 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-lg ${color} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase">
                            <TrendingUp className="w-3 h-3" />
                            {trend}
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-relaxed mb-6">
                    {description}
                </p>

                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{count}</span>
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest group/btn border-b-2 border-primary/0 hover:border-primary transition-all pb-1">
                        Manage <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Updates</span>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Sales = () => {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();

    useEffect(() => {
        setTitle('Sales');
        setSearchContent(null);
        setActionsContent(null);
    }, [setTitle, setSearchContent, setActionsContent]);

    const salesControls = [
        {
            title: 'Sales List',
            icon: DollarSign,
            description: 'Comprehensive record of all finalized car sales and transaction history',
            count: '1,284',
            color: 'bg-primary',
            trend: '+12%'
        },
        {
            title: 'Purchase Request',
            icon: ShoppingBag,
            description: 'Active inquiries and purchasing requests from individual buyers',
            count: '426',
            color: 'bg-purple-600',
            trend: '+8%'
        },
        {
            title: 'Delivery Request',
            icon: Truck,
            description: 'Logistics and vehicle delivery assignments for sold units',
            count: '89',
            color: 'bg-orange-500',
            trend: 'Active'
        },
        {
            title: 'Dealers',
            icon: Users,
            description: 'Network management and verification interface for certified dealer partners.',
            count: '3,150',
            color: 'bg-indigo-600',
            trend: 'Verified'
        }
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 font-display">
            <div className="flex-1 overflow-y-auto no-scrollbar py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {salesControls.map((card, index) => (
                        <SalesCard key={index} {...card} />
                    ))}
                </div>

                {/* Sub-section: Quick Stats */}
                <div className="mt-12">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <div className="h-[2px] w-8 bg-slate-200" />
                        Sales Performance Intelligence
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Today</p>
                                <p className="text-xl font-black text-slate-900 tracking-tighter">$142,500.00</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders Pending</p>

                            </div>
                        </div>

                        <div className="bg-white p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-purple-50 flex items-center justify-center text-purple-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Enquiries</p>
                                <p className="text-xl font-black text-slate-900 tracking-tighter">48 Leads</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;
