import type { Staff } from "../../types/staff";
import ExpandedCard from "./ExpandedCard";
import SimpleCard from "./SimpleCard";
import { motion } from "framer-motion";

type StaffCardProps = {
  staff: Staff;
  isExpanded?: boolean;
  showProgress?: boolean;
  isActive: boolean;
};

export default function StaffCard({
  staff,
  isExpanded = false,
  isActive,
  showProgress,
}: StaffCardProps) {
  // Olika animationer för expanded vs simple
  const expandedAnimation = {
    initial: { opacity: 0, scale: 0.8, y: 0 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -100 },
  };

  const simpleAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, scale: 0.95, y: 0 },
    exit: { opacity: 1, y: -30 },
  };

  const currentAnimation = isExpanded ? expandedAnimation : simpleAnimation;

  return (
    <motion.div
      layout
      initial={currentAnimation.initial}
      animate={currentAnimation.animate}
      exit={currentAnimation.exit}
      transition={
        isExpanded
          ? { duration: 0.4, ease: "easeOut" }
          : { duration: 0.5, ease: "easeOut" }
      }
      style={{
        position: "relative",
        zIndex: isExpanded ? 10 : 1,
      }}
    >
      {isExpanded ? (
        <ExpandedCard
          staff={staff}
          showProgress={showProgress}
          isActive={isActive}
        />
      ) : (
        <SimpleCard staff={staff} isActive={isActive} />
      )}
    </motion.div>
  );
}
