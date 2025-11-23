"use client";

import { motion } from "framer-motion";
import StaffCard from "./card/StaffCard";
import { useStaffData } from "@/hooks/useStaffData";
import { useUpdateStaffArray } from "@/hooks/useUpdateStaffArray";
import LoadingSpinner from "../LoadingSpinner";
import { useCardExpansion } from "@/hooks/useCardExpansion";

export default function StaffSection() {
  const { staff, loading, error } = useStaffData(60000);
  const { visibleStaff, loading: updateLoading } = useUpdateStaffArray(staff);
  const { expandedCardId, observeCard } = useCardExpansion();

  // Loading status
  const isLoading = loading || updateLoading;

  const showProgress = process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true";

  // ANIMATION CONFIG
  const cardHeight = 170;
  const gap = 40;
  const duration = 40;
  const totalHeight = visibleStaff.length * (cardHeight + gap);
  const pxPerSecond = totalHeight / duration;
  const trackDuration = totalHeight / pxPerSecond;
  const trackDistance = 2 * totalHeight;

  if (isLoading) return <LoadingSpinner />;

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
      <motion.div
        className="marque-track"
        style={{
          pointerEvents: "none",
        }}
        initial={{ y: 0 }}
        animate={{ y: -trackDistance / 2 }}
        transition={{
          duration: trackDuration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {/* ----- TRACK 1  ----- */}
        {visibleStaff.map((user, index) => {
          const cardId = `1-${user.id}-${index}`;
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
        {/* ----- TRACK 2  ----- */}
        {visibleStaff.map((user, index) => {
          const cardId = `2-${user.id}-${index}`;
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
    </section>
  );
}
