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
        overflow: "hidden",
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
        {isExpanded && (
          <motion.div
            key="card-body"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              layout: { duration: 2, ease: "easeInOut" },
            }}
            className="card-body"
          >
            {/* FunFact */}
            {!showProgress && (
              <motion.div
                layout
                className="fun-fact-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <FunFactSection funFact={staff.fun_fact} />
              </motion.div>
            )}

            {/* ProjectDetails */}
            <motion.div
              layout
              className="project-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <ProjectDetails project={staff.current_project} />
            </motion.div>

            {/* Progress */}
            {showProgress && (
              <motion.div
                layout
                className="time-tracking-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <ProgressSection timeEntry={staff.time_entries?.[0]} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
