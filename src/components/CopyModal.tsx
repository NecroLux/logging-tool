import React from "react";
import { useLog } from "../context/LogContext";

export const CopyModal: React.FC = () => {
  const {
    isCopyModalOpen,
    setIsCopyModalOpen,
    formatDiscordMessage,
    copyToClipboard,
  } = useLog();

  const onClose = () => setIsCopyModalOpen(false);

  if (!isCopyModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-2">
      <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Discord Message</h2>
        <textarea
          className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-48 sm:h-64 text-sm sm:text-base resize-none"
          defaultValue={formatDiscordMessage()}
          readOnly
        />
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Copy
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
