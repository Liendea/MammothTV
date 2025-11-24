"use client";

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
  const gap = 24;
  const numberOfCards = visibleStaff.length;
  //const totalHeight = 1609; // Justera denna höjd baserat på din design
  const totalHeight = cardHeight * (numberOfCards - 1) + 420 + gap;
  //const totalHeight = (cardHeight + gap) * numberOfCards;

  console.log(visibleStaff.length, totalHeight);

  const isLoading = loadingStaffData || loadingUpdatedArray;

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
      {/* ----- TRACK 1  ----- */}
      <motion.div
        className="marque-track track-1"
        initial={{ y: 0 }}
        animate={{ y: -totalHeight }} // rullar upp helt en gång
        transition={{
          duration,
          ease: "linear",
        }}
        style={{ height: totalHeight }}
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
        style={{ height: totalHeight }}
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
        style={{ height: totalHeight }}
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
