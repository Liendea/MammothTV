"use client";

import { motion } from "framer-motion";
import StaffCard from "./card/StaffCard";
import { useStaffData } from "@/hooks/useStaffData";
import { useUpdateStaffArray } from "@/hooks/useUpdateStaffArray";
import LoadingSpinner from "../LoadingSpinner";
import { useCardExpansion } from "@/hooks/useCardExpansion";

export default function StaffSection() {
  const { staff, loading, error } = useStaffData(60000);
  const { visibleStaff } = useUpdateStaffArray(staff);
  const { expandedCardId, observeCard } = useCardExpansion();

  const showProgress = process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true";

  const cardHeight = 170;
  const gap = 16;
  const totalHeight = visibleStaff.length * (cardHeight + gap);

  const duration = 30;
  // Bestäm hastighet (pixlar per sekund)
  const pxPerSecond = totalHeight / duration; // Samma som innan

  // Track 1 distans och duration
  const track1Distance = totalHeight + cardHeight;
  const track1Duration = track1Distance / pxPerSecond;

  // Track 2 distans och duration

  const track2Distance = totalHeight; // = 2*totalHeight
  const track2Duration = track2Distance / pxPerSecond;

  // DEBUG
  console.log({
    totalHeight,
    pxPerSecond,
    track1Distance,
    track1Duration,
    track2Distance,
    track2Duration,
    duration,
  });

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <section className="staffSection">
        <div className="error">
          <p>{error}</p>
          <p>Failed to fetch team members</p>
        </div>
      </section>
    );

  return (
    <section className="staffSection">
      {/* ----- TRACK 1  ----- */}
      <motion.div
        className="marque-track track-1"
        style={{
          pointerEvents: "none",
          marginTop: `-140.25px`, // ← CSS flyttar den upp
        }}
        initial={{ y: 0 }} // ← Nu fungerar y: 0 relativt till margin-position
        animate={{ y: -totalHeight }}
        transition={{
          duration: track1Duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {visibleStaff.map((user, index) => {
          const cardId = `1-${user.id}-${index}`;
          const isExpanded = expandedCardId === cardId; // EXPANSION STYRDS ENDAST AV HOOK
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

      {/* ----- TRACK 2  ----- */}
      <motion.div
        className="marque-track track-2"
        style={{
          marginTop: "0", // ← CSS
        }}
        initial={{ y: 0 }}
        animate={{ y: -totalHeight }}
        transition={{
          duration: track1Duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {visibleStaff.map((user, index) => {
          const cardId = `2-${user.id}-${index}`;
          const isExpanded = expandedCardId === cardId; // EXPANSION STYRDS ENDAST AV HOOK
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
    </section>
  );
}
