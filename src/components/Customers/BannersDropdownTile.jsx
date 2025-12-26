import React from "react";
import { Image as ImageIcon, Layout, Car, ChevronDown, Images } from "lucide-react";
import SmallTileButton from "./SmallTileButton";

export default function BannersDropdownTile({ onSelect }) {
  return (
    <div className="relative group w-full">
      {/* Main tile (height will remain constant) */}
      <div className="pb-2">
        <SmallTileButton
          title="Banners"
          icon={<ImageIcon className="w-5 h-5" />}
          iconBg="bg-gradient-to-br from-indigo-500 to-sky-400"
          iconColor="text-white"
          rightIcon={
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          }
          onClick={() => {}}
        />
      </div>

      {/* Dropdown overlay (does NOT affect layout height) */}
      <div
        className="
          absolute left-0 top-full
          w-full
          z-50
          opacity-0 invisible pointer-events-none
          translate-y-1 scale-[0.98]
          transition-all duration-200 ease-out
          group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto
          group-hover:translate-y-0 group-hover:scale-100
        "
      >
        <div className="grid grid-cols-1 gap-1">
          <SmallTileButton
            title="Home Page Banner"
            icon={<Images className="w-5 h-5" />}
            iconBg="bg-gradient-to-br from-emerald-500 to-lime-400"
            iconColor="text-white"
            rightIcon={null}
            onClick={() => onSelect?.("Home")}
          />

          <SmallTileButton
            title="Sell My Car Banner"
            icon={<Car className="w-5 h-5" />}
            iconBg="bg-gradient-to-br from-rose-500 to-orange-400"
            iconColor="text-white"
            rightIcon={null}
            onClick={() => onSelect?.("Sell My Car")}
          />
        </div>
      </div>
    </div>
  );
}
