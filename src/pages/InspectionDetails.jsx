import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Loader2,
    Calendar,
    Gauge,
    User,
    Download,
    CheckCircle,
    Plus,
    Camera,
    X,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
} from "lucide-react";
import { useHeader } from "../context/HeaderContext";

/* ----------------- Shared Helpers ----------------- */

const getImgUrls = (img) => {
    if (!img) return [];
    if (Array.isArray(img)) return img.flatMap((item) => getImgUrls(item));
    if (typeof img === "object" && img.url) return [img.url];
    if (typeof img === "string") {
        let cleaned = img;
        if (cleaned.includes(".jpghttp"))
            cleaned = cleaned.replace(/\.jpghttp/g, ".jpg,http");
        else if (cleaned.includes(".pnghttp"))
            cleaned = cleaned.replace(/\.pnghttp/g, ".png,http");
        else if (cleaned.includes(".jpeghttp"))
            cleaned = cleaned.replace(/\.jpeghttp/g, ".jpeg,http");
        if (cleaned.includes(","))
            return cleaned
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        return [cleaned];
    }
    return [];
};

const getImgUrl = (img) => {
    const urls = getImgUrls(img);
    return urls.length > 0 ? urls[0] : null;
};

// collect MANY possible photos even if imageUrls is not present
const collectAllPhotos = (car) => {
    if (!car) return [];
    let urls = [];

    // 1) Preferred hero angles & extras
    const preferredKeys = [
        "frontMain",
        "lhsFront45Degree",
        "rearMain",
        "rhsRear45Degree",
        "additionalImages",
        "additionalImages2",
    ];
    preferredKeys.forEach((key) => {
        if (car[key]) {
            urls = urls.concat(getImgUrls(car[key]));
        }
    });

    // 2) Any field ending with Images / imageUrls
    Object.keys(car).forEach((key) => {
        if (/imageurls?$/i.test(key) || /Images$/i.test(key)) {
            urls = urls.concat(getImgUrls(car[key]));
        }
    });

    // dedupe
    return [...new Set(urls)].filter(Boolean);
};

const getStatusTheme = (val) => {
    if (!val)
        return {
            bg: "bg-slate-50",
            border: "border-slate-200",
            text: "text-slate-500",
            label: "PASS",
        };

    const s = val.toString().toLowerCase();

    if (
        s.includes("damaged") ||
        s.includes("rust") ||
        s.includes("broken") ||
        s.includes("weak") ||
        s.includes("leak") ||
        s.includes("torn") ||
        s.includes("dent")
    ) {
        return {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-600",
            label: "MAJOR",
        };
    }

    if (
        s.includes("scratch") ||
        s.includes("repaint") ||
        s.includes("repaired") ||
        s.includes("repair") ||
        s.includes("dirty") ||
        s.includes("noise")
    ) {
        return {
            bg: "bg-orange-50",
            border: "border-orange-200",
            text: "text-orange-600",
            label: "MINOR",
        };
    }

    if (
        s.includes("okay") ||
        s.includes("good") ||
        s.includes("effective") ||
        s.includes("working")
    ) {
        return {
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            text: "text-emerald-600",
            label: "PASS",
        };
    }

    return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-500",
        label: "PASS",
    };
};

const getSeverity = (val) => {
    if (!val) return null;
    const { label } = getStatusTheme(val);
    if (label === "MAJOR") return "major";
    if (label === "MINOR") return "minor";
    return null;
};

// when a zone is based on multiple fields (door+quarter+lamp),
// we pick the worst severity: major > minor > pass
const getZoneSeverity = (data, fieldNames = []) => {
    const values = fieldNames
        .map((key) => data?.[key])
        .filter(Boolean);

    if (!values.length) return null;

    const severities = values.map(getSeverity).filter(Boolean);
    if (!severities.length) return null;

    if (severities.includes("major")) return "major";
    if (severities.includes("minor")) return "minor";
    return null;
};

/* ----------------- Small UI Bits ----------------- */

