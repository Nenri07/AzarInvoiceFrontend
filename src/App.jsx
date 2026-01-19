"use client";

import { useState, useEffect } from "react";
import { Sidebar, Header } from "./components";
import { Outlet } from "react-router-dom";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Open on desktop, closed on mobile
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Position */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />

      {/* Main Content Area - WITH PROPER MARGIN */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isMobile
            ? "ml-0" // No margin on mobile
            : sidebarOpen
              ? "ml-64" // 256px margin when sidebar is open
              : "ml-20" // 80px margin when sidebar is collapsed
        }`}
      >
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
