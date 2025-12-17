import { Avatar } from "./Avatar";
import { EmployeeInfo } from "./EmployeeInfo";
import { ProjectDetails } from "./ProjectDetails";
import { FunFactSection } from "./FunFactSection";
import { ProgressSection } from "./ProgressSection";
import { SimpleCardInfo } from "./SimpleCardInfo";
import type { Staff } from "@/types/staff";
import { motion } from "framer-motion";

const CARD_OFFSET = 170; // Höjd på simple card + gap

type StaffCardProps = {
  staff: Staff;
  projectName?: string;
  isActive: boolean;
  showProgress: boolean;
  isExpanded: boolean;
  index: number;
  totalCards: number;
};

export function StaffCard({
  staff,
  isActive,
  showProgress,
  isExpanded,
  index,
  totalCards,
}: StaffCardProps) {
  const offset = index * CARD_OFFSET; // Varje kort förskjuts nedåt

  return (
    <motion.div
      className={`card ${isExpanded ? "card-expanded" : "card-simple"}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
      }}
      initial={{ opacity: 0, y: offset + 20 }}
      animate={{
        opacity: 1,
        y: offset,
        zIndex: totalCards - index, // Första kortet högst z-index
      }}
      exit={
        isExpanded
          ? {
              scaleY: [1, 0.5],
              y: [offset, offset, -200],
              opacity: [1, 1, 0],
              transition: {
                scaleY: {
                  times: [0, 0.5],
                  duration: 0.5,
                  ease: "easeInOut",
                },
                y: {
                  times: [0, 0.5, 1],
                  duration: 1,
                  ease: "easeInOut",
                },
                opacity: {
                  times: [0, 0.8, 1],
                  duration: 1,
                },
              },
            }
          : {
              opacity: 0,
              transition: { duration: 0.3 },
            }
      }
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      {isExpanded ? (
        /* Expanded Card */
        <>
          <div className="card-header">
            <div className="avatar-name">
              <Avatar
                image={staff.image}
                initials={staff.initials}
                name={staff.name}
                isActive={isActive}
              />
              <EmployeeInfo name={staff.name} role={staff.role} />
            </div>
            {!showProgress && <FunFactSection funFact={staff.fun_fact} />}
          </div>
          <ProjectDetails project={staff.current_project} />
          {showProgress && (
            <ProgressSection timeEntry={staff.time_entries?.[0]} />
          )}
        </>
      ) : (
        /* Simple card */
        <>
          <div className="card-header">
            <Avatar
              image={staff.image}
              initials={staff.initials}
              name={staff.name}
              isActive={isActive}
            />
            <SimpleCardInfo
              name={staff.name}
              role={staff.role}
              projectName={staff.current_project?.name}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
