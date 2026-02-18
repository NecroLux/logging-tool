import React, { createContext, useContext, useState } from "react";
import { useLogState } from "../hooks/useLogState";
import { useExport } from "../hooks/useExport";
import { ShipType } from "../hooks/useLogState";

interface DiveEntry {
  ourTeam: "Athena" | "Reaper";
  enemyTeam: "Athena" | "Reaper";
  outcome: "win" | "loss";
  notes?: string;
}

interface LogContextType {
  // State
  mode: "patrol" | "skirmish";
  title: string;
  body: string;
  signature: string;
  subtitle: string;
  selectedShip: ShipType;
  voyageNumber: string;
  events: string;
  crew: string;
  gold: string;
  doubloons: string;
  startgold: string;
  endgold: string;
  ourTeam: "Athena" | "Reaper";
  dives: DiveEntry[];
  ancientCoins: string;
  fishCaught: string;
  parchment: number;
  setParchment: React.Dispatch<React.SetStateAction<number>>;
  frame: number;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
  isModalOpen: boolean;
  isCopyModalOpen: boolean;
  titleFont: string;
  bodyFont: string;

  // Setters
  setMode: (mode: "patrol" | "skirmish") => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;
  setSignature: (signature: string) => void;
  setSubtitle: (subtitle: string) => void;
  setSelectedShip: (ship: ShipType) => void;
  setVoyageNumber: (voyageNumber: string) => void;
  setEvents: (events: string) => void;
  setCrew: (crew: string) => void;
  setGold: (gold: string) => void;
  setStartgold: (startGold: string) => void;
  setEndgold: (endGold: string) => void;
  setDoubloons: (doubloons: string) => void;
  setOurTeam: (team: "Athena" | "Reaper") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsCopyModalOpen: (isOpen: boolean) => void;
  setTitleFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  setAncientCoins: React.Dispatch<React.SetStateAction<string>>;
  setFishCaught: React.Dispatch<React.SetStateAction<string>>;

  // Actions
  addNewDive: () => void;
  updateDive: (index: number, updates: Partial<DiveEntry>) => void;
  removeDive: (index: number) => void;
  resetState: () => void;
  formatList: (text: string) => string[];
  formatDiscordMessage: () => string;

  // Export functions
  generatePDF: () => Promise<void>;
  generateImages: () => Promise<void>;
  copyToClipboard: () => void;

  // Testing functions
  loadTestingData: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const logState = useLogState();
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pages] = useState<string[]>([]);
  const { generatePDF, generateImages, copyToClipboard } = useExport({
    title: logState.title,
    activePageIndex,
    setActivePageIndex,
    pages,
    formatDiscordMessage: logState.formatDiscordMessage,
  });

  const value = {
    ...logState,
    generatePDF,
    generateImages,
    copyToClipboard,
  };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLog must be used within a LogProvider");
  }
  return context;
};
