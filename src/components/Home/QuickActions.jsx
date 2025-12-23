// src/components/home/QuickActions.jsx
import React, { useEffect, useState } from "react";
import {
  Settings,
  PhoneCall,
  Home as HomeIcon,
  DollarSign,
  ShoppingBag,
  Briefcase,
  CreditCard,
  BarChart2,
  Gavel,
  Hammer,
  History,
  UsersRound,
  ClipboardCheck,
  Car,
} from "lucide-react";
import ActionButton from "./ActionButton";

export default function QuickActions() {

  const [userType, setUserType] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user", user)
    setUserType(user?.userType);
  }, [userType])

  return (
    <section className="px-4 md:px-0">
      <h3 className="text-lg font-bold mb-4 text-slate-900">Quick Actions</h3>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
        {
          userType === "Admin" ? <>
            <ActionButton icon={Settings} label="Administration" bgClass="bg-slate-100" colorClass="text-slate-600" to="/administration" />
            <ActionButton icon={Hammer} label="Auctions" bgClass="bg-rose-100" colorClass="text-rose-600" to="/administration" />
            <ActionButton icon={UsersRound} label="Customers" bgClass="bg-amber-100" colorClass="text-amber-600" to="/bids" />
          </>
            :
            <>
              <ActionButton icon={History} label="Bids" bgClass="bg-yellow-100" colorClass="text-yellow-600" to="/bids" />
              <ActionButton icon={ClipboardCheck} label="Inspection" bgClass="bg-orange-100" colorClass="text-orange-600" to="/inspection" />
              <ActionButton icon={Car} label="Cars Overview" bgClass="bg-green-100" colorClass="text-green-600" to="/inspection" />
            </>
        }
        {/* <ActionButton icon={PhoneCall} label="Telecalling" bgClass="bg-blue-100" colorClass="text-primary" to="/telecalling" /> */}
        {/* <ActionButton icon={DollarSign} label="Sales" bgClass="bg-green-100" colorClass="text-green-600" to="/sales" /> */}
        <ActionButton icon={ShoppingBag} label="Retail" bgClass="bg-pink-100" colorClass="text-pink-600" to="/retail" disabled />
        <ActionButton icon={Briefcase} label="Operations" bgClass="bg-zinc-100" colorClass="text-zinc-600" to="/operations" disabled />
        <ActionButton icon={CreditCard} label="Accounts" bgClass="bg-indigo-100" colorClass="text-indigo-600" to="/accounts" disabled />
        <ActionButton icon={BarChart2} label="Reports" bgClass="bg-purple-100" colorClass="text-purple-600" to="/reports" disabled />
      </div>
    </section>
  );
}
