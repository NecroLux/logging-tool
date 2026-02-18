import React from "react";
import { useLog } from "../context/LogContext";

export const SettingsModal: React.FC = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    titleFont,
    bodyFont,
    setTitleFont,
    setBodyFont,
    parchment,
    setParchment,
    frame,
    setFrame,
    loadTestingData,
  } = useLog();

  const onClose = () => setIsModalOpen(false);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-full max-w-md text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title Font</label>
            <select
              value={titleFont}
              onChange={(e) => setTitleFont(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            >
              <option value="Charm">Charm (Default)</option>
              <option value="Quintessential">Quintessential</option>
              <option value="Felipa">Felipa</option>
              <option value="Parisienne">Parisienne</option>
              <option value="Jim Nightshade">Jim Nightshade</option>
              <option value="Niconne">Niconne</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Log Entry Font
            </label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            >
              <option value="Charm">Charm (Default)</option>
              <option value="Quintessential">Quintessential</option>
              <option value="Felipa">Felipa</option>
              <option value="Parisienne">Parisienne</option>
              <option value="Jim Nightshade">Jim Nightshade</option>
              <option value="Niconne">Niconne</option>
            </select>
          </div>

          
          
          <div>
            <label className="block text-sm font-medium mb-2">Parchment</label>
            <select
              value={parchment}
              onChange={(e) => setParchment(Number(e.target.value))}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Frame</label>
            <select
              value={frame}
              onChange={(e) => setFrame(Number(e.target.value))}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            >
              <option value={0}>None</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
                  </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            onClick={() => {
              loadTestingData();
              onClose();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Load Testing Data
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
