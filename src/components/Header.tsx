import React from "react";
import { useLog } from "../context/LogContext";
import { getPublicPath } from "../utils/getPublicPath";
import { Smartphone, Monitor, Settings } from "lucide-react";

interface HeaderProps {
  mobileMode?: boolean;
  onToggleMobileMode?: () => void;
  showMobileToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ mobileMode, onToggleMobileMode, showMobileToggle = true }) => {
  const { setIsModalOpen } = useLog();
  const toggleModal = () => setIsModalOpen(true);

  return (
    <header className="bg-[#2a2a2a] py-1 px-4 pr-8 text-center flex justify-between items-center">
      <div className="flex items-center gap-2">
  <img
    className="w-20 h-20"
    src={getPublicPath("USN_Logo.png")}
    alt=""
    onError={(e) => {
      const img = e.currentTarget as HTMLImageElement;
      // try a couple fallbacks: relative, root-relative
      if (!img.dataset.attempt) {
        img.dataset.attempt = "1";
        img.src = "USN_Logo.png";
      } else if (img.dataset.attempt === "1") {
        img.dataset.attempt = "2";
        img.src = "/USN_Logo.png";
      }
    }}
  />
        <h1 className="text-3xl font-bold text-amber-500">
          Voyage Log
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Mobile Mode Toggle - Desktop Only */}
        {onToggleMobileMode && showMobileToggle && (
          <button
            onClick={onToggleMobileMode}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
              mobileMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {mobileMode ? <Monitor size={18} /> : <Smartphone size={18} />}
            <span className="hidden lg:inline">{mobileMode ? "Desktop" : "Mobile"}</span>
          </button>
        )}
        <button
          onClick={toggleModal}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold p-2 rounded"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
