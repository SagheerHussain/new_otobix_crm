import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../context/HeaderContext";

import SettingsTabs from "../components/Settings/SettingTabs";
import DocPanel from "../components/Settings/DocPanal";
import { useDocumentManager } from "../hooks/useDocumentManger";

export default function Settings() {
    const navigate = useNavigate();
    const { setTitle, setSearchContent, setActionsContent } = useHeader();

    const token = JSON.parse(localStorage.getItem("token"));

    const [active, setActive] = useState("terms");

    // ✅ backend base routes (as per your backend)
    const base = useMemo(() => {
        if (active === "terms") return "/terms";
        if (active === "privacy") return "/privacy-policy";
        return "/dealer-guide";
    }, [active]);


    const manager = useDocumentManager({ base, token });

    useEffect(() => {
        setTitle("Document Settings");
        setSearchContent(null);
        setActionsContent(null);
    }, [setTitle, setSearchContent, setActionsContent]);

    const meta = useMemo(() => {
        if (active === "terms")
            return { title: "Terms & Conditions", subtitle: "Manage terms of service" };
        if (active === "privacy")
            return { title: "Privacy Policy", subtitle: "Update privacy policies" };
        return { title: "User Guide", subtitle: "Upload user documentation" };
    }, [active]);

    return (
        <div className="h-full w-full bg-[#f7f9fc]">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-sky-100/40 to-emerald-100/40" />
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl" />

                <div className="relative px-4 md:px-6 pt-6 pb-5">
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur border border-white/60 hover:bg-white text-xs font-black uppercase tracking-widest shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <div className="text-right">
                            <div className="text-lg md:text-xl font-black text-slate-900">
                                Document Settings
                            </div>
                            <div className="text-xs text-slate-500 font-semibold">
                                Manage your application content in one place
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <SettingsTabs active={active} onChange={setActive} />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="pb-10">
                <div className="mt-4">
                    <DocPanel title={meta.title} subtitle={meta.subtitle} manager={manager} />
                </div>
            </div>
        </div>
    );
}