const Badge = ({ type, text }) => {
    const colors = {
        minor: "bg-orange-50 text-orange-600 border-orange-200",
        major: "bg-red-50 text-red-600 border-red-200",
        pass: "bg-emerald-50 text-emerald-600 border-emerald-200",
    };
    return (
        <span
            className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider border rounded-none ${colors[type] || colors.minor
                }`}
        >
            {text}
        </span>
    );
};

const FindingCard = ({ title, status, image, onImageClick }) => {
    const theme = getStatusTheme(status);

    return (
        <div
            className={`bg-white border rounded-none p-5 flex justify-between gap-5 transition-all hover:border-indigo-200 ${theme.label === "PASS" ? "border-emerald-100" : "border-slate-100"
                }`}
        >
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                        {title}
                    </h4>
                    <Badge type={theme.label.toLowerCase()} text={theme.label} />
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                    {status}
                </p>
            </div>
            {image && (
                <div
                    className="w-24 h-24 shrink-0 rounded-none overflow-hidden border border-slate-100 relative group cursor-zoom-in"
                    onClick={() => onImageClick && onImageClick(image)}
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
            )}
        </div>
    );
};

/* ----------------- Modals ----------------- */

const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt="Inspection Detail"
                    className="max-w-full max-h-full object-contain shadow-2xl"
                />
            </div>
        </div>
    );
};

const GallerySlider = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const next = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Visual Archive</span>
                    <span className="text-xl font-black">{currentIndex + 1} <span className="text-white/30">/</span> {images.length}</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Main Stage */}
            <div className="relative w-full h-full flex items-center justify-center px-4 md:px-20 overflow-hidden">
                <button
                    onClick={prev}
                    className="absolute left-6 md:left-10 z-[110] p-4 bg-white/5 hover:bg-white/15 text-white rounded-none border border-white/10 transition-all backdrop-blur-md"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <div className="w-full max-w-6xl aspect-[4/3] relative flex items-center justify-center overflow-hidden">
                    <img
                        key={images[currentIndex]}
                        src={images[currentIndex]}
                        alt={`Inspection ${currentIndex + 1}`}
                        className="max-w-full max-h-[70vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-right-8 fade-in duration-500"
                    />
                </div>

                <button
                    onClick={next}
                    className="absolute right-6 md:right-10 z-[110] p-4 bg-white/5 hover:bg-white/15 text-white rounded-none border border-white/10 transition-all backdrop-blur-md"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-center gap-2 overflow-x-auto no-scrollbar py-4 bg-white/5 border-t border-white/5 backdrop-blur-md">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-16 h-12 shrink-0 border-2 transition-all ${idx === currentIndex ? 'border-indigo-500 scale-110 ring-4 ring-indigo-500/20' : 'border-transparent opacity-40 hover:opacity-100'
                            }`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

/* ----------------- Car Damage Heatmap ----------------- */

const CarDamageHeatmap = ({ data }) => {
    // wireframe PNG (put this in public/images/)
    const BACKGROUND_IMAGE = "/images/car-wireframe-blueprint.png";

    // percentage coordinates over the image; tweak visually as needed
    const DAMAGE_ZONES = [
        {
            id: "roof",
            label: "Roof",
            fields: ["roof"],
            top: "18%",
            left: "52%",
        },
        {
            id: "bonnet",
            label: "Bonnet",
            fields: ["bonnet", "upperCrossMember", "lowerCrossMember"],
            top: "33%",
            left: "60%",
        },
        {
            id: "front_left_corner",
            label: "Front Left Corner",
            fields: [
                "frontBumper",
                "lhsHeadlamp",
                "lhsFoglamp",
                "lhsFender",
                "lhsFrontTyre",
                "lhsFrontAlloy",
            ],
            top: "70%",
            left: "73%",
        },
        {
            id: "front_right_corner",
            label: "Front Right Corner",
            fields: [
                "frontBumper",
                "rhsHeadlamp",
                "rhsFoglamp",
                "rhsFender",
                "rhsFrontTyre",
                "rhsFrontAlloy",
            ],
            top: "63%",
            left: "55%",
        },
        {
            id: "lhs_doors",
            label: "Left Doors",
            fields: ["lhsFrontDoor", "lhsRearDoor", "lhsRunningBorder"],
            top: "55%",
            left: "45%",
        },
        {
            id: "rhs_doors",
            label: "Right Doors",
            fields: ["rhsFrontDoor", "rhsRearDoor", "rhsRunningBorder"],
            top: "55%",
            left: "65%",
        },
        {
            id: "lhs_rear_quarter",
            label: "Left Rear Quarter",
            fields: [
                "lhsQuarterPanel",
                "lhsRearTyre",
                "lhsRearAlloy",
                "lhsTailLamp",
            ],
            top: "45%",
            left: "30%",
        },
        {
            id: "rhs_rear_quarter",
            label: "Right Rear Quarter",
            fields: [
                "rhsQuarterPanel",
                "rhsRearTyre",
                "rhsRearAlloy",
                "rhsTailLamp",
            ],
            top: "38%",
            left: "46%",
        },
        {
            id: "rear_bumper",
            label: "Rear Bumper & Boot",
            fields: ["rearBumper", "bootDoor", "bootFloor"],
            top: "30%",
            left: "25%",
        },
        {
            id: "pillars_left",
            label: "Left Pillars",
            fields: ["lhsAPillar", "lhsBPillar", "lhsCPillar"],
            top: "40%",
            left: "40%",
        },
        {
            id: "pillars_right",
            label: "Right Pillars",
            fields: ["rhsAPillar", "rhsBPillar", "rhsCPillar"],
            top: "42%",
            left: "60%",
        },
    ];

    const Hotspot = ({ top, left, severity, label, details }) => {
        if (!severity) return null;
        const baseColor = severity === "major" ? "bg-red-500" : "bg-orange-400";

        return (
            <div
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-help"
                style={{ top, left }}
                title={`${label}${details ? " – " + details : ""}`}
            >
                {/* soft glow */}
                <div
                    className={`w-16 h-16 rounded-full ${baseColor} opacity-35 blur-[10px] animate-pulse`}
                />
                {/* bright core */}
                <div
                    className={`absolute inset-0 m-auto w-4 h-4 rounded-full ${baseColor} border-[2px] border-white shadow-md`}
                />
            </div>
        );
    };

    return (
        <div className="relative w-full aspect-[4/3] min-h-[320px] bg-slate-50 border border-slate-100 overflow-hidden rounded-none">
            {/* subtle grid */}
            <div className="absolute inset-0 opacity-40">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={`h-${i}`}
                        className="absolute w-full  "
                        style={{ top: `${(i + 1) * 10}%` }}
                    />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={`v-${i}`}
                        className="absolute h-full "
                        style={{ left: `${(i + 1) * 10}%` }}
                    />
                ))}
            </div>

            {/* wireframe */}
            <div
                className="absolute inset-3 bg-center bg-no-repeat bg-contain opacity-90"
                style={{ backgroundImage: `url("${BACKGROUND_IMAGE}")` }}
            />

            {/* hotspots */}
            {DAMAGE_ZONES.map((zone) => {
                const severity = getZoneSeverity(data, zone.fields);
                if (!severity) return null;

                const details = zone.fields
                    .map((key) => data?.[key])
                    .filter(
                        (v) =>
                            v &&
                            !v.toString().toLowerCase().includes("okay") &&
                            !v.toString().toLowerCase().includes("not applicable")
                    )
                    .join(" | ");

                return (
                    <Hotspot
                        key={zone.id}
                        top={zone.top}
                        left={zone.left}
                        severity={severity}
                        label={zone.label}
                        details={details}
                    />
                );
            })}
        </div>
    );
};

