import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Car as CarIcon, Trophy } from "lucide-react";

import { fetchCarDetails, fetchHighestBidsOnCar } from "../services/cars";
import CarImageGallery from "../components/Cars Overview/CarImageGallary";
import DealerHighestBids from "../components/Cars Overview/DealerHighestBid";
import KeyValueGrid from "../components/Cars Overview/KeyValueGrid";
import SectionCard from "../components/Cars Overview/SectionCard";
import StatusBadge from "../components/Cars Overview/StatusBadge";
import DocGallery from "../components/Cars Overview/DocGallary";

import {
  formatMoneyPKR,
  formatDateOnly,
  formatKm,
  normalizeAuctionStatusLabel,
} from "../utils/formatters";

const CarOverviewwDetail = () => {
  const { id } = useParams(); // route: /Cars OverviewOverview/:id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [error, setError] = useState("");

  const [car, setCar] = useState(null);
  const [highestBids, setHighestBids] = useState([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const detailsRes = await fetchCarDetails(id);
        const c = detailsRes?.carDetails;

        if (!c?._id && !c?.id) throw new Error("Invalid car details response");

        if (!mounted) return;
        setCar(c);

        // parallel fetch highest bids (admin endpoint)
        setLoadingBids(true);
        try {
          const bidsRes = await fetchHighestBidsOnCar(c?._id || id);
          const dealers = bidsRes?.dealers || [];
          if (mounted) setHighestBids(dealers);
        } catch (e) {
          if (mounted) setHighestBids([]);
        } finally {
          if (mounted) setLoadingBids(false);
        }
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load car detail");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  const title = useMemo(() => {
    if (!car) return "";
    const year = car?.yearMonthOfManufacture ? new Date(car.yearMonthOfManufacture).getFullYear() : "";
    return `${car?.make || ""} ${car?.model || ""} ${car?.variant || ""} ${year || ""}`.trim();
  }, [car]);

  const quickItems = useMemo(() => {
    if (!car) return [];
    return [
      { label: "Appointment ID", value: car?.appointmentId },
      { label: "City", value: car?.city },
      { label: "Odometer", value: formatKm(car?.odometerReadingInKms ?? car?.odometerKm ?? car?.odometer) },
      { label: "Highest Bid", value: formatMoneyPKR(car?.highestBid) },
      { label: "Status", value: normalizeAuctionStatusLabel(car?.auctionStatus || car?.auctionStatus) },
    ];
  }, [car]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white border border-rose-100 rounded-2xl p-6 text-rose-600 font-semibold">
          {error}
        </div>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="h-full bg-background-light">
      {/* Top Bar */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 flex items-center justify-center transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold text-slate-900 leading-tight">{title || "Car Detail"}</div>
                <StatusBadge status={car?.auctionStatus} />
              </div>
              <div className="text-sm text-slate-500 font-medium mt-1">
                Appointment ID: <span className="font-bold text-slate-700">{car?.appointmentId || "-"}</span>
                <span className="mx-2 text-slate-300">•</span>
                City: <span className="font-bold text-slate-700">{car?.city || "-"}</span>
              </div>
            </div>
          </div>

          {/* Premium chip */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Highest Bid</div>
              <div className="text-sm font-black text-slate-900">{formatMoneyPKR(car?.highestBid)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout (matches your modal style but as a page) */}
      <div className="px-6 pb-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-7 space-y-6">
            <SectionCard
              title="Car Overview"
              right={
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <CarIcon className="w-4 h-4" />
                  {formatDateOnly(car?.timestamp || car?.createdAt)}
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <CarImageGallery car={car} />
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <KeyValueGrid items={quickItems} />

                  {/* Small “WOW” highlight */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                      Auction Timeline
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-slate-500 font-bold">Start</div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {formatDateOnly(car?.auctionStartTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold">End</div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {formatDateOnly(car?.auctionEndTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Documents (optional but makes UI feel premium) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocGallery title="RC / Tax Token" urls={car?.rcTaxToken || []} />
              <DocGallery title="Insurance Copy" urls={car?.insuranceCopy || []} />
            </div>

            {/* More details section (kept clean but rich) */}
            <SectionCard title="Registration & Vehicle Info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Registration No." value={car?.registrationNumber} />
                <InfoRow label="Registration Type" value={car?.registrationType} />
                <InfoRow label="Registered RTO" value={car?.registeredRto} />
                <InfoRow label="Registration State" value={car?.registrationState} />
                <InfoRow label="RC Availability" value={car?.rcBookAvailability} />
                <InfoRow label="RC Condition" value={car?.rcCondition} />
                <InfoRow label="Owner" value={car?.registeredOwner} />
                <InfoRow label="Owner Serial" value={car?.ownerSerialNumber} />
                <InfoRow label="Fuel Type" value={car?.fuelType} />
                <InfoRow label="Cubic Capacity" value={car?.cubicCapacity ? `${car.cubicCapacity} cc` : "-"} />
              </div>
            </SectionCard>
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-5 space-y-6">
            <DealerHighestBids dealers={highestBids} isLoading={loadingBids} />

            <SectionCard title="Commercial">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Metric title="Price Discovery" value={formatMoneyPKR(car?.priceDiscovery)} />
                <Metric title="Customer Expected" value={formatMoneyPKR(car?.customerExpectedPrice)} />
                <Metric title="Fixed Margin" value={car?.fixedMargin ?? "-"} suffix="%" />
                <Metric title="Variable Margin" value={car?.variableMargin ?? "-"} suffix="%" />
                <Metric title="Sold At" value={car?.soldAt ? formatMoneyPKR(car?.soldAt) : "-"} />
                <Metric title="Sold To" value={car?.soldTo ? (car?.soldToName || car?.soldTo) : "-"} />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarOverviewwDetail;

/* ---------- small UI bits (kept inside file) ---------- */

const InfoRow = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-sm transition">
      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-slate-900 break-words">{value || "-"}</div>
    </div>
  );
};

const Metric = ({ title, value, suffix = "" }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">{title}</div>
      <div className="mt-1 text-base font-black text-slate-900">
        {value}
        {suffix ? <span className="text-slate-400 font-black"> {suffix}</span> : null}
      </div>
    </div>
  );
};
