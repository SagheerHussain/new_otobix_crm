import React, { useState, useEffect } from 'react';
import {
    Clock,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Timer,
    Car,
    MapPin,
    Users
} from 'lucide-react';
import { useHeader } from '../context/HeaderContext';

const CACHE_KEY_AUCTIONS = 'otobix_auctions_cache_';

const AuctionCard = ({ auction }) => {
    const isLive = auction.status?.toLowerCase() === 'live';

    return (
        <div className="bg-white border border-slate-200 group hover:border-primary transition-all duration-300 shadow-sm overflow-hidden relative">
            {isLive && (
                <div className="absolute top-4 left-4 z-10">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg ring-4 ring-red-600/10">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        Live Now
                    </span>
                </div>
            )}

            <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                <img
                    src={auction.image}
                    alt={auction.vehicle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button className="w-full py-2 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                        View Details
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="max-w-[70%]">
                        <h3 className="text-sm font-black text-slate-900 leading-tight mb-1 uppercase tracking-tight truncate">
                            {auction.year} {auction.vehicle}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <MapPin className="w-3 h-3" /> {auction.location}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-primary block">
                            {auction.price === '$0' ? 'Starting Bid' : auction.price}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">
                            {isLive ? 'Highest Bid' : 'Starting Price'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-900 block">{auction.bids || 0}</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase">Activity</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-900">
                                {auction.watchers || 0}
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Watching</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Timer className={`w-4 h-4 ${isLive ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className={`text-[11px] font-black uppercase tracking-wide ${isLive ? 'text-red-600' : 'text-slate-500'}`}>
                            {isLive ? (auction.timeLeft || 'Ends Soon') : auction.startTime}
                        </span>
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest group/btn">
                        {isLive ? 'Place Bid' : 'Notify Me'} <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AuctionCardSkeleton = () => (
    <div className="bg-white border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="aspect-[16/9] bg-slate-100" />
        <div className="p-5">
            <div className="flex justify-between mb-4">
                <div className="space-y-2 w-2/3">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-50 rounded w-1/2" />
                </div>
                <div className="space-y-2 w-1/4">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-2 bg-slate-50 rounded w-full" />
                </div>
            </div>
            <div className="py-4 border-y border-slate-50 mb-4 grid grid-cols-2 gap-4">
                <div className="h-8 bg-slate-50 rounded" />
                <div className="h-8 bg-slate-50 rounded" />
            </div>
            <div className="flex justify-between">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-1/4" />
            </div>
        </div>
    </div>
);

const Auctions = () => {
    const { setTitle, setActionsContent } = useHeader();
    const [activeTab, setActiveTab] = useState('Live');

    // Global state for all tabs to make switching instant
    const [allAuctions, setAllAuctions] = useState(() => {
        const cached = localStorage.getItem(CACHE_KEY_AUCTIONS + 'all_tabs');
        return cached ? JSON.parse(cached) : {};
    });

    const [loadingStates, setLoadingStates] = useState({});
    const [visibleCount, setVisibleCount] = useState(20);
    const containerRef = React.useRef(null);
    const [tabCounts, setTabCounts] = useState(() => {
        const cached = localStorage.getItem('otobix_auctions_counts');
        return cached ? JSON.parse(cached) : {
            'Upcoming': 0, 'Live': 0, 'Otobuy': 0, 'Sold': 0, 'Removed': 0, 'Live Auction Ended': 0
        };
    });

    const tabs = [
        { label: 'Upcoming', status: 'upcoming' },
        { label: 'Live', status: 'live' },
        { label: 'Otobuy', status: 'otobuy' },
        { label: 'Sold', status: 'sold' },
        { label: 'Removed', status: 'removed' },
        { label: 'Live Auction Ended', status: 'liveAuctionEnded' }
    ];

    const calculateTimeLeft = (endTime) => {
        if (!endTime) return null;
        const diff = new Date(endTime) - new Date();
        if (diff <= 0) return 'Ended';
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${h}h ${m}m`;
    };

    const auctionsData = allAuctions[activeTab] || [];
    const isLoading = loadingStates[activeTab];

    const visibleAuctions = React.useMemo(() => {
        return auctionsData.slice(0, visibleCount);
    }, [auctionsData, visibleCount]);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            if (visibleCount < auctionsData.length) {
                setVisibleCount(prev => prev + 20);
            }
        }
    };

    useEffect(() => {
        setTitle('Auctions');
        setActionsContent(null);
    }, [setTitle, setActionsContent]);

    // Simple hash for deterministic "random" numbers
    const getSeedNumber = (id, max, min = 0) => {
        if (!id) return min + Math.floor(Math.random() * (max - min));
        const hash = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return min + (hash % (max - min));
    };

    const fetchStatusData = async (tabLabel, status) => {
        setLoadingStates(prev => ({ ...prev, [tabLabel]: true }));
        try {
            const res = await fetch(
                `https://otobix-app-backend-development.onrender.com/api/car/cars-list?auctionStatus=${status}`,
                {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDBhYzc2NTA4OGQxYTA2ODc3MDU0NCIsInVzZXJOYW1lIjoiY3VzdG9tZXIiLCJ1c2VyVHlwZSI6IkN1c3RvbWVyIiwiaWF0IjoxNzY0MzMxNjMxLCJleHAiOjIwNzk2OTE2MzF9.oXw1J4ca1XoIAg-vCO2y0QqZIq0VWHdYBrl2y9iIv4Q'
                    }
                }
            );
            const data = await res.json();
            const items = Array.isArray(data) ? data : [];

            const formatted = items.map(item => {
                const itemId = item.id || item._id || Math.random().toString();
                return {
                    id: itemId,
                    vehicle: `${item.make} ${item.model}`,
                    year: item.yearMonthOfManufacture ? new Date(item.yearMonthOfManufacture).getFullYear() : '2022',
                    location: item.inspectionLocation || 'India',
                    price: item.highestBid > 0 ? `$${item.highestBid.toLocaleString()}` : `$${(item.priceDiscovery || 0).toLocaleString()}`,
                    bids: item.variableMargin || 0,
                    watchers: getSeedNumber(itemId, 100, 20),
                    status: item.auctionStatus,
                    timeLeft: calculateTimeLeft(item.auctionEndTime),
                    startTime: item.auctionStartTime ? `Starts ${new Date(item.auctionStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Coming Soon',
                    image: item.imageUrl || 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=400&h=250'
                };
            });

            setAllAuctions(prev => {
                const updated = { ...prev, [tabLabel]: formatted };
                localStorage.setItem(CACHE_KEY_AUCTIONS + 'all_tabs', JSON.stringify(updated));
                return updated;
            });

            setTabCounts(prev => {
                const next = { ...prev, [tabLabel]: formatted.length };
                localStorage.setItem('otobix_auctions_counts', JSON.stringify(next));
                return next;
            });
        } catch (err) {
            console.error(`Fetch failed for ${tabLabel}:`, err);
        } finally {
            setLoadingStates(prev => ({ ...prev, [tabLabel]: false }));
        }
    };

    // Initial load: Fetch everything for instant switching
    useEffect(() => {
        tabs.forEach(tab => {
            fetchStatusData(tab.label, tab.status);
        });
    }, []);

    // Visible count reset on tab change
    useEffect(() => {
        setVisibleCount(20);
        if (containerRef.current) containerRef.current.scrollTop = 0;
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full bg-slate-50 font-display">
            {/* Filter Section */}
            <div className="flex-none md:px-0 pb-2 z-10 bg-slate-50">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            className={`flex h-10 shrink-0 items-center justify-center px-4 text-[11px] font-black uppercase tracking-widest transition-all gap-3 border
                                    ${activeTab === tab.label
                                    ? 'bg-primary text-white border-primary shadow-md'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {tab.label}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${activeTab === tab.label ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {tabCounts[tab.label] || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 md:p-0 no-scrollbar transition-opacity duration-200"
            >
                {isLoading && auctionsData.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <AuctionCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 pb-20">
                        {auctionsData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {visibleAuctions.map((auction) => (
                                    <AuctionCard key={auction.id} auction={auction} />
                                ))}
                            </div>
                        ) : !isLoading && (
                            <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-100 mt-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Car className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">No Listings Found</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">The {activeTab.toLowerCase()} archive is currently empty</p>
                            </div>
                        )}

                        {visibleCount < auctionsData.length && (
                            <div className="flex justify-center py-10">
                                <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 shadow-sm">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gathering More Evidence</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auctions;
