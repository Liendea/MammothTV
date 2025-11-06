"use client";

import { motion } from "framer-motion";
import StaffCard from "./card/StaffCard";
import { useStaffData } from "@/hooks/useStaffData";
import { useRotation } from "@/hooks/useRotation";
import LoadingSpinner from "../LoadingSpinner";
import { useCardExpansion } from "@/hooks/useCardExpansion";

export default function StaffSection() {
  const { staff, loading, error } = useStaffData(60000);
  const { visibleStaff, animationConfig } = useRotation(staff);
  const { expandedCardId, observeCard } = useCardExpansion();

  const showProgress = process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true";

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
      {/* Infinite scrolling cards */}
      <motion.div
        className="staffCardContainer"
        animate={{
          y: [0, animationConfig.totalHeight], // creates upward motion
        }}
        transition={{
          duration: animationConfig.duration * 2, // Speed on upward motion
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {visibleStaff.map((user, index) => {
          const cardId = `${user.id}-${index}`;
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
              index={index}
            />
          );
        })}
      </motion.div>
    </section>
  );
}
