"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StaffCard from "./card/StaffCard";
import { useStaffData } from "@/hooks/useStaffData";
import { useUpdateStaffArray } from "@/hooks/useUpdateStaffArray";
import LoadingSpinner from "../LoadingSpinner";
import { useCardExpansion } from "@/hooks/useCardExpansion";

export default function StaffSection() {
  const { staff, loading: loadingStaffData, error } = useStaffData(60000);
  const { visibleStaff, loading: loadingUpdatedArray } =
    useUpdateStaffArray(staff);
  const { expandedCardId, observeCard } = useCardExpansion();

  const showProgress = process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true";

  const duration = 60;
  const cardHeight = 170;
  const gap = 0;
  const numberOfCards = visibleStaff.length;
  const totalHeight = cardHeight * (numberOfCards - 1) + 425 + gap;

  const isLoading = loadingStaffData || loadingUpdatedArray;

  // DEBUG: Hydration & client info
  const [isHydrated, setIsHydrated] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    origin: "SSR",
    userAgent: "Node.js",
  });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setDebugLogs((prev) => [...prev, msg]);
    console.log(msg);
  };

  useEffect(() => {
    setIsHydrated(true);
    setClientInfo({
      origin: typeof window !== "undefined" ? window.location.origin : "SSR",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "SSR",
    });
    addLog("Client hydration complete");
  }, []);

  useEffect(() => {
    addLog(
      `useStaffData: loading=${loadingStaffData}, staff.length=${staff.length}`
    );
  }, [loadingStaffData, staff.length]);

  useEffect(() => {
    addLog(
      `useUpdateStaffArray: loading=${loadingUpdatedArray}, visibleStaff.length=${visibleStaff.length}`
    );
  }, [loadingUpdatedArray, visibleStaff.length]);

  const debugEnvUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "not set";

  if (isLoading || error) {
    return (
      <div
        style={{
          color: "white",
          padding: "20px",
          fontSize: "14px",
          wordBreak: "break-all",
        }}
      >
        <p>
          <strong>Staff Debug Overlay:</strong>
        </p>
        <p style={{ color: isHydrated ? "lime" : "red" }}>
          Hydrated: {String(isHydrated)} {isHydrated ? "✓" : "✗ JS NOT RUNNING"}
        </p>
        <p>window.location.origin: {clientInfo.origin}</p>
        <p>User Agent: {clientInfo.userAgent}</p>
        <p>NEXT_PUBLIC_API_BASE_URL: {debugEnvUrl}</p>
        <p>Staff API loading: {String(loadingStaffData)}</p>
        <p>Array update loading: {String(loadingUpdatedArray)}</p>
        <p>Staff count: {staff.length}</p>
        <p>VisibleStaff count: {visibleStaff.length}</p>
        <p>Error: {error || "none"}</p>
        <div
          style={{
            borderTop: "1px solid white",
            marginTop: "10px",
            paddingTop: "10px",
          }}
        >
          <p>
            <strong>Event Logs:</strong>
          </p>
          {debugLogs.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
    );
  }

  return (
    <section className="staffSection">
      {/* Tracks with motion divs */}
      {[1, 2, 3].map((trackNum) => (
        <motion.div
          key={trackNum}
          className={`marque-track track-${trackNum}`}
          animate={{ y: [totalHeight, -totalHeight] }}
          transition={{
            duration: trackNum === 1 ? duration : 120,
            ease: "linear",
            repeat: Infinity,
            delay: trackNum === 3 ? 60 : 0,
          }}
          style={{ height: totalHeight }}
        >
          {visibleStaff.map((user, index) => {
            const cardId = `${trackNum}-${user.id}-${index}`;
            const isExpanded = expandedCardId === cardId;
            return (
              <StaffCard
                key={cardId}
                cardId={cardId}
                staff={user}
                isActive={user.isActive || false}
                showProgress={showProgress}
                isExpanded={isExpanded}
                onCardRef={observeCard}
              />
            );
          })}
        </motion.div>
      ))}
      {/* On-screen debug overlay for later inspection */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "40vh",
          overflowY: "auto",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          fontSize: "12px",
          padding: "8px",
          zIndex: 9999,
        }}
      >
        <p>
          <strong>Live Debug Logs:</strong>
        </p>
        {debugLogs.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    </section>
  );
}
