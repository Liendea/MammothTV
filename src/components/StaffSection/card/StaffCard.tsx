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

// Variants för smooth animationer
const bodyVariants = {
  collapsed: {
    opacity: 0,
  },
  expanded: {
    opacity: 1,
    scale: 1,
  },
};

const contentItemVariants = {
  collapsed: {
    opacity: 0,
  },
  expanded: {
    opacity: 1,
    y: 0,
  },
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
      className="card"
      layout
      transition={{
        layout: { duration: 2, ease: "easeInOut" },
      }}
      style={{
        borderRadius: "20px",
        marginBottom: "16px",
        overflow: "hidden",
        maxHeight: isExpanded ? "420px" : "170px",
      }}
    >
      {/* ----- Card Header ----- */}
      <motion.div
        layout="position"
        className="card-header"
        transition={{
          layout: { duration: 2, ease: "easeInOut" },
        }}
      >
        <motion.div
          layout="position"
          className="avatar-wrapper"
          transition={{
            layout: { duration: 2, ease: "easeInOut" },
          }}
        >
          <Avatar
            image={staff.image}
            initials={staff.initials}
            name={staff.name}
            isActive={isActive}
            isExpanded={isExpanded}
          />
        </motion.div>
        <motion.div
          layout="position"
          className="employee-info"
          transition={{
            layout: { duration: 2, ease: "easeInOut" },
          }}
        >
          <EmployeeInfo
            name={staff.name}
            role={staff.role}
            truncatedName={truncatedName}
            isExpanded={isExpanded}
            project={staff.current_project}
          />
        </motion.div>
      </motion.div>

      {/* --------- Card body ----------  */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            layout
            key="card-body"
            className="card-body"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={bodyVariants}
            transition={{
              layout: { duration: 1.5, ease: "easeInOut" },
              opacity: { duration: 1, ease: "easeInOut" },
              scale: { duration: 2, ease: "easeInOut" },
              when: "beforeChildren",
              staggerChildren: 0.08,
              delayChildren: 0.2,
            }}
          >
            {/* FunFact */}
            {!showProgress && (
              <motion.div
                layout
                className="fun-fact-area"
                variants={contentItemVariants}
                transition={{
                  layout: { duration: 1.5, ease: "easeInOut" },
                  opacity: { duration: 1.5, ease: "easeInOut" },
                  y: { duration: 1.5, ease: "easeInOut" },
                }}
              >
                <FunFactSection funFact={staff.fun_fact} />
              </motion.div>
            )}

            {/* ProjectDetails */}
            <motion.div
              layout
              className="project-details"
              variants={contentItemVariants}
              transition={{
                layout: { duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 1.5, ease: "easeInOut" },
                y: { duration: 1.5, ease: "easeInOut" },
              }}
            >
              <ProjectDetails project={staff.current_project} />
            </motion.div>

            {/* Progress */}
            {showProgress && (
              <motion.div
                layout
                className="time-tracking-area"
                variants={contentItemVariants}
                transition={{
                  layout: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 1.5, ease: "easeInOut" },
                  y: { duration: 1.5, ease: "easeInOut" },
                }}
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
