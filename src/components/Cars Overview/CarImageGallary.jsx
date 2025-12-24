import React, { useMemo, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

const pickImages = (car) => {
  const arr = [];
  const pushArr = (x) => Array.isArray(x) && x.forEach((u) => u && arr.push(u));
  const pushOne = (u) => u && arr.push(u);

  // best hero options from your JSON
  pushArr(car?.frontMain);
  pushArr(car?.lhsFront45Degree);
  pushArr(car?.rearMain);
  pushOne(car?.rearWithBootDoorOpen);

  // docs sometimes also useful as fallback images
  pushArr(car?.bonnetImages);
  pushArr(car?.frontBumperImages);

  // remove duplicates
  return [...new Set(arr)];
};

const CarImageGallery = ({ car }) => {
  const images = useMemo(() => pickImages(car), [car]);
  const [active, setActive] = useState(images?.[0] || "");
  const [open, setOpen] = useState(false);

  const main = active || images?.[0];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <div className="relative">
        <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
          {main ? (
            <img
              src={main}
              alt="Car"
              className="w-full h-full object-cover"
              onClick={() => setOpen(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="w-5 h-5" /> No image
              </div>
            </div>
          )}
        </div>

        {/* Soft overlay for premium feel */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      {images.length > 1 && (
        <div className="p-3 border-t border-gray-100 bg-white">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {images.slice(0, 12).map((u) => (
              <button
                key={u}
                onClick={() => setActive(u)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border transition
                  ${u === main ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
              >
                <img src={u} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simple lightbox */}
      {open && main && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={() => setOpen(false)}>
          <div className="max-w-5xl w-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={main} alt="preview" className="w-full max-h-[80vh] object-contain bg-black" />
            <div className="p-3 text-right">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-full bg-primary text-white font-bold text-sm hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarImageGallery;
