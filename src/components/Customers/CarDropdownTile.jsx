import React from "react";
import { CarFront } from "lucide-react";
import SmallTileButton from "./SmallTileButton";

export default function CarDropdownTile({ onOpen }) {
  return (
    <SmallTileButton
      title="Car Dropdown"
      icon={<CarFront className="w-5 h-5" />}
      iconBg="bg-gradient-to-br from-blue-500 to-cyan-400"
      iconColor="text-white"
      rightIcon={null}
      onClick={onOpen}
    />
  );
}
