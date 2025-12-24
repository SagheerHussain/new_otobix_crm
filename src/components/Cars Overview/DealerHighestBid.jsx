import React from "react";
import { formatMoneyPKR, formatDateTime } from "../../utils/formatters";

const DealerHighestBids = ({ dealers = [], isLoading = false }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/40">
        <div className="text-sm font-extrabold tracking-wide text-slate-900">Dealer Highest Bids</div>
        <div className="text-xs text-slate-500 font-medium">Top bidders for this car</div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-400">Loading bids...</div>
        ) : dealers.length ? (
          <div className="divide-y divide-gray-100">
            {dealers.map((d, idx) => (
              <div key={idx} className="px-5 py-4 hover:bg-gray-50/60 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-900 truncate">{d?.userName || "Unknown"}</div>
                    <div className="text-xs font-semibold text-slate-500 truncate">{d?.dealershipName || "-"}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-1">
                      Bid time: {formatDateTime(d?.bidTime)}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-slate-900">{formatMoneyPKR(d?.highestBid)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-400">No bids found.</div>
        )}
      </div>
    </div>
  );
};

export default DealerHighestBids;
