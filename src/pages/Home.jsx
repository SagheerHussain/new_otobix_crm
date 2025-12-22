import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    Users,
    PhoneCall,
    Home as HomeIcon,
    DollarSign,
    ShoppingBag,
    Briefcase,
    CreditCard,
    BarChart2,
    Gavel,
    ChevronRight,
    Clock,
    MoreHorizontal,
    Settings,
    AlertTriangle,
    Bell
} from 'lucide-react';
import dashboardService from '../services/dashboardService';
import { useHeader } from '../context/HeaderContext';

// Custom Card Component for "At a Glance"
const StatCard = ({ title, value, subtext, icon, colorInfo, isPrimary = false, children, subtextClass }) => (
    <div className={`snap-center shrink-0 w-[85vw] max-w-[320px] rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between
        ${isPrimary
            ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20'
            : 'bg-white shadow-sm border border-gray-100'
        }`}>

        {isPrimary && (
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        )}

        <div className="relative z-10 flex flex-col gap-4 h-full">
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${isPrimary ? 'bg-white/20 backdrop-blur-sm' : colorInfo?.bg || 'bg-gray-100'} `}>
                    {React.cloneElement(icon, { className: isPrimary ? 'text-white' : colorInfo?.text || 'text-gray-600' })}
                </div>
                {subtext && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${isPrimary ? 'bg-white/20 backdrop-blur-sm' : (subtextClass || 'text-slate-400')}`}>
                        {subtext}
                    </span>
                )}
            </div>

            <div>
                <p className={`text-sm font-medium mb-1 ${isPrimary ? 'text-blue-100' : 'text-slate-500'}`}>{title}</p>
                <div className="flex items-end gap-2">
                    <h3 className={`text-3xl font-bold tracking-tight ${isPrimary ? '' : 'text-slate-900'}`}>{value}</h3>
                </div>
            </div>

            {children}
        </div>
    </div>
);

