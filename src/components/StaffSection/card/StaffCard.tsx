import type { Staff } from "@/types/staff";
import { Avatar } from "../card-details/Avatar";
import { AnimatePresence, motion } from "framer-motion";
import { EmployeeInfo } from "../card-details/EmployeeInfo";
import { FunFactSection } from "../card-details/FunFactSection";
import { ProjectDetails } from "../card-details/ProjectDetails";
import { ProgressSection } from "../card-details/ProgressSection";
import { truncateText } from "../../ProjectBudgetSection/ProgressUtils";

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
  const isTopCard = index === 0; // topCard moves out of screen
  const isExpandedCard = index === 1; // SecondCard. moves up end expands
  const isLowerCard = index > 1; // smallcards
  const truncatedName = truncateText(staff.current_project?.name, 30);

  return (
    <motion.div
      layoutId={`staff-${staff.id}`}
      layout
      transition={{
        layout: { duration: 1, ease: "easeInOut" }, // 👈 styr layout-animeringen
      }}
      className={`card ${isExpandedCard ? "card-expanded" : "card-simple"}`}
      // Defines the starting animation state when the card first appears
      initial={
        isTopCard
          ? { y: -200, opacity: 1 } // Top card starts slightly higher on the screen
          : isExpandedCard
            ? { y: 0, opacity: 0, scale: 1 } // Expanded card starts a bit lower and faded out
            : { y: 0, opacity: 1, scale: 1 } // Lower cards start at their normal position
      }
      animate={
        isTopCard
          ? {
              // Moves the top card upward and fades it out to simulate "leaving" the stack
              y: -300,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 1,
                ease: "easeInOut",
                delay: 1, // short pause before the movement starts
              },
            }
          : isExpandedCard
            ? {
                // Expanded card animates upward and becomes fully visible
                y: -180,
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: 0, // no delay
                },
              }
            : isLowerCard
              ? {
                  // Lower cards slightly shift upward to fill space as others move
                  y: -180,
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, ease: "easeInOut" },
                }
              : {}
      }
      exit={
        isTopCard
          ? {
              // The top card exits by moving even further up and fading out completely
              y: -400,
              opacity: 0,
              transition: { duration: 1, ease: "easeIn" },
            }
          : undefined // Other cards keep their default exit (no special animation)
      }
    >
      {/* ----- Card Header ----- */}
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
            truncatedName={truncatedName}
            isExpanded={isExpandedCard}
          />
        </div>
      </div>

      {/* --------- Card body ----------  */}
      <AnimatePresence mode="wait">
        <motion.div
          layout
          transition={{
            layout: { duration: 1, ease: "easeInOut" },
          }}
          exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
          className="card-body"
        >
          {/* FunFact */}
          {isExpandedCard && !showProgress && (
            <div className="fun-fact-area">
              <FunFactSection funFact={staff.fun_fact} />
            </div>
          )}

          {/* ProjectDetails */}
          {isExpandedCard && (
            <div className="project-details">
              <ProjectDetails project={staff.current_project} />
            </div>
          )}

          {/* Progress */}
          {isExpandedCard && showProgress && (
            <div className="time-tracking-area">
              <ProgressSection timeEntry={staff.time_entries?.[0]} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
