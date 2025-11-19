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

  const duration = 60;
  const totalHeight = 1704; // Justera denna höjd baserat på din design
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
          pointerEvents: "none", // gör den “icke-blockerande”
        }}
        initial={{ y: 0 }}
        animate={{ y: -totalHeight }} // rullar upp helt en gång
        transition={{
          duration,
          ease: "linear",
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
        animate={{ y: [totalHeight, -totalHeight] }}
        transition={{
          duration: 120,
          ease: "linear",
          repeat: Infinity,
          delay: 0,
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

      {/* ----- TRACK 3  ----- */}

      <motion.div
        className="marque-track track-3"
        animate={{ y: [totalHeight, -totalHeight] }}
        transition={{
          duration: 120,
          ease: "linear",
          repeat: Infinity,
          delay: 60,
        }}
      >
        {visibleStaff.map((user, index) => {
          const cardId = `3-${user.id}-${index}`;
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
