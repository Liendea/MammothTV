import type { Staff } from "@/types/staff";
import { Avatar } from "../card-details/Avatar";
import { AnimatePresence, motion } from "framer-motion";
import { EmployeeInfo } from "../card-details/EmployeeInfo";
import { FunFactSection } from "../card-details/FunFactSection";
import { ProjectDetails } from "../card-details/ProjectDetails";
import { ProgressSection } from "../card-details/ProgressSection";

type StaffCardProps = {
  staff: Staff;
  showProgress?: boolean;
  isActive: boolean;
  index: number;
};

export default function StaffCard({
  staff,
  isActive,
  showProgress,
  index,
}: StaffCardProps) {
  const isTopCard = index === 0; // översta kortet, flyttas ut
  const isExpandedCard = index === 1; // andra kortet, flyttas upp och expanderar
  const isLowerCard = index > 1; // övriga kort, statiska

  return (
    <motion.div
      layoutId={`staff-${staff.id}`}
      layout
      className={`card ${isExpandedCard ? "card-expanded" : "card-simple"}`}
      style={{
        originY: 0.5,
        originX: 0.5,
      }}
      initial={
        isTopCard
          ? { y: -200, opacity: 1 }
          : isExpandedCard
            ? { y: -140, opacity: 0, scale: 1 }
            : { y: 0, opacity: 1, scale: 1 }
      }
      animate={
        isTopCard
          ? {
              y: -300,
              opacity: 0,
              scale: 1,
              transition: {
                duration: 1,
                ease: "easeInOut",
                delay: 0.5,
              },
            }
          : isExpandedCard
            ? {
                y: -180,
                opacity: 1,
                scale: [1],
                transition: {
                  duration: 1,
                  ease: "easeOut",
                  delay: 0.6,
                },
              }
            : isLowerCard
              ? {
                  y: -150,
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, ease: "easeInOut" },
                }
              : {}
      }
      exit={
        isTopCard
          ? {
              y: -400,
              opacity: 0,
              transition: { duration: 0.6, ease: "easeIn" },
            }
          : undefined
      }
    >
      {/* Header */}
      <div className="card-header">
        <div className="avatar-wrapper">
          <Avatar
            image={staff.image}
            initials={staff.initials}
            name={staff.name}
            isActive={isActive}
          />
        </div>
        <div className="employee-info">
          <EmployeeInfo
            name={staff.name}
            role={staff.role}
            projectName={staff.current_project?.name}
            isExpanded={isExpandedCard}
          />
        </div>
      </div>

      {/* FunFact */}
      <AnimatePresence mode="wait">
        {isExpandedCard && !showProgress && (
          <motion.div
            className="fun-fact-area"
            key="funfact"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0.6, delay: 0.4 },
            }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
          >
            <FunFactSection funFact={staff.fun_fact} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ProjectDetails */}
      <AnimatePresence mode="wait">
        {isExpandedCard && (
          <motion.div
            className="project-details"
            key="projectdetails"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0, delay: 0 },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0, ease: "easeOut" },
            }}
          >
            <ProjectDetails project={staff.current_project} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <AnimatePresence mode="wait">
        {isExpandedCard && showProgress && (
          <motion.div
            className="time-tracking-area"
            key="progress"
            initial={{ opacity: 1, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0, delay: 0 },
            }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0 } }}
          >
            <ProgressSection timeEntry={staff.time_entries?.[0]} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
