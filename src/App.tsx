import { useState, useRef, useEffect } from "react";
import { SettingsModal } from "./components/SettingsModal";
import { CopyModal } from "./components/CopyModal";
import { Header } from "./components/Header";
import { LogPreview } from "./components/LogPreview";
import { Editor } from "./components/Editor";
import { LogProvider } from "./context/LogContext";

function App() {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const swipeLocked = useRef<boolean>(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) ||
                      !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
      setIsMobileDevice(isMobile);
    };
    
    checkMobileDevice();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't track swipes that originate on or inside interactive form elements
    const target = e.target as HTMLElement;
    if (
      target.closest('input, textarea, select, button, label, [contenteditable="true"]')
    ) {
      touchStartX.current = 0;
      touchEndX.current = 0;
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    swipeLocked.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === 0) return; // Ignore if started on a form element
    if (swipeLocked.current) return; // Already determined this isn't a horizontal swipe

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - touchStartX.current);
    const diffY = Math.abs(currentY - touchStartY.current);

    // If the user is scrolling vertically more than horizontally, lock out swipe detection
    if (diffY > diffX && diffY > 10) {
      swipeLocked.current = true;
      return;
    }

    touchEndX.current = currentX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === 0 || swipeLocked.current) {
      touchStartX.current = 0;
      touchEndX.current = 0;
      touchStartY.current = 0;
      swipeLocked.current = false;
      return;
    }
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 80; // Minimum distance for a swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left - go to preview
        setActiveTab("preview");
      } else {
        // Swiped right - go to editor
        setActiveTab("editor");
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
    touchStartY.current = 0;
    swipeLocked.current = false;
  };

  // Show mobile layout only on mobile devices
  const showMobileLayout = isMobileDevice;

  return (
    <LogProvider>
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <div role="banner">
          <Header 
            mobileMode={showMobileLayout} 
            showMobileToggle={false}
          />
        </div>
        <SettingsModal data-testid="settings-modal" />
        <CopyModal data-testid="copy-modal" />

        {/* Show Mobile Layout (on mobile devices OR when mobile mode is enabled) */}
        {showMobileLayout ? (
          <>
            {/* Mobile Tab Navigation */}
            <div className="sticky top-0 z-20 bg-[#1a1a1a] border-b border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("editor")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === "editor"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === "preview"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Mobile Content - Fixed container to prevent overflow */}
            <main className="h-[calc(100vh-9rem)] overflow-hidden">
              <div 
                className="h-full flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: activeTab === "editor" ? "translateX(0)" : "translateX(-100vw)",
                  width: "200vw",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-screen h-full overflow-y-auto">
                  <div className="p-4">
                    <Editor data-testid="editor" />
                  </div>
                </div>
                <div className="w-screen h-full overflow-y-auto">
                  <div className="p-4">
                    <LogPreview data-testid="log-preview" />
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : (
          /* Desktop Layout */
          <>
            <main className="container mx-auto p-4">
              <div className="hidden md:flex gap-4">
                <Editor data-testid="editor" />
                <LogPreview data-testid="log-preview" />
              </div>
            </main>
          </>
        )}
      </div>
    </LogProvider>
  );
}

export default App;
