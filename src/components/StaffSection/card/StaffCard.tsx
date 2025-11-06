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
  isExpanded?: boolean;
  cardId: string;
  onCardRef?: (node: HTMLElement | null, cardId: string) => void;
  index: number;
};

export default function StaffCard({
  staff,
  isActive,
  showProgress,

  isExpanded = false,
  cardId,
  onCardRef,
}: StaffCardProps) {
  const truncatedName = truncateText(staff.current_project?.name, 30);

  return (
    <motion.div
      ref={(node) => onCardRef?.(node, cardId)}
      className={`card ${isExpanded ? "card-expanded" : "card-simple"}`}
      layout
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        layout: { duration: 2, ease: "easeInOut" },
      }}
      style={{
        borderRadius: "20px",
        marginBottom: "16px",
      }}
    >
      {/* ----- Card Header ----- */}
      <motion.div
        className="card-header"
        layout
        transition={{
          layout: { duration: 2, ease: "easeInOut" },
        }}
      >
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
            isExpanded={isExpanded}
          />
        </div>
      </motion.div>

      {/* --------- Card body ----------  */}
      <AnimatePresence mode="wait">
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            layout: { duration: 2, ease: "easeInOut" },
          }}
          exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
          className="card-body"
        >
          {/* FunFact */}
          {isExpanded && !showProgress && (
            <motion.div
              layout
              className="fun-fact-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
            >
              <FunFactSection funFact={staff.fun_fact} />
            </motion.div>
          )}

          {/* ProjectDetails */}
          {isExpanded && (
            <AnimatePresence mode="wait">
              <motion.div
                className="project-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
              >
                <ProjectDetails project={staff.current_project} />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Progress */}
          {isExpanded && showProgress && (
            <motion.div
              className="time-tracking-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
            >
              <ProgressSection timeEntry={staff.time_entries?.[0]} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
