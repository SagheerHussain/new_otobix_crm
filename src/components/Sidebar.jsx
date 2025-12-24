import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Settings,
  ClipboardCheck,
  Gavel,
  LogOut,
  X,
  User,
  ChevronUp,
  Users,
  Car,
  History,
  ShoppingBag,
  Briefcase,
  PhoneCall,
  CreditCard,
  BarChart2,
  CarFront,
} from "lucide-react";
import amitProfile from "../assets/amit-parekh.png";
import logo from "/images/logo.webp"

const Sidebar = ({ isOpen, onClose }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // ✅ get user from localStorage
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // ✅ normalize role
  const roleRaw = user?.userType || user?.userRole || "";
  const role = String(roleRaw).toLowerCase().replaceAll("_", " ").trim(); // "admin" / "sales manager"

  const disabledCommon = useMemo(
    () => [
      { name: "Retail", path: "/retail", icon: ShoppingBag, comingSoon: true },
      { name: "Operations", path: "/operations", icon: Briefcase, comingSoon: true },
      { name: "Accounts", path: "/accounts", icon: CreditCard, comingSoon: true },
      { name: "Reports", path: "/reports", icon: BarChart2, comingSoon: true },
    ],
    []
  );
  
  // ✅ menu by role + disabled items
  const menuItems = useMemo(() => {
    if (role === "admin") {
      return [
        { name: "Home", path: "/", icon: Home },
        { name: "Administration", path: "/administration", icon: Settings },
        { name: "Telecalling", path: "/telecalling", icon: PhoneCall },
        { name: "Auctions", path: "/auctions", icon: Gavel },
        { name: "Customers", path: "/customers", icon: Users },
        { name: "Sales", path: "/sales", icon: BarChart2 },
        ...disabledCommon,
      ];
    }

    if (role === "sales manager") {
      return [
        { name: "Home", path: "/", icon: Home },
        { name: "Cars Listing", path: "/carsList", icon: CarFront },
        { name: "Inspection", path: "/inspections", icon: ClipboardCheck },
        { name: "Bids History", path: "/bidsHisotry", icon: History },
        { name: "Cars Overview", path: "/carsOverview", icon: Car },
        ...disabledCommon,
      ];
    }

    // fallback
    return [{ name: "Home", path: "/", icon: Home }, ...disabledCommon];
  }, [role, disabledCommon]);

  const profileName = user?.userName || user?.name || "User";
  const profileRoleLabel =
    role === "admin" ? "Admin" : role === "sales manager" ? "Sales Manager" : "User";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30
          w-64 md:w-[25%] xl:w-[20%] 2xl:w-[15%] bg-[#f4f9ff] text-white flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-bold text-xl">O</span>
            </div>
            <span className="text-xl font-bold tracking-wide text-white">OTOBIX</span> */}
            <img src={logo} alt="Otobix Logo" />
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3 custom-scrollbar">
          {menuItems.map((item) =>
            item.comingSoon ? (
              <div
                key={item.name}
                className="flex items-center justify-between px-4 py-3 rounded-lg opacity-40 cursor-not-allowed grayscale"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-black" />
                  <span className="font-medium text-black">{item.name}</span>
                </div>
                <span className="text-[8px] text-black font-black uppercase tracking-widest bg-black/10 px-1 py-0.5 rounded">
                  Soon
                </span>
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => window.innerWidth < 768 && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-primary shadow-md translate-x-1"
                      : "hover:bg-white/10 text-black"
                  }`
                }
              >
                <item.icon className="w-5 h-5 transition-colors" />
                <span className="font-medium group-hover:translate-x-1 transition-transform">
                  {item.name}
                </span>
              </NavLink>
            )
          )}
        </nav>

        {/* Bottom Profile */}
        <div className="p-4 relative">
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <NavLink
                to="/profile"
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  window.innerWidth < 768 && onClose();
                }}
              >
                <User className="w-4 h-4" />
                Profile
              </NavLink>

              <button
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setIsProfileMenuOpen(false);
                  window.location.href = "/login";
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 w-full p-2 cursor-pointer rounded-xl transition-all group"
          >
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-primary/30 transition-all"
              style={{ backgroundImage: `url(${amitProfile})` }}
            />
            <div className="flex-1 text-left">
              <h4 className="text-sm font-semibold text-black">{profileName}</h4>
              <p className="text-xs text-black">{profileRoleLabel}</p>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
