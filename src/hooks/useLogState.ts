import { useState, useEffect, useRef } from "react";

type DiveEntry = {
  ourTeam: "Athena" | "Reaper";
  enemyTeam: "Athena" | "Reaper";
  outcome: "win" | "loss";
  notes: string;
};

export type LogMode = "patrol" | "skirmish";
export type ShipType = "Gullinbursti" | "Jormungandr" | "Freyr" | "Gjallarhorn" | "Odin" | "Skadi" | "Nott" | "Hodr" | "Audacious" | "Berserker" | "Bestla" | "Ragnarok" | "Thor" | "Titan" | "Tyr" | "Valhalla";

export const RETIRED_SHIPS: ShipType[] = ["Jormungandr", "Odin", "Freyr", "Audacious", "Berserker", "Bestla", "Ragnarok", "Thor", "Titan", "Tyr", "Valhalla"];

export function useLogState() {
  // Mode and basic fields
  const [mode, setMode] = useState<LogMode>("patrol");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedShip, setSelectedShip] = useState<ShipType>("Gullinbursti");

  // Patrol-specific fields
  const [events, setEvents] = useState("");
  const [crew, setCrew] = useState("");
  const [gold, setGold] = useState("");
  const [doubloons, setDoubloons] = useState("");
  const [startgold, setStartgold] = useState("");
  const [endgold, setEndgold] = useState("");

  // Skirmish-specific fields
  const [ourTeam, setOurTeam] = useState<"Athena" | "Reaper">("Athena");
  const [dives, setDives] = useState<DiveEntry[]>([]);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Font choices
  const [titleFont, setTitleFont] = useState("Charm");
  const [bodyFont, setBodyFont] = useState("Charm");

  // Parchment selector (1-5)
  const [parchment, setParchment] = useState<number>(1);

  // Frame selector (0 for none, 1-5)
  const [frame, setFrame] = useState<number>(1);

  // Add this state to track the voyage number
  const [voyageNumber, setVoyageNumber] = useState("");

  // Add these state declarations near the gold/doubloons states:
  const [ancientCoins, setAncientCoins] = useState("");
  const [fishCaught, setFishCaught] = useState("");

  // -----------------------------------
  // Load from localStorage on mount
  // -----------------------------------
  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) setMode(savedMode as LogMode);
    const savedVoyageNumber = localStorage.getItem("voyageNumber");
    if (savedVoyageNumber) setVoyageNumber(savedVoyageNumber);
    const savedAncientCoins = localStorage.getItem("ancientCoins");
    if (savedAncientCoins) setAncientCoins(savedAncientCoins);
    const savedFishCaught = localStorage.getItem("fishCaught");
    if (savedFishCaught) setFishCaught(savedFishCaught);
    const savedParchment = localStorage.getItem("parchment");
    if (savedParchment) setParchment(Number(savedParchment) || 1);
    const savedFrame = localStorage.getItem("frame");
    if (savedFrame) setFrame(Number(savedFrame) || 0);
  }, []);

  // Initialize crew with one empty entry if none exists
  useEffect(() => {
    if (crew === "") {
      setCrew(JSON.stringify([{
        id: String(Date.now()),
        name: "",
        discord: "",
        rank: "",
        role: ""
      }]));
    }
  }, []);

  // Helper: Debounce calls to localStorage
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Save to localStorage whenever relevant fields change
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("mode", mode);
      // DELETE THIS LINE:
      // localStorage.setItem("title", title);
      localStorage.setItem("body", body);
      localStorage.setItem("signature", signature);
      localStorage.setItem("subtitle", subtitle);
      localStorage.setItem("events", events);
      localStorage.setItem("crew", crew);
      localStorage.setItem("gold", gold);
      localStorage.setItem("doubloons", doubloons);
      localStorage.setItem("ourTeam", ourTeam);
      localStorage.setItem("dives", JSON.stringify(dives));
      localStorage.setItem("selectedShip", selectedShip);
      localStorage.setItem("titleFont", titleFont);
      localStorage.setItem("bodyFont", bodyFont);
  // save parchment
  localStorage.setItem("parchment", String(parchment));
      // save frame
      localStorage.setItem("frame", String(frame));
      localStorage.setItem("voyageNumber", voyageNumber);
      // Add to localStorage save section:
      localStorage.setItem("ancientCoins", ancientCoins);
      localStorage.setItem("fishCaught", fishCaught);
    };
    const debouncedSave = debounce(saveToLocalStorage, 500);
    debouncedSave();
  }, [
    mode,
    // DELETE: title,
    body,
    signature,
    subtitle,
    events,
    crew,
    gold,
    doubloons,
    ourTeam,
    dives,
    selectedShip,
    titleFont,
    bodyFont,
    voyageNumber,
    ancientCoins,
    fishCaught,
    parchment,
    frame,
  ]);

  // Skirmish dive management
  const addNewDive = () => {
    const newDive: DiveEntry = {
      ourTeam,
      enemyTeam: ourTeam === "Athena" ? "Reaper" : "Athena",
      outcome: "win",
      notes: "",
    };
    setDives([...dives, newDive]);
  };

  const updateDive = (index: number, updated: Partial<DiveEntry>) => {
    setDives(dives.map((d, i) => (i === index ? { ...d, ...updated } : d)));
  };

  const removeDive = (index: number) => {
    setDives(dives.filter((_, i) => i !== index));
  };

  // Reset all state
  const resetState = () => {
    setTitle("Log Title");
    setBody("");
    setSignature("");
    setSubtitle("");
    setEvents("");
    setCrew("");
    setGold("");
    setDoubloons("");
    setOurTeam("Athena");
    setDives([]);
    setVoyageNumber(""); // Add this line
    setAncientCoins("");
    setFishCaught("");
    setStartgold("");
    setEndgold("");
    setSelectedShip("Gullinbursti"); // Add this line too
    setTitleFont("Felipa");
    setBodyFont("Jim Nightshade");
    setParchment(1);
    setFrame(1);
  };

  // Format list helper
  const formatList = (text: string) => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim() !== "");
  };

  // Add this helper function before the formatDiscordMessage function
  const getOrdinal = (num: string) => {
    const n = Number(num);
    if (!Number.isFinite(n) || n === 0) return "nth";
    const rem100 = n % 100;
    if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
    const rem10 = n % 10;
    if (rem10 === 1) return `${n}st`;
    if (rem10 === 2) return `${n}nd`;
    if (rem10 === 3) return `${n}rd`;
    return `${n}th`;
  };

  // Discord message formatting
  const formatDiscordMessage = () => {
    let crewList: { id: string; name: string; discord: string; rank: string; role: string; isRep?: boolean }[] = [];
    try {
      crewList = JSON.parse(crew || "[]");
    } catch {
      crewList = [];
    }

    // Find the host crew member by signature (which is now the ID)
    const hostCrew = crewList.find(c => c.id === signature);
    const hostDiscordId = hostCrew?.discord || "000000000000000000";

    const rankOrder = [
      "Recruit",
      "Seaman",
      "Marine",
      "Lance Corporal",
      "Able Seaman",
      "Corporal",
      "Junior Petty Officer",
      "Staff Sergeant",
      "Petty Officer",
      "Gunnery Sergeant",
      "Chief Petty Officer",
      "Master Sergeant",
      "Senior Chief Petty Officer",
      "Second Lieutenant",
      "Midshipman",
      "Marine Captain",
      "Lieutenant",
      "Major",
      "Lieutenant Commander",
      "Lieutenant Colonel",
      "Commander",
      "Colonel",
      "Captain",
      "Brigadier General",
      "Commodore",
      "Major General",
      "Rear Admiral",
      "Vice Admiral",
      "Admiral",
    ];

    crewList.sort((a, b) => {
      const aIdx = rankOrder.indexOf(a.rank);
      const bIdx = rankOrder.indexOf(b.rank);
      return bIdx - aIdx; // highest rank first
    });

    const roleEmojis: Record<string, string> = {
      Helm: ":Wheel:",
      Cannons: ":Cannon:",
      Carpenter: ":Planks:",
      Flex: ":SwordFight:",
    };

    const crewLines = crewList
      .filter(c => c.discord && c.role)
      .map((c) => {
        const emoji = roleEmojis[c.role] || "";
        const repTag = c.isRep ? " [REP]" : "";
        return `<@${c.discord}> - ${c.role} ${emoji}${repTag}`.trim();
      })
      .join("\n");

    const eventLines = (events || "")
      .split("\n")
      .filter(Boolean)
      .join("\n");

    const auxiliaryText = selectedShip === "Gullinbursti" 
      ? "" 
      : ", auxiliary to the USS Gullinbursti";

    const voyageText = voyageNumber ? getOrdinal(voyageNumber) : "nth";

    if (mode === "patrol") {
      const lootLines = [];
      lootLines.push(`:Gold: Gold: ${gold || "0"}`);
      lootLines.push(`:Doubloons: Doubloons: ${doubloons || "0"}`);
      
      if (ancientCoins && parseInt(ancientCoins) > 0) {
        lootLines.push(`:AncientCoin: Ancient Coins: ${ancientCoins}`);
      }
      
      if (fishCaught && parseInt(fishCaught) > 0) {
        lootLines.push(`:fish: Fish: ${fishCaught}`);
      }

      return `<@${hostDiscordId}>'s log of the ${voyageText} voyage (Patrol) aboard the USS ${selectedShip}${auxiliaryText}.

**Entry Log**
${body || ""}

**Loot Confiscated:**
${lootLines.join('\n')}

**Events:**
${eventLines || "None"}

**Crew:**
${crewLines || "No crew assigned"}

:Gullinbursti: Charging Forth, Radiant and Unyielding :Gullinbursti:`;
    } else {
      const diveLines = dives.length
        ? dives
            .map((d, i) => {
              return `${i + 1}. ${d.ourTeam} vs ${d.enemyTeam} (${d.outcome})${d.notes ? ` - ${d.notes}` : ""}`;
            })
            .join("\n")
        : "No dives recorded";

      return `<@${hostDiscordId}>'s log of the ${voyageText} voyage (Skirmish) aboard the USS ${selectedShip}${auxiliaryText}.

**Entry Log**
${body || ""}

**Team:** ${ourTeam}

**Crew:**
${crewLines || "No crew assigned"}

**Dives:**
${diveLines}

:Gullinbursti: Charging Forth, Radiant and Unyielding :Gullinbursti:`;
    }
  };

  // For tracking whether gold was last set by the auto-compute
  const computedGoldRef = useRef<string | null>(null);

  // Auto-calc gold = endgold - startgold but don't override manual edits
  useEffect(() => {
    const parseAmount = (v: string) => {
      if (!v) return 0;
      const n = parseFloat(v.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    const start = parseAmount(startgold);
    const end = parseAmount(endgold);
    const diff = end - start;
    const diffStr = diff ? String(diff) : "";

    // only update when gold is empty or was last set by this auto-compute
    if (gold === "" || computedGoldRef.current === gold) {
      setGold(diffStr);
      computedGoldRef.current = diffStr;
    }
  }, [startgold, endgold]);

  // Add this function back to useLogState:

  const loadTestingData = () => {
    const testCrew = [
      { id: "1", name: "John Blackhook", discord: "123456789", rank: "Admiral", role: "Helm", isRep: false },
      { id: "2", name: "Ruper Ironside", discord: "234567890", rank: "Captain", role: "Cannons", isRep: false },
      { id: "3", name: "Dirk Wavecrest", discord: "345678901", rank: "Lieutenant", role: "Carpenter", isRep: false },
      { id: "4", name: "Jorg Stormbreaker", discord: "456789012", rank: "Seaman", role: "Flex", isRep: false },
      { id: "5", name: "Erik Saltbeard", discord: "567890123", rank: "Marine", role: "Helm", isRep: true },
    ];

    if (mode === "patrol") {
      setVoyageNumber("5");
      setBody("Set sail at dawn under favorable winds. Encountered three merchant vessels and one skeleton galleon. All encounters resolved favorably. Crew performed excellently throughout the expedition. Returned to port with full holds and morale high.");
      // signature should reference the crew id (not the discord id)
      setSignature(testCrew[0].id);
      setEvents("Merchant Vessel Encountered\nSkeleton Galleon Vanquished\nKraken Tentacle Spotted\nLegendary Treasure Map Found");
      setGold("5,250");
      setDoubloons("180");
      setStartgold("1,000");
      setEndgold("6,250");
      setAncientCoins("25");
      setFishCaught("12");
    } else {
      setVoyageNumber("3");
      setBody("Competed in intense skirmish battles against rival crews. Team displayed exceptional coordination and tactical prowess. Multiple close matches showcased the skill of our sailors.");
      setSignature(testCrew[0].id);
      setOurTeam("Athena");
      setDives([
        {
          ourTeam: "Athena",
          enemyTeam: "Reaper",
          outcome: "win",
          notes: "Superior cannon work and smart positioning",
        },
        {
          ourTeam: "Athena",
          enemyTeam: "Reaper",
          outcome: "loss",
          notes: "Caught off guard by their anchor strategy",
        },
        {
          ourTeam: "Athena",
          enemyTeam: "Reaper",
          outcome: "win",
          notes: "Excellent teamwork, clean victory",
        },
      ]);
    }

    // Set crew data and force a re-sync
    setCrew(JSON.stringify(testCrew));
    
    // Small delay to ensure the Editor's useEffect picks up the change
    setTimeout(() => {
      setCrew("[]"); // Clear first
      setTimeout(() => {
        setCrew(JSON.stringify(testCrew)); // Then set testing data
      }, 10);
    }, 10);
  };

  return {
    mode,
    setMode,
    selectedShip,
    setSelectedShip,
    events,
    setEvents,
    crew,
    setCrew,
    gold,
    setGold,
    doubloons,
    setDoubloons,
    startgold,
    setStartgold,
    endgold,
    setEndgold,
    signature,
    setSignature,
    subtitle,
    setSubtitle,
    title,
    setTitle,
    ourTeam,
    setOurTeam,
    body,
    setBody,
    titleFont,
    setTitleFont,
    bodyFont,
    setBodyFont,
    formatList,
    voyageNumber,
    setVoyageNumber,
    formatDiscordMessage,
    isModalOpen,
    setIsModalOpen,
    isCopyModalOpen,
    setIsCopyModalOpen,
    // Add to return object:
    ancientCoins,
    setAncientCoins,
    fishCaught,
    setFishCaught,
    parchment,
    setParchment,
    frame,
    setFrame,
    dives,
    updateDive,
    removeDive,
    addNewDive,
    resetState,
    loadTestingData,
  };
}
