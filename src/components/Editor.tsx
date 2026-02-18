import React from "react";
import { FileText, Image, RotateCcw } from "lucide-react";
import { useLog } from "../context/LogContext";
import { ShipType, RETIRED_SHIPS } from "../hooks/useLogState";
import { getPublicPath } from "../utils/getPublicPath";

// Don't precompute at module init; compute inline and provide fallbacks via onError
// (some hosting/base combos can make absolute paths fail)

export const Editor: React.FC = () => {
  const {
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
    ancientCoins,
    setAncientCoins,
    fishCaught,
    setFishCaught,
    dives,
    updateDive,
    removeDive,
    addNewDive,
    resetState,
    setIsCopyModalOpen,
    signature,
    setSignature,
    ourTeam,
    setOurTeam,
    body,
    setBody,
    voyageNumber,
    setVoyageNumber,
    subtitle,
    setSubtitle,
  } = useLog();  // Crew entries (fully dynamic) - Start with 2 empty crew members
  type CrewEntry = {
    id: string;
    name: string;
    discord: string;
    rank: "Recruit" | "Apprentice" | "Seaman" | "Seawoman" | "Marine" | "Lance Corporal" | "Able Seaman" | "Able Seawoman" | "Corporal" | "Junior Petty Officer" | "Staff Sergeant" | "Petty Officer" | "Gunnery Sergeant" | "Chief Petty Officer" | "Master Sergeant" | "Senior Chief Petty Officer" | "Second Lieutenant" | "Midshipman" | "Midshipwoman" | "Marine Captain" | "Lieutenant" | "Major" | "Lieutenant Commander" | "Lieutenant Colonel" | "Commander" | "Colonel" | "Captain" | "Brigadier General" | "Commodore" | "Major General" | "Rear Admiral" | "Vice Admiral" | "Admiral" | "";
    role: "Helm" | "Gunner" | "Carpenter" | "Flex" | "";
    isRep: boolean;
  };

  const [crewEntries, setCrewEntries] = React.useState<CrewEntry[]>([
    { id: String(Date.now()), name: "", discord: "", rank: "", role: "", isRep: false },
    { id: String(Date.now() + 1), name: "", discord: "", rank: "", role: "", isRep: false },
  ]);

  // Initialize crewEntries from context crew JSON (run once)
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(crew || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCrewEntries(parsed);
      }
      // If crew is empty, keep the default 2 crew members
    } catch {
      // Keep default crew entries on parse error
    }
  }, []); // only on mount

  // Sync crewEntries -> context (serialize to crew JSON)
  React.useEffect(() => {
    try {
      setCrew(JSON.stringify(crewEntries));
    } catch (e) {
      console.error("Failed to serialize crew:", e);
    }
  }, [crewEntries, setCrew]);

  return (
    <div className="w-full md:w-1/2 overflow-y-auto overflow-x-hidden md:mb-96">
      <div className="w-full bg-[#2a2a2a] p-6 rounded-lg">
        <div className="space-y-4">
          <div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label htmlFor="ship-select" className="block text-sm font-medium mb-2">
                  Select Ship
                </label>
                <select
                  id="ship-select"
                  value={selectedShip}
                  onChange={(e) => setSelectedShip(e.target.value as ShipType)}
                  className="w-full p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                >
                  <optgroup label="Active Ships">
                    <option value="Gullinbursti">Gullinbursti</option>
                    <option value="Gjallarhorn">Gjallarhorn</option>
                    <option value="Skadi">Skadi</option>
                    <option value="Nott">Nott</option>
                    <option value="Hodr">Hodr</option>
                  </optgroup>
                  <optgroup label="Retired Ships">
                    {RETIRED_SHIPS.map((ship) => (
                      <option key={ship} value={ship}>{ship} (Retired)</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium mb-2">Voyage #</label>
                <input
                  type="number"
                  value={voyageNumber}
                  onChange={(e) => setVoyageNumber(e.target.value)}
                  className="w-full p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                  placeholder="#"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Crew & Roles</label>
            <div className="space-y-2">
              {crewEntries.map((c, i) => {
                return (
                  <div key={c.id || i}>
                    {/* Desktop: Single row layout */}
                    <div className="hidden md:flex items-center gap-2">
                      <select
                        value={c.rank}
                        onChange={(e) =>
                          setCrewEntries((prev) =>
                            prev.map((p, idx) =>
                              idx === i
                                ? { ...p, rank: e.target.value as CrewEntry["rank"] }
                                : p
                            )
                          )
                        }
                        className={`w-36 p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-sm ${c.rank === "" ? "text-gray-400" : "text-white"}`}
                      >
                        <option value="" disabled>Rank</option>
                        <option value="Recruit">Recruit</option>
                        <option value="Apprentice">Apprentice</option>
                        <option value="Seaman">Seaman</option>
                        <option value="Seawoman">Seawoman</option>
                        <option value="Marine">Marine</option>
                        <option value="Lance Corporal">Lance Corporal</option>
                        <option value="Able Seaman">Able Seaman</option>
                        <option value="Able Seawoman">Able Seawoman</option>
                        <option value="Corporal">Corporal</option>
                        <option value="Junior Petty Officer">Junior Petty Officer</option>
                        <option value="Staff Sergeant">Staff Sergeant</option>
                        <option value="Petty Officer">Petty Officer</option>
                        <option value="Gunnery Sergeant">Gunnery Sergeant</option>
                        <option value="Chief Petty Officer">Chief Petty Officer</option>
                        <option value="Master Sergeant">Master Sergeant</option>
                        <option value="Senior Chief Petty Officer">Senior Chief Petty Officer</option>
                        <option value="Second Lieutenant">Second Lieutenant</option>
                        <option value="Midshipman">Midshipman</option>
                        <option value="Midshipwoman">Midshipwoman</option>
                        <option value="Marine Captain">Marine Captain</option>
                        <option value="Lieutenant">Lieutenant</option>
                        <option value="Major">Major</option>
                        <option value="Lieutenant Commander">Lieutenant Commander</option>
                        <option value="Lieutenant Colonel">Lieutenant Colonel</option>
                        <option value="Commander">Commander</option>
                        <option value="Colonel">Colonel</option>
                        <option value="Captain">Captain</option>
                        <option value="Brigadier General">Brigadier General</option>
                        <option value="Commodore">Commodore</option>
                        <option value="Major General">Major General</option>
                        <option value="Rear Admiral">Rear Admiral</option>
                        <option value="Vice Admiral">Vice Admiral</option>
                        <option value="Admiral">Admiral</option>
                      </select>
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) =>
                          setCrewEntries((prev) => prev.map((p, idx) => (idx === i ? { ...p, name: e.target.value } : p)))
                        }
                        className="w-40 p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white text-sm"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={c.discord}
                        onChange={(e) =>
                          setCrewEntries((prev) => prev.map((p, idx) => (idx === i ? { ...p, discord: e.target.value } : p)))
                        }
                        className="w-40 p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white text-sm"
                        placeholder="Discord ID"
                      />
                      <select
                        value={c.role}
                        onChange={(e) =>
                          setCrewEntries((prev) =>
                            prev.map((p, idx) =>
                              idx === i
                                ? { ...p, role: e.target.value as CrewEntry["role"] }
                                : p
                            )
                          )
                        }
                        className={`w-24 p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-sm ${c.role === "" ? "text-gray-400" : "text-white"}`}
                      >
                        <option value="" disabled>Role</option>
                        <option value="Helm">Helm</option>
                        <option value="Gunner">Gunner</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Flex">Flex</option>
                      </select>
                      <label className="flex items-center gap-1 text-white text-xs whitespace-nowrap flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={c.isRep || false}
                          onChange={(e) =>
                            setCrewEntries((prev) => prev.map((p, idx) => (idx === i ? { ...p, isRep: e.target.checked } : p)))
                          }
                          className="w-4 h-4"
                        />
                        REP
                      </label>
                      <button
                        onClick={() => setCrewEntries((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-red-400 text-sm px-1 flex-shrink-0"
                        aria-label={`Remove crew member ${i + 1}`}
                      >
                        X
                      </button>
                    </div>

                    {/* Mobile: 2 rows with 2 columns */}
                    <div className="md:hidden space-y-2 border border-gray-600 p-3 rounded bg-[#2a2a2a] relative">
                      <button
                        onClick={() => setCrewEntries((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 text-red-400 text-sm"
                        aria-label={`Remove crew member ${i + 1}`}
                      >
                        X
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={c.rank}
                          onChange={(e) =>
                            setCrewEntries((prev) =>
                              prev.map((p, idx) =>
                                idx === i
                                  ? { ...p, rank: e.target.value as CrewEntry["rank"] }
                                  : p
                              )
                            )
                          }
                          className={`w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-sm ${c.rank === "" ? "text-gray-400" : "text-white"}`}
                        >
                          <option value="" disabled>Rank</option>
                          <option value="Recruit">Recruit</option>
                          <option value="Apprentice">Apprentice</option>
                          <option value="Seaman">Seaman</option>
                          <option value="Seawoman">Seawoman</option>
                          <option value="Marine">Marine</option>
                          <option value="Lance Corporal">Lance Corporal</option>
                          <option value="Able Seaman">Able Seaman</option>
                          <option value="Able Seawoman">Able Seawoman</option>
                          <option value="Corporal">Corporal</option>
                          <option value="Junior Petty Officer">Junior Petty Officer</option>
                          <option value="Staff Sergeant">Staff Sergeant</option>
                          <option value="Petty Officer">Petty Officer</option>
                          <option value="Gunnery Sergeant">Gunnery Sergeant</option>
                          <option value="Chief Petty Officer">Chief Petty Officer</option>
                          <option value="Master Sergeant">Master Sergeant</option>
                          <option value="Senior Chief Petty Officer">Senior Chief Petty Officer</option>
                          <option value="Second Lieutenant">Second Lieutenant</option>
                          <option value="Midshipman">Midshipman</option>
                          <option value="Midshipwoman">Midshipwoman</option>
                          <option value="Marine Captain">Marine Captain</option>
                          <option value="Lieutenant">Lieutenant</option>
                          <option value="Major">Major</option>
                          <option value="Lieutenant Commander">Lieutenant Commander</option>
                          <option value="Lieutenant Colonel">Lieutenant Colonel</option>
                          <option value="Commander">Commander</option>
                          <option value="Colonel">Colonel</option>
                          <option value="Captain">Captain</option>
                          <option value="Brigadier General">Brigadier General</option>
                          <option value="Commodore">Commodore</option>
                          <option value="Major General">Major General</option>
                          <option value="Rear Admiral">Rear Admiral</option>
                          <option value="Vice Admiral">Vice Admiral</option>
                          <option value="Admiral">Admiral</option>
                        </select>
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) =>
                            setCrewEntries((prev) => prev.map((p, idx) => (idx === i ? { ...p, name: e.target.value } : p)))
                          }
                          className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white text-sm"
                          placeholder="Name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={c.discord}
                          onChange={(e) =>
                            setCrewEntries((prev) => prev.map((p, idx) => (idx === i ? { ...p, discord: e.target.value } : p)))
                          }
                          className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white text-sm"
                          placeholder="Discord ID"
                        />
                        <div className="flex gap-2">
                          <select
                            value={c.role}
                            onChange={(e) =>
                              setCrewEntries((prev) =>
                                prev.map((p, idx) =>
                                  idx === i
                                    ? { ...p, role: e.target.value as CrewEntry["role"] }
                                    : p
                                )
                              )
                            }
                            className={`flex-1 p-2 bg-[#3a3a3a] rounded border border-gray-600 text-sm ${c.role === "" ? "text-gray-400" : "text-white"}`}
                          >
                            <option value="" disabled>Role</option>
                            <option value="Helm">Helm</option>
                            <option value="Gunner">Gunner</option>
                            <option value="Carpenter">Carpenter</option>
                            <option value="Flex">Flex</option>
                          </select>
                          <label className="flex items-center gap-1 text-white text-xs whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={c.isRep || false}
                              onChange={(e) =>
                                setCrewEntries((prev) => prev.map((p, idx) => (idx === i ? { ...p, isRep: e.target.checked } : p)))
                              }
                              className="w-4 h-4"
                            />
                            REP
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div>
                <button
                  onClick={() =>
                    setCrewEntries((prev) => [
                      ...prev,
                      { id: String(Date.now()), name: "", discord: "", rank: "", role: "", isRep: false },
                    ])
                  }
                  className="mt-2 bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                >
                  Add Crew Member
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "patrol" | "skirmish")}
              className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
            >
              <option value="patrol">Patrol</option>
              <option value="skirmish">Skirmish</option>
            </select>
          </div>

          {mode === "patrol" ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Events
                </label>
                <div className="space-y-2">
                  {events.split("\n").filter(line => line.trim()).map((event, i) => {
                    // Parse existing format "3x Event Name" or default to "1x Event Name"
                    const match = event.match(/^(\d+)x\s*(.*)$/);
                    const count = match ? match[1] : "1";
                    const description = match ? match[2] : event;
                    
                    return (
                      <div key={i} className="flex gap-2">
                        <input
                          type="number"
                          value={count}
                          onChange={(e) => {
                            const lines = events.split("\n").filter(line => line.trim());
                            // Default to 1 if the value is empty or invalid
                            const raw = e.target.value;
                            const newCount = raw && /^\d+$/.test(raw) ? raw : "1";
                            const match = lines[i].match(/^(\d+)x\s*(.*)$/);
                            const description = match ? match[2] : lines[i];
                            lines[i] = `${newCount}x ${description}`;
                            setEvents(lines.join("\n"));
                          }}
                          min="1"
                          className="w-16 p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white text-center"
                        />
                        <span className="self-center text-white">x</span>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => {
                            const lines = events.split("\n").filter(line => line.trim());
                            const match = lines[i].match(/^(\d+)x\s*(.*)$/);
                            const currentCount = match ? match[1] : "1";
                            lines[i] = `${currentCount}x ${e.target.value}`;
                            setEvents(lines.join("\n"));
                          }}
                          className="flex-1 p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white placeholder-gray-400"
                          placeholder="Event..."
                        />
                        <button
                          onClick={() => {
                            const lines = events.split("\n").filter(line => line.trim()).filter((_, idx) => idx !== i);
                            setEvents(lines.join("\n"));
                          }}
                          className="text-red-400 text-sm px-2"
                          aria-label={`Remove event ${i + 1}`}
                        >
                          X
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => {
                      const newEvent = "1x ";
                      setEvents(events ? events + "\n" + newEvent : newEvent);
                    }}
                    className="mt-2 bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Add Event
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Gold
                  </label>
                  <input
                    type="text"
                    value={startgold}
                    onChange={(e) => setStartgold(e.target.value)}
                    className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                    placeholder="Amount..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Gold
                  </label>
                  <input
                    type="text"
                    value={endgold}
                    onChange={(e) => setEndgold(e.target.value)}
                    className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                    placeholder="Amount..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gold Earned
                  </label>
                  <input
                    type="text"
                    value={gold}
                    onChange={(e) => setGold(e.target.value)}
                    className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                    placeholder="Amount..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Doubloons
                  </label>
                  <input
                    type="text"
                    value={doubloons}
                    onChange={(e) => setDoubloons(e.target.value)}
                    className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                    placeholder="Amount..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ancient Coins
                  </label>
                  <input
                    type="text"
                    value={ancientCoins}
                    onChange={(e) => setAncientCoins(e.target.value)}
                    className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                    placeholder="Amount..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fish Caught
                  </label>
                  <input
                    type="text"
                    value={fishCaught}
                    onChange={(e) => setFishCaught(e.target.value)}
                    className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                    placeholder="Amount..."
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Team
                </label>
                <select
                  value={ourTeam}
                  onChange={(e) => {
                    const newTeam = e.target.value as "Athena" | "Reaper";
                    setOurTeam(newTeam);
                    // Update all existing dives to use the new team
                    dives.forEach((_, index) => {
                      updateDive(index, { ourTeam: newTeam });
                    });
                  }}
                  className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                >
                  <option value="Athena">Athena</option>
                  <option value="Reaper">Reaper</option>
                </select>
              </div>
              {mode === "skirmish" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Skirmish Dives</label>
                  <div className="space-y-3">
                    {dives.map((dive, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <img
                            src={getPublicPath(`${dive.ourTeam.toLowerCase()}.webp`)}
                            alt={dive.ourTeam}
                            className="w-6 h-6"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              if (!img.dataset.attempt) {
                                img.dataset.attempt = "1";
                                img.src = `${dive.ourTeam.toLowerCase()}.webp`;
                              } else if (img.dataset.attempt === "1") {
                                img.dataset.attempt = "2";
                                img.src = `/${dive.ourTeam.toLowerCase()}.webp`;
                              }
                            }}
                          />
                          <select
                            value={dive.ourTeam}
                            onChange={(e) =>
                              updateDive(i, { ourTeam: e.target.value as "Athena" | "Reaper" })
                            }
                            className="flex-1 p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                          >
                            <option value="Athena">Athena</option>
                            <option value="Reaper">Reaper</option>
                          </select>
                          <span className="text-white">vs</span>
                          <img
                            src={getPublicPath(`${dive.enemyTeam.toLowerCase()}.webp`)}
                            alt={dive.enemyTeam}
                            className="w-6 h-6"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              if (!img.dataset.attempt) {
                                img.dataset.attempt = "1";
                                img.src = `${dive.enemyTeam.toLowerCase()}.webp`;
                              } else if (img.dataset.attempt === "1") {
                                img.dataset.attempt = "2";
                                img.src = `/${dive.enemyTeam.toLowerCase()}.webp`;
                              }
                            }}
                          />
                          <select
                            value={dive.enemyTeam}
                            onChange={(e) =>
                              updateDive(i, { enemyTeam: e.target.value as "Athena" | "Reaper" })
                            }
                            className="flex-1 p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                          >
                            <option value="Athena">Athena</option>
                            <option value="Reaper">Reaper</option>
                          </select>
                          <select
                            value={dive.outcome}
                            onChange={(e) =>
                              updateDive(i, { outcome: e.target.value as "win" | "loss" })
                            }
                            className="flex-1 p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                          >
                            <option value="win">Win</option>
                            <option value="loss">Loss</option>
                          </select>
                          <button
                            onClick={() => removeDive(i)}
                            className="text-red-400 text-sm px-2"
                            aria-label={`Remove dive ${i + 1}`}
                          >
                            X
                          </button>
                        </div>
                        <input
                          type="text"
                          value={dive.notes}
                          onChange={(e) => updateDive(i, { notes: e.target.value })}
                          className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                          placeholder="Notes (optional)"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addNewDive}
                      className="mt-2 bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Add Dive
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Log Entry</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white h-32"
              placeholder="Write your log entry..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Host</label>
            <select
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full p-2 h-10 bg-[#3a3a3a] rounded border border-gray-600 text-white"
            >
              <option value="" disabled style={{ color: "#888" }}>Select Host</option>
              {crewEntries.filter(c => c.name && c.name.trim() !== "").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.rank || "No Rank"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
              placeholder="Enter tagline..."
            />
          </div>

          <div className="grid grid-cols-4 md:grid-cols-4 grid-cols-2 gap-4">
            <button
              onClick={() => {
                resetState();
                setCrewEntries([
                  { id: String(Date.now()), name: "", discord: "", rank: "", role: "", isRep: false },
                  { id: String(Date.now() + 1), name: "", discord: "", rank: "", role: "", isRep: false },
                ]);
              }}
              className="w-full hover:opacity-90 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              style={{ backgroundColor: '#c0392b' }}
            >
              <RotateCcw size={20} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button 
              onClick={() => setIsCopyModalOpen(true)} 
              className="w-full hover:opacity-90 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              style={{ backgroundColor: '#5865F2' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
              </svg>
              <span className="hidden sm:inline">Copy Discord</span>
            </button>
            <button
              onClick={async () => {
                const html2canvas = (await import("html2canvas")).default;

                const getOrdinal = (v: string) => {
                  if (v === "" || v == null) return "";
                  const n = Number(v);
                  if (!Number.isFinite(n)) return v;
                  const rem100 = n % 100;
                  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
                  const rem10 = n % 10;
                  if (rem10 === 1) return `${n}st`;
                  if (rem10 === 2) return `${n}nd`;
                  if (rem10 === 3) return `${n}rd`;
                  return `${n}th`;
                };

                // Find all preview pages from the export overlay
                const exportContainer = document.getElementById('export-preview-overlay');
                if (!exportContainer) {
                  alert("No preview found");
                  return;
                }

                const sourcePages = Array.from(exportContainer.querySelectorAll('.preview-page'));
                if (sourcePages.length === 0) {
                  alert("No preview found");
                  return;
                }

                const voyageText = voyageNumber ? getOrdinal(voyageNumber) : "nth";
                let exported = 0;

                for (let i = 0; i < sourcePages.length; i++) {
                  // Clone the page into a temporary standalone container
                  const clone = sourcePages[i].cloneNode(true) as HTMLElement;
                  const wrapper = document.createElement('div');
                  wrapper.style.position = 'fixed';
                  wrapper.style.top = '0';
                  wrapper.style.left = '0';
                  wrapper.style.width = '816px';
                  wrapper.style.height = '1190px';
                  wrapper.style.zIndex = '99999';
                  wrapper.style.overflow = 'hidden';
                  // Visible but non-interactive during capture
                  wrapper.style.pointerEvents = 'none';
                  wrapper.appendChild(clone);
                  document.body.appendChild(wrapper);

                  // Let the browser paint the clone
                  await new Promise((r) => setTimeout(r, 300));

                  try {
                    const canvas = await html2canvas(clone, {
                      scale: 2,
                      useCORS: true,
                      allowTaint: true,
                      width: 816,
                      height: 1190,
                      windowWidth: 816,
                      windowHeight: 1190,
                      x: 0,
                      y: 0,
                      scrollX: 0,
                      scrollY: 0,
                    });

                    const imgData = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.download = sourcePages.length > 1
                      ? `USS ${selectedShip} - ${voyageText} Voyage Log - Page ${exported + 1}.png`
                      : `USS ${selectedShip} - ${voyageText} Voyage Log.png`;
                    link.href = imgData;
                    link.click();
                    exported++;

                    // Delay between downloads to avoid browser throttling
                    await new Promise((r) => setTimeout(r, 400));
                  } finally {
                    // Always clean up
                    document.body.removeChild(wrapper);
                  }
                }

                if (exported === 0) alert("No pages to export");
              }}
              className="w-full hover:opacity-90 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              style={{ backgroundColor: '#27ae60' }}
            >
              <Image size={20} />
              <span className="hidden sm:inline">Generate Image</span>
            </button>
            <button
              onClick={async () => {
                const html2canvas = (await import("html2canvas")).default;
                const { jsPDF } = await import("jspdf");

                const getOrdinal = (v: string) => {
                  if (v === "" || v == null) return "";
                  const n = Number(v);
                  if (!Number.isFinite(n)) return v;
                  const rem100 = n % 100;
                  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
                  const rem10 = n % 10;
                  if (rem10 === 1) return `${n}st`;
                  if (rem10 === 2) return `${n}nd`;
                  if (rem10 === 3) return `${n}rd`;
                  return `${n}th`;
                };

                const exportContainer = document.getElementById('export-preview-overlay');
                if (!exportContainer) {
                  alert("No preview found");
                  return;
                }

                const sourcePages = Array.from(exportContainer.querySelectorAll('.preview-page'));
                if (sourcePages.length === 0) {
                  alert("No preview found");
                  return;
                }

                const pdf = new jsPDF({
                  orientation: "portrait",
                  unit: "mm",
                  format: "a4",
                });

                let added = 0;
                for (let i = 0; i < sourcePages.length; i++) {
                  const clone = sourcePages[i].cloneNode(true) as HTMLElement;
                  const wrapper = document.createElement('div');
                  wrapper.style.position = 'fixed';
                  wrapper.style.top = '0';
                  wrapper.style.left = '0';
                  wrapper.style.width = '816px';
                  wrapper.style.height = '1190px';
                  wrapper.style.zIndex = '99999';
                  wrapper.style.overflow = 'hidden';
                  wrapper.style.pointerEvents = 'none';
                  wrapper.appendChild(clone);
                  document.body.appendChild(wrapper);

                  await new Promise((r) => setTimeout(r, 300));

                  try {
                    const canvas = await html2canvas(clone, {
                      scale: 2,
                      useCORS: true,
                      allowTaint: true,
                      width: 816,
                      height: 1190,
                      windowWidth: 816,
                      windowHeight: 1190,
                      x: 0,
                      y: 0,
                      scrollX: 0,
                      scrollY: 0,
                    });

                    const imgData = canvas.toDataURL("image/png");
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgWidth = pageWidth;
                    const imgHeight = (canvas.height * pageWidth) / canvas.width;
                    if (added > 0) pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                    added++;
                  } finally {
                    document.body.removeChild(wrapper);
                  }
                }

                if (added === 0) {
                  alert("No pages to export");
                  return;
                }

                const voyageText = voyageNumber ? getOrdinal(voyageNumber) : "nth";
                const filename = `USS ${selectedShip} - ${voyageText} Voyage Log.pdf`;
                pdf.save(filename);
              }}
              className="w-full hover:opacity-90 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              style={{ backgroundColor: '#e74c3c' }}
            >
              <FileText size={20} />
              <span className="hidden sm:inline">Generate PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
