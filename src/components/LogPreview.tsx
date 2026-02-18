import React from "react";
import { useLog } from "../context/LogContext";
import { getPublicPath } from "../utils/getPublicPath";

export const LogPreview: React.FC = () => {
  const {
  selectedShip,
    title,
    signature,
    subtitle,
    mode,
    events,
  titleFont,
  bodyFont,
    parchment,
    frame,
    crew,
    gold,
    doubloons,
    ancientCoins,
    fishCaught,
    dives,
    formatList,
    body,
    voyageNumber,
  } = useLog();

  // Helper to get parchment filename
  const getParchmentFile = (num: number) => {
    return num === 1 ? "parchment.png" : `parchment${num}.png`;
  };

  // Helper to get frame filename
  const getFrameFile = (num: number) => {
    return num === 0 ? null : `frame${num}.png`;
  };

  // Get background image URL - try getPublicPath first, fallback to relative
  const getBackgroundUrl = () => {
    const filename = getParchmentFile(parchment);
    // During dev, Vite serves from root; in prod, from base path
    try {
      return getPublicPath(filename);
    } catch {
      return filename;
    }
  };

  // Get frame image URL
  const getFrameUrl = () => {
    const filename = getFrameFile(frame);
    if (!filename) return null;
    try {
      return getPublicPath(filename);
    } catch {
      return filename;
    }
  };

  // Parse crew JSON from context
  let crewList: { id?: string; name: string; discord: string; rank: string; role: string; isRep?: boolean }[] = [];
  try {
    crewList = JSON.parse(crew || "[]");
  } catch {
    crewList = [];
  }

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

  crewList = crewList.filter((c) => c.name && c.rank).sort((a, b) => {
    const aIdx = rankOrder.indexOf(a.rank);
    const bIdx = rankOrder.indexOf(b.rank);
    return bIdx - aIdx;
  });

  // Cache-bust version - increment when ship logos are updated
  const shipLogoVersion = "v2";

  const shipLogos: Record<string, string> = {
    Gullinbursti: getPublicPath("ships/gullinbursti.png") + `?${shipLogoVersion}`,
    Jormungandr: getPublicPath("ships/jormungandr.png") + `?${shipLogoVersion}`,
    Freyr: getPublicPath("ships/freyr.png") + `?${shipLogoVersion}`,
    Gjallarhorn: getPublicPath("ships/gjallarhorn.png") + `?${shipLogoVersion}`,
    Odin: getPublicPath("ships/odin.png") + `?${shipLogoVersion}`,
    Skadi: getPublicPath("ships/skadi.png") + `?${shipLogoVersion}`,
    Nott: getPublicPath("ships/nott.png") + `?${shipLogoVersion}`,
    Hodr: getPublicPath("ships/hodr.png") + `?${shipLogoVersion}`,
    Audacious: getPublicPath("ships/audacious.png") + `?${shipLogoVersion}`,
    Berserker: getPublicPath("ships/berserker.png") + `?${shipLogoVersion}`,
    Bestla: getPublicPath("ships/bestla.png") + `?${shipLogoVersion}`,
    Ragnarok: getPublicPath("ships/ragnarok.png") + `?${shipLogoVersion}`,
    Thor: getPublicPath("ships/thor.png") + `?${shipLogoVersion}`,
    Titan: getPublicPath("ships/titan.png") + `?${shipLogoVersion}`,
    Tyr: getPublicPath("ships/tyr.png") + `?${shipLogoVersion}`,
    Valhalla: getPublicPath("ships/valhalla.png") + `?${shipLogoVersion}`,
  };

  const shipMottos: Record<string, string> = {
    Gullinbursti: "Charging Forth, Radiant & Unyielding",
    Jormungandr: "Charging Forth, Radiant & Unyielding",
    Freyr: "Charging Forth, Radiant & Unyielding",
    Gjallarhorn: "Charging Forth, Radiant & Unyielding",
    Odin: "Charging Forth, Radiant & Unyielding",
    Skadi: "Charging Forth, Radiant & Unyielding",
    Nott: "Charging Forth, Radiant & Unyielding",
    Hodr: "Charging Forth, Radiant & Unyielding",
    Audacious: "Charging Forth, Radiant & Unyielding",
    Berserker: "Charging Forth, Radiant & Unyielding",
    Bestla: "Charging Forth, Radiant & Unyielding",
    Ragnarok: "Charging Forth, Radiant & Unyielding",
    Thor: "Charging Forth, Radiant & Unyielding",
    Titan: "Charging Forth, Radiant & Unyielding",
    Tyr: "Charging Forth, Radiant & Unyielding",
    Valhalla: "Charging Forth, Radiant & Unyielding",
  };


  // Measurement-based page splitting for entry log
  const splitTextIntoPages = (text: string) => {
    if (!text) return [""];

    // Create or update the hidden measuring div
    let measureDiv = document.getElementById("log-measure-div") as HTMLDivElement | null;
    if (!measureDiv) {
      measureDiv = document.createElement("div");
      measureDiv.id = "log-measure-div";
      measureDiv.style.position = "absolute";
      measureDiv.style.left = "-9999px";
      measureDiv.style.top = "0";
      measureDiv.style.visibility = "hidden";
      document.body.appendChild(measureDiv);
    }
    // Always sync styles in case font changed
    measureDiv.style.width = "816px";
    measureDiv.style.padding = "64px"; // p-16
    measureDiv.style.fontFamily = `'${bodyFont}', cursive`;
    measureDiv.style.fontSize = "30px";
    measureDiv.style.lineHeight = "1.4";
    measureDiv.style.whiteSpace = "pre-wrap";
    measureDiv.style.overflowWrap = "break-word";
    measureDiv.style.wordBreak = "break-word";

    // Available height for text (page height minus padding, title, etc)
    const PAGE_HEIGHT = 1190;
    const PAGE_PADDING = 64 * 2; // p-16 top+bottom
    const FOOTER_HEIGHT = 50; // reserved footer space at bottom
    const TITLE_HEIGHT = 120 + 48 + 32; // estimate for title, margin, etc (tune as needed)
    const BODY_HEIGHT = PAGE_HEIGHT - PAGE_PADDING - FOOTER_HEIGHT;
    const FIRST_BODY_HEIGHT = BODY_HEIGHT - TITLE_HEIGHT;

    // Normalize line endings and split into paragraphs by blank lines
    const normalized = text.replace(/\r\n/g, "\n");
    const paragraphs = normalized.split(/\n{2,}/);

    // Build a flat list of tokens: words and paragraph-break markers
    const tokens: string[] = [];
    for (let p = 0; p < paragraphs.length; p++) {
      const para = paragraphs[p].trim();
      if (!para) continue;
      const words = para.split(/(\s+)/).filter(w => w.trim().length > 0);
      for (const word of words) {
        tokens.push(word);
      }
      // Add paragraph break marker between paragraphs (not after the last)
      if (p < paragraphs.length - 1) {
        tokens.push("\n\n");
      }
    }

    if (tokens.length === 0) return [""];

    const measureHeight = (content: string) => {
      measureDiv!.innerText = content;
      return measureDiv!.offsetHeight;
    };

    const pages: string[] = [];
    let current = "";
    let isFirstPage = true;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Paragraph break: just append to current text
      if (token === "\n\n") {
        current += "\n\n";
        continue;
      }

      // Build tentative text with this word added
      const separator = current.length === 0 || current.endsWith("\n\n") ? "" : " ";
      const tentative = current + separator + token;

      const maxHeight = isFirstPage ? FIRST_BODY_HEIGHT : BODY_HEIGHT;
      const height = measureHeight(tentative);

      if (height > maxHeight && current.trim().length > 0) {
        // Current page is full — push it and start a new page with this word
        pages.push(current.trim());
        current = token;
        isFirstPage = false;
      } else {
        current = tentative;
      }
    }

    if (current.trim().length > 0) pages.push(current.trim());

    // Clean up
    measureDiv.innerText = "";
    return pages.length > 0 ? pages : [""];
    return pages.length > 0 ? pages : [""];
  };

  const bodyPages = splitTextIntoPages(body || "");

  // Helper to format numeric loot values with thousands separators
  const formatNumber = (v?: string) => {
    if (v == null || v === "") return "0";
    // Remove non-numeric characters except dot and minus
    const numeric = String(v).replace(/[^0-9.-]/g, "");
    const n = Number(numeric);
    if (!Number.isFinite(n)) return v;
    return n.toLocaleString();
  };

  // Calculate pages reserved for the final summary (events/crew/loot/signature)
  // Patrol: 1 summary page. Skirmish: enough pages to hold all dives (12 per page)
  const divesPerSummaryPage = 12;
  const summaryPages = mode === "skirmish" ? Math.max(1, Math.ceil(dives.length / divesPerSummaryPage)) : 1;
  const totalPages = bodyPages.length + summaryPages;

  const getOrdinal = (v: string) => {
    if (!v) return "";
    const n = Number(v);
    if (!Number.isFinite(n)) return v;
    // Special case: 1st voyage is "Maiden"
    if (n === 1) return "Maiden";
    const rem100 = n % 100;
    if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
    const rem10 = n % 10;
    if (rem10 === 1) return `${n}st`;
    if (rem10 === 2) return `${n}nd`;
    if (rem10 === 3) return `${n}rd`;
    return `${n}th`;
  };

  const renderPage = (pageIndex = 0) => {
    const isBodyPage = pageIndex < bodyPages.length;
    const currentBody = isBodyPage ? bodyPages[pageIndex] : "";
    const isFirstPage = pageIndex === 0;
    const isLastBodyPage = pageIndex === bodyPages.length - 1;
    
    // For summary pages (pages after the body pages), determine dives/manifest/signature
    let divesToShow: typeof dives = [];
    let showCrewManifest = false;
    let showSignature = false;

    if (!isBodyPage) {
      const summaryPageIndex = pageIndex - bodyPages.length;
      const startIdx = summaryPageIndex * divesPerSummaryPage;
      const endIdx = startIdx + divesPerSummaryPage;
      divesToShow = dives.slice(startIdx, endIdx);
      // Only display crew manifest, events, loot and signature on the very last summary page
      showCrewManifest = pageIndex === totalPages - 1;
      showSignature = pageIndex === totalPages - 1;
    }

    const displayTitle = voyageNumber && selectedShip
      ? `${getOrdinal(voyageNumber)} Voyage Log of the USS ${selectedShip}`
      : title || "Log Title";

    return (
      <div
        className="rounded-lg mb-8 preview-page"
        style={{
          width: 816,
          height: 1190,
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          position: "relative",
          backgroundImage: `url(${getBackgroundUrl()})`,
          backgroundSize: "cover",
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        {/* Frame overlay - positioned above parchment but below content */}
        {frame > 0 && getFrameUrl() && (
          <img
            src={getFrameUrl()!}
            alt="Frame"
            crossOrigin="anonymous"
            className="absolute pointer-events-none"
            style={{ 
              top: 0,
              left: 5,
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              zIndex: 1
            }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!img.dataset.attempt) {
                img.dataset.attempt = "1";
                img.src = `frame${frame}.png`;
              }
            }}
          />
        )}
        
        <img
          src={shipLogos[selectedShip]}
          onError={(e) => { 
            const img = e.currentTarget as HTMLImageElement;
            if (!img.dataset.attempt) {
              img.dataset.attempt = "1";
              img.src = getPublicPath("ships/gullinbursti.png");
            } else if (img.dataset.attempt === "1") {
              img.dataset.attempt = "2";
              img.src = "ships/gullinbursti.png";
            }
          }}
          alt="Ship Logo"
          crossOrigin="anonymous"
          className="absolute inset-0 m-auto"
          style={{ width: "50%", height: "auto", opacity: 0.20, zIndex: 0 }}
        />

        <div id="writing-area" className={`p-16 h-full flex flex-col relative z-10 ${!isFirstPage ? "pt-16" : ""}`} style={{ paddingBottom: '114px' }}>
          {isFirstPage && (
            <h2
              className="text-6xl text-center ml-16 mr-16 mt-12 mb-8 whitespace-pre-wrap"
              style={{ fontFamily: `'${titleFont}', cursive`, fontWeight: 700, color: '#262626', lineHeight: '1.3' }}
            >
              {displayTitle}
            </h2>
          )}

          {isBodyPage && (
            <div
              className="text-base whitespace-pre-wrap p-2"
              style={{ 
                fontFamily: `'${bodyFont}', cursive`, 
                fontSize: '30px', 
                color: '#262626',
                lineHeight: '1.4',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {currentBody || "Your log entry will appear here..."}
            </div>
          )}

          {!isBodyPage && mode === "patrol" && (
            <>
              <div className="grid grid-cols-2 gap-6 ml-2 mt-8 flex-shrink-0">
                <div>
                  <h3 className="text-3xl mb-2" style={{ fontFamily: `'${titleFont}', cursive`, fontWeight: 700, color: '#262626' }}>Notable Events</h3>
                  <ul className="list-none text-xl" style={{ fontFamily: `'${bodyFont}', cursive`, columns: 1, columnGap: "1rem", breakInside: "avoid-column", color: '#262626' }}>
                    {formatList(events).map((ev, i) => (
                      <li key={i} style={{ breakInside: "avoid-column" }}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-3xl mb-2" style={{ fontFamily: `'${titleFont}', cursive`, fontWeight: 700, color: '#262626' }}>Crew Manifest</h3>
                    <ul className="list-none text-xl space-y-1" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>
                    {crewList.length === 0 && <li>No crew assigned</li>}
                    {crewList.map((c) => {
                      const repTag = c.isRep ? " [REP]" : "";
                      return (
                          <div key={c.name} className="mb-1">
                            <span className="font-semibold">{c.rank} {c.name}{repTag}</span>
                            <span className="ml-1 italic"> - {c.role}</span>
                        </div>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-end mt-auto pt-8 flex-shrink-0">
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={getPublicPath("gold.webp")} 
                      alt="Gold" 
                      crossOrigin="anonymous" 
                      className="w-8 h-8"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.dataset.attempt) {
                          img.dataset.attempt = "1";
                          img.src = "gold.webp";
                        }
                      }}
                    />
                      <span className="text-3xl" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>{formatNumber(gold)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img 
                      src={getPublicPath("doubloon.webp")} 
                      alt="Doubloons" 
                      crossOrigin="anonymous" 
                      className="w-8 h-8"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.dataset.attempt) {
                          img.dataset.attempt = "1";
                          img.src = "doubloon.webp";
                        }
                      }}
                    />
                    <span className="text-3xl" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>{formatNumber(doubloons)}</span>
                  </div>

                  {ancientCoins && parseInt(ancientCoins) > 0 && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={getPublicPath("ANCI.webp")} 
                        alt="Ancient Coins" 
                        crossOrigin="anonymous" 
                        className="w-8 h-8"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          if (!img.dataset.attempt) {
                            img.dataset.attempt = "1";
                            img.src = "ANCI.webp";
                          }
                        }}
                      />
                      <span className="text-3xl" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>{formatNumber(ancientCoins)}</span>
                    </div>
                  )}

                  {fishCaught && parseInt(fishCaught) > 0 && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={getPublicPath("FISH.webp")} 
                        alt="Fish" 
                        crossOrigin="anonymous" 
                        className="w-8 h-8"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          if (!img.dataset.attempt) {
                            img.dataset.attempt = "1";
                            img.src = "FISH.webp";
                          }
                        }}
                      />
                      <span className="text-3xl" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>{formatNumber(fishCaught)}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-right">
                  {signature && (() => {
                    try {
                      const list = JSON.parse(crew || "[]");
                      const hostCrew = list.find((c: any) => c.id === signature);
                      if (hostCrew) {
                        return (
                          <div>
                            <span className="text-5xl" style={{ fontFamily: `'${titleFont}', cursive`, fontWeight: 700, color: '#262626' }}>{hostCrew.rank} {hostCrew.name}</span>
                            {(subtitle || shipMottos[selectedShip]) && (
                              <div className="mt-2">
                                <span className="text-3xl" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>{subtitle || shipMottos[selectedShip]}</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                    } catch {
                      // ignore
                    }
                    return null;
                  })()}
                </div>
              </div>
            </>
          )}

          {mode === "skirmish" && (isLastBodyPage || !isBodyPage) && (divesToShow.length > 0 || showSignature) && (
            <div className="p-2 flex flex-col h-full">
              {divesToShow.length > 0 && (
                <div className={`gap-6 flex-shrink-0 ${showCrewManifest ? 'grid grid-cols-2' : ''}`}>
                  <div>
                    <h3 className="text-3xl mb-2" style={{ fontFamily: `'${titleFont}', cursive`, fontWeight: 700, color: '#262626' }}>Skirmish Dives</h3>
                    <div className="text-xl leading-relaxed p-2" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>
                      <div className="grid grid-cols-1">
                      {divesToShow.map((dive, i) => {
                        // Calculate the actual dive number across all summary pages
                        const summaryPageIndex = pageIndex - bodyPages.length;
                        const diveNumber = summaryPageIndex * divesPerSummaryPage + i + 1;
                        return (
                          <div key={i} className="mb-3">
                            <strong className="flex items-center gap-2">
                              <span>{diveNumber}.</span>
                            <img 
                              className="w-8 h-8" 
                              src={getPublicPath(`${dive.ourTeam.toLowerCase()}.webp`)} 
                              alt=""
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                if (!img.dataset.attempt) {
                                  img.dataset.attempt = "1";
                                  img.src = `${dive.ourTeam.toLowerCase()}.webp`;
                                }
                              }}
                            />
                            <span>{dive.ourTeam}</span>
                            <span>vs</span>
                            <span>{dive.enemyTeam}</span>
                            <img 
                              className="w-8 h-8" 
                              src={getPublicPath(`${dive.enemyTeam.toLowerCase()}.webp`)} 
                              alt=""
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                if (!img.dataset.attempt) {
                                  img.dataset.attempt = "1";
                                  img.src = `${dive.enemyTeam.toLowerCase()}.webp`;
                                }
                              }}
                            />
                            <span>({dive.outcome})</span>
                          </strong>
                          {dive.notes && <div className="ml-4 italic">{dive.notes}</div>}
                        </div>
                      );
                      })}
                    </div>
                  </div>
                </div>

                {showCrewManifest && (
                  <div>
                    <h3 className="text-3xl mb-2" style={{ fontFamily: `'${titleFont}', cursive`, fontWeight: 700, color: '#262626' }}>Crew Manifest</h3>
                      <ul className="list-none text-xl space-y-1" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>
                      {crewList.length === 0 && <li>No crew assigned</li>}
                      {crewList.map((c) => (
                          <div key={c.name} className="mb-1">
                            <span className="font-semibold">{c.rank} {c.name}{c.isRep ? ' [REP]' : ''}</span>
                            <span className="ml-1 italic"> - {c.role}</span>
                        </div>
                    ))}
                  </ul>
                </div>
                )}
              </div>
              )}

              {showSignature && (
                <div className="flex justify-end items-center mt-auto pt-8">
                  <div className="flex-1 text-right">
                  {signature && (() => {
                    try {
                      const list = JSON.parse(crew || "[]");
                      const hostCrew = list.find((c: any) => c.id === signature);
                      if (hostCrew) {
                        return (
                          <div>
                            <span className="text-5xl" style={{ fontFamily: `'${titleFont}', cursive`, fontWeight: 700, color: '#262626' }}>{hostCrew.rank} {hostCrew.name}</span>
                            {(subtitle || shipMottos[selectedShip]) && (
                              <div className="mt-2">
                                <span className="text-3xl" style={{ fontFamily: `'${bodyFont}', cursive`, color: '#262626' }}>{subtitle || shipMottos[selectedShip]}</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                    } catch {
                      // ignore
                    }
                    return null;
                  })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Page number */}
        {totalPages > 1 && (
          <div
            className="absolute"
            style={{
              bottom: '58px',
              right: '64px',
              fontFamily: `'${bodyFont}', cursive`,
              fontSize: '22px',
              fontWeight: 700,
              color: '#262626',
              opacity: 0.7,
              zIndex: 10,
            }}
          >
            {pageIndex + 1}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full md:w-1/2" data-testid="log-preview">
      {/* Mobile: Scaled to fit screen */}
      <div className="md:hidden">
        <div className="w-full overflow-x-auto">
          <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left' }}>
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex}>{renderPage(pageIndex)}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Desktop: Original size - Hidden on mobile but still rendered for exports */}
      <div className="hidden md:block">
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div key={pageIndex} id={pageIndex === 0 ? "visible-page" : undefined}>
            {renderPage(pageIndex)}
          </div>
        ))}
      </div>
      
      {/* Export-only: Full-size, off-screen, not interactive - positioned absolute to avoid viewport clipping */}
      <div id="export-preview-overlay" style={{ position: 'absolute', top: 0, left: '-9999px', pointerEvents: 'none', zIndex: -1 }}>
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div key={pageIndex}>
            {renderPage(pageIndex)}
          </div>
        ))}
      </div>
    </div>
  );
};