/* ----------------- Main Page ----------------- */

const CACHE_KEY_PREFIX = 'otobix_inspection_details_';

const InspectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle, setActionsContent } = useHeader();
    const [data, setData] = useState(() => {
        const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${id}`);
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(!data);
    const [activeTab, setActiveTab] = useState("Exterior");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        setTitle("Inspection Intelligence");
        setActionsContent(null);

        const fetchDetails = async () => {
            try {
                const res = await fetch(
                    `https://ob-dealerapp-kong.onrender.com/api/car/details/${id}`,
                    {
                        headers: {
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDBhYzc2NTA4OGQxYTA2ODc3MDU0NCIsInVzZXJOYW1lIjoiY3VzdG9tZXIiLCJ1c2VyVHlwZSI6IkN1c3RvbWVyIiwiaWF0IjoxNzY0MzMxNjMxLCJleHAiOjIwNzk2OTE2MzF9.oXw1J4ca1XoIAg-vCO2y0QqZIq0VWHdYBrl2y9iIv4Q",
                        },
                    }
                );
                const json = await res.json();
                const detailData = json.carDetails || json;
                setData(detailData);
                localStorage.setItem(`${CACHE_KEY_PREFIX}${id}`, JSON.stringify(detailData));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, setTitle, setActionsContent]);

    if (loading)
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white gap-6">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
                    Scanning Evidence Archive
                </span>
            </div>
        );

    if (!data) return null;

    const mainImg = getImgUrl(
        data.frontMain ? data.frontMain[0] : data.imageUrls?.[0] || null
    );

    const odoValue = data.odometerReadingInKms
        ? parseInt(data.odometerReadingInKms)
        : 0;
    const formattedOdo = isNaN(odoValue)
        ? "0"
        : Math.floor(odoValue / 1000).toLocaleString();

    // sections for findings (no more "General Details")
    const sections = {
        Exterior: [
            {
                label: "Front Bumper",
                v: data.frontBumper,
                i: data.frontBumperImages,
            },
            { label: "Roof", v: data.roof, i: data.roofImages },
            {
                label: "Left Front Door",
                v: data.lhsFrontDoor,
                i: data.lhsFrontDoorImages,
            },
            {
                label: "Left Rear Door",
                v: data.lhsRearDoor,
                i: data.lhsRearDoorImages,
            },
            {
                label: "Left Quarter Panel",
                v: data.lhsQuarterPanel,
                i: data.lhsQuarterPanelImages,
            },
            {
                label: "Right Front Door",
                v: data.rhsFrontDoor,
                i: data.rhsFrontDoorImages,
            },
            {
                label: "Right Rear Door",
                v: data.rhsRearDoor,
                i: data.rhsRearDoorImages,
            },
            {
                label: "Right Quarter Panel",
                v: data.rhsQuarterPanel,
                i: data.rhsQuarterPanelImages,
            },
            {
                label: "Rear Bumper",
                v: data.rearBumper,
                i: data.rearBumperImages,
            },
            {
                label: "Left Tail Lamp",
                v: data.lhsTailLamp,
                i: data.lhsTailLampImages,
            },
            {
                label: "Right Tail Lamp",
                v: data.rhsTailLamp,
                i: data.rhsTailLampImages,
            },
        ].filter((x) => x.v),
        Interior: [
            {
                label: "AC / Climate",
                v: data.airConditioningClimateControl,
            },
            {
                label: "Music System",
                v: data.musicSystem,
            },
            {
                label: "Seats",
                v: data.fabricSeats || data.leatherSeats,
                i: data.frontSeatsFromDriverSideDoorOpen,
            },
            {
                label: "Airbags",
                v: `${data.noOfAirBags || 0} Airbags`,
                i: data.airbags,
            },
        ].filter((x) => x.v),
        "Engine & Chassis": [
            { label: "Engine", v: data.engine, i: data.engineBay },
            { label: "Engine Oil", v: data.engineOil },
            { label: "Suspension", v: data.suspension },
            { label: "Brakes", v: data.brakes },
        ].filter((x) => x.v),
        Tires: [
            {
                label: "LHS Front Tyre",
                v: data.lhsFrontTyre,
                i: data.lhsFrontTyreImages,
            },
            {
                label: "RHS Front Tyre",
                v: data.rhsFrontTyre,
                i: data.rhsFrontTyreImages,
            },
            {
                label: "LHS Rear Tyre",
                v: data.lhsRearTyre,
                i: data.lhsRearTyreImages,
            },
            {
                label: "RHS Rear Tyre",
                v: data.rhsRearTyre,
                i: data.rhsRearTyreImages,
            },
            {
                label: "Spare Tyre",
                v: data.spareTyre,
                i: data.spareTyreImages,
            },
        ].filter((x) => x.v),
    };

    const currentFindings = sections[activeTab] || [];
    const allPhotos = collectAllPhotos(data);

    return (
        <div className="h-full overflow-y-auto bg-slate-50 font-sans text-slate-800 selection:bg-indigo-600 selection:text-white pb-20">
            <main className="w-full lg:pl-0 lg:pr-10 lg:py-10">
                {/* Vehicle Header */}
                <div className="bg-white border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-8 mb-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div
                            className="w-56 h-36 bg-slate-100 border border-slate-100 overflow-hidden relative cursor-zoom-in group"
                            onClick={() => setSelectedImage(mainImg)}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url("${mainImg}")` }}
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1 text-center lg:text-left">
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                                {data.yearMonthOfManufacture
                                    ? new Date(data.yearMonthOfManufacture).getFullYear()
                                    : "2021"}{" "}
                                {data.make}{" "}
                                <span className="font-light text-slate-400">
                                    {data.model}
                                </span>
                            </h1>
                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mt-1">
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-black uppercase tracking-widest">
                                    {data.variant || "SEDAN"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    • VIN: {data.appointmentId || "4T1B1..."}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    • Plate: {data.registrationNumber}
                                </span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle className="w-3.5 h-3.5" /> Passable Condition
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsGalleryOpen(true)}
                                className="px-6 py-3.5 border border-indigo-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-indigo-50 transition-all rounded-none"
                            >
                                <ImageIcon className="w-4 h-4" /> Gallery
                            </button>
                            <button className="px-8 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-indigo-700 transition-all rounded-none shadow-lg shadow-indigo-600/10">
                                <Download className="w-4 h-4" /> Download Report
                            </button>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            Report Ref ID: #{id?.slice(-8).toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between relative shadow-sm group hover:border-indigo-100 transition-all overflow-hidden">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Overall Score
                        </span>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-5xl font-black text-slate-900 leading-none">
                                88
                            </span>
                            <span className="text-slate-400 text-base font-bold">/100</span>
                        </div>
                        <div className="absolute -bottom-8 -right-8 opacity-20 transform rotate-45 pointer-events-none">
                            <div className="w-20 h-20 rounded-full border-[6px] border-t-indigo-500 border-r-indigo-500 border-b-orange-300 border-l-transparent" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm group hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Mileage{" "}
                            <Gauge className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-4xl font-black text-slate-900 leading-none">
                                {formattedOdo}
                            </span>
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                KM
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm group hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Inspection Date{" "}
                            <Calendar className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 leading-none mt-4 uppercase">
                            Oct 24, 2023
                        </span>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm group hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Inspector{" "}
                            <User className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full" />
                            <span className="text-lg font-black text-slate-900 leading-none">
                                {data.approvedBy || "John Doe"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs – General Details removed */}
                <div className="border-b border-slate-200 mb-10 flex overflow-x-auto no-scrollbar">
                    {["Exterior", "Interior", "Engine & Chassis", "Tires"].map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-5 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative ${activeTab === tab
                                    ? "text-indigo-600"
                                    : "text-slate-400 hover:text-slate-700"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-10 right-10 h-1 bg-indigo-600" />
                                )}
                            </button>
                        )
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* findings */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                {activeTab} Findings
                            </h2>
                            <button className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-700">
                                <Plus className="w-4 h-4" /> Add Finding
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {currentFindings.map((f, i) => (
                                <FindingCard
                                    key={i}
                                    title={f.label}
                                    status={f.v}
                                    image={getImgUrl(f.i)}
                                    onImageClick={setSelectedImage}
                                />
                            ))}
                        </div>

                        {/* additional photos */}
                        <div className="mt-16">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                Additional Photos{" "}
                                <div className="h-[1px] flex-1 bg-slate-200" />
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allPhotos.slice(0, 8).map((img, i) => (
                                    <div
                                        key={i}
                                        className="w-24 h-24 bg-white border border-slate-200 overflow-hidden group cursor-zoom-in"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img
                                            src={img}
                                            alt="car"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                                {allPhotos.length === 0 && (
                                    <div className="text-xs text-slate-400">
                                        No additional photos available.
                                    </div>
                                )}
                                <div className="w-24 h-24 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:border-indigo-200 cursor-pointer transition-all">
                                    <Camera className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* damage map */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-slate-200 p-10 sticky top-10 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">
                                    Damage Map
                                </h3>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-orange-400 rounded-full" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                                            Minor
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                                            Major
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <CarDamageHeatmap data={data} />

                            <div className="mt-8">
                                <div className="flex justify-between mb-3 text-[11px] font-black text-slate-700 uppercase tracking-widest">
                                    <span>Inspection Progress</span>
                                    <span className="text-indigo-600">85%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600"
                                        style={{ width: "85%" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-white border border-slate-200 p-10 shadow-sm">
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                        Inspector Notes
                    </h5>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-4xl">
                        {data.additionalRemarks || "No specific structural defects observed. Mechanical performance within nominal parameters for age and mileage. Full diagnostic scan recommended at next service interval."}
                    </p>
                </div>
            </main>

            {/* Global Modals */}
            <ImageModal
                imageUrl={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
            {isGalleryOpen && (
                <GallerySlider
                    images={allPhotos}
                    onClose={() => setIsGalleryOpen(false)}
                />
            )}
        </div>
    );
};

export default InspectionDetails;
