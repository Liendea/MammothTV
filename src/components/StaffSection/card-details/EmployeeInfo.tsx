import { motion } from "framer-motion";

type EmployeeInfoProps = {
  name: string;
  role: string;
  isExpanded?: boolean;
  truncatedName?: string;
  project?: Project;
};

type Project = {
  name: string;
  client: string;
};

export function EmployeeInfo({
  name,
  role,
  isExpanded,
  project,
}: EmployeeInfoProps) {
  return (
    <>
      {!isExpanded ? (
        <motion.div
          className="wrapper"
          layout
          transition={{ layout: { duration: 2, ease: "easeInOut" } }}
        >
          <div className="employee-name">{name}</div>
          <div className="project-client">
            {project?.client || "Not tracking time"}
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="wrapper"
          layout
          transition={{ layout: { duration: 2, ease: "easeInOut" } }}
        >
          <div className="employee-name">{name}</div>
          <div className="employee-role">{role}</div>
        </motion.div>
      )}
    </>
  );
}