// Quick Action Button
const ActionButton = ({ icon: Icon, label, colorClass, bgClass, to }) => {
    const content = (
        <>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="font-medium text-[10px] text-slate-700 text-center leading-tight" dangerouslySetInnerHTML={{ __html: label }}></span>
        </>
    );

    const className = "flex flex-col items-center justify-start gap-2 p-3 rounded-xl bg-white border border-gray-100 shadow-sm active:scale-95 transition-all hover:bg-gray-50 min-h-[90px] w-full";

    if (to) {
        return (
            <Link to={to} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <button className={className}>
            {content}
        </button>
    );
};

// Task Row
const TaskRow = ({ title, time, tag, tagColor, checked = false }) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm ${checked ? 'opacity-60' : ''}`}>
        <div className="flex-shrink-0">
            <input type="checkbox" defaultChecked={checked} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary bg-gray-50" />
        </div>
        <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold text-slate-900 truncate ${checked ? 'line-through decoration-slate-400' : ''}`}>{title}</p>
            <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center text-xs text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {time}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tagColor}`}>{tag}</span>
            </div>
        </div>
        {!checked && (
            <button className="text-slate-400 hover:text-primary transition-colors">
                <ChevronRight className="w-5 h-5" />
            </button>
        )}
    </div>
);

const CACHE_KEY_DASHBOARD = 'otobix_dashboard_cache';

const Home = () => {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();
    const [dealersData, setDealersData] = useState(() => {
        const cached = localStorage.getItem(CACHE_KEY_DASHBOARD);
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(!dealersData.length);

    useEffect(() => {
        setTitle('Dashboard');
        setSearchContent(null);
        setActionsContent(
            <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </Link>
        );
    }, [setTitle, setSearchContent, setActionsContent]);

    useEffect(() => {
        const fetchData = async () => {
            let formattedData = [];
            try {
                // Mock fetching data for charts
                const dealersRes = await dashboardService.getDealersByMonth(new Date().getFullYear());

                if (dealersRes && dealersRes.series && dealersRes.categories) {
                    formattedData = dealersRes.categories.map((cat, index) => ({
                        name: cat,
                        dealers: dealersRes.series[index] || 0
                    }));
                } else {
                    throw new Error("Invalid data format from API");
                }
            } catch (err) {
                console.error("Dashboard Fetch Error, using mock fallback:", err);
                formattedData = Array(12).fill(0).map((_, i) => ({
                    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
                    dealers: Math.floor(Math.random() * 100)
                }));
            } finally {
                setDealersData(formattedData);
                localStorage.setItem(CACHE_KEY_DASHBOARD, JSON.stringify(formattedData));
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Memoize the chart data to prevent unnecessary re-renders
    const weekData = useMemo(() => dealersData.slice(0, 7), [dealersData]);

    if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>;

    return (
        <div className="h-full overflow-y-auto no-scrollbar space-y-6 pb-10">
            {/* 1. At a Glance (Horizontal Scroll) */}
            <section className="mt-4 md:mt-0">

                <div className="flex overflow-x-auto gap-3 px-4 md:px-0 pb-2 no-scrollbar snap-x snap-mandatory">
                    {/* Primary Card - Total Sales */}
                    <StatCard
                        title="Total Sales"
                        value="$12,450"
                        subtext="+12% vs last week"
                        icon={<DollarSign />}
                        isPrimary={true}
                    >
                        <div className="w-full bg-black/20 rounded-full h-1.5 mt-auto">
                            <div className="bg-white h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </StatCard>

                    {/* Secondary Card - New Leads */}
                    <StatCard
                        title="New Leads"
                        value="8"
                        subtext={<><AlertTriangle className="w-3 h-3 text-red-500" /> 2 Urgent</>}
                        subtextClass="text-red-500 bg-red-50"
                        icon={<Users />}
                        colorInfo={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
                    >
                        <div className="flex -space-x-2 overflow-hidden mt-1">
                            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="" />
                            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="" />
                            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="" />
                            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-xs font-medium text-gray-500">+5</div>
                        </div>
                    </StatCard>

                    {/* Secondary Card - Pending Calls */}
                    <StatCard
                        title="Pending Calls"
                        value="15"
                        subtext="5 scheduled"
                        icon={<PhoneCall />}
                        colorInfo={{ bg: 'bg-amber-100', text: 'text-amber-600' }}
                    >
                        <button className="mt-1 w-full py-2 bg-gray-50 hover:bg-gray-100 text-slate-600 rounded-lg text-sm font-medium transition-colors border border-gray-100">
                            Start Calling
                        </button>
                    </StatCard>
                </div>
            </section>

            {/* 2. Quick Actions (Grid) */}
            <section className="px-4 md:px-0">
                <h3 className="text-lg font-bold mb-4 text-slate-900">Quick Actions</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                    <ActionButton icon={Settings} label="Adminis-<br/>tration" bgClass="bg-slate-100" colorClass="text-slate-600" to="/administration" />
                    <ActionButton icon={PhoneCall} label="Telecalling" bgClass="bg-blue-100" colorClass="text-primary" to="/telecalling" />
                    <ActionButton icon={HomeIcon} label="Inspection" bgClass="bg-orange-100" colorClass="text-orange-600" to="/inspection" />
                    <ActionButton icon={DollarSign} label="Sales" bgClass="bg-green-100" colorClass="text-green-600" to="/sales" />
                    <ActionButton icon={ShoppingBag} label="Retail" bgClass="bg-pink-100" colorClass="text-pink-600" to="/retail" />
                    <ActionButton icon={Briefcase} label="Operations" bgClass="bg-zinc-100" colorClass="text-zinc-600" to="/operations" />
                    <ActionButton icon={CreditCard} label="Accounts" bgClass="bg-indigo-100" colorClass="text-indigo-600" to="/accounts" />
                    <ActionButton icon={BarChart2} label="Reports" bgClass="bg-purple-100" colorClass="text-purple-600" to="/reports" />
                    <ActionButton icon={Gavel} label="Bids" bgClass="bg-amber-100" colorClass="text-amber-600" to="/bids" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-0">
                {/* 3. Today's Tasks */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-900">Today's Tasks</h3>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="text-slate-400 w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <TaskRow title="Call John Doe regarding quote" time="10:00 AM" tag="Quote" tagColor="bg-blue-100 text-blue-700" />
                        <TaskRow title="Site Inspection at 5th Ave" time="2:00 PM" tag="Field" tagColor="bg-orange-100 text-orange-700" />
                        <TaskRow title="Weekly Team Sync" time="9:00 AM" tag="Internal" tagColor="bg-gray-100 text-gray-600" checked={true} />

                        <button className="w-full py-3 mt-1 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
                            View All Tasks
                        </button>
                    </div>
                </section>

                {/* 4. Weekly Performance (Chart) */}
                <section className="pb-6 lg:pb-0 min-w-0">
                    <h3 className="text-lg font-bold mb-3 text-slate-900">Weekly Performance</h3>
                    <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm min-w-0 overflow-hidden">
                        <ResponsiveContainer width="100%" height={300} minWidth={0}>
                            <BarChart data={weekData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="dealers" fill="#DBEAFE" radius={[4, 4, 4, 4]} activeBar={{ fill: '#3F72AF' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
