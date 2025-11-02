import { motion } from "framer-motion";

type EmployeeInfoProps = {
  name: string;
  role: string;
  isExpanded?: boolean;
  projectName?: string;
};

export function EmployeeInfo({
  name,
  role,
  projectName,
  isExpanded,
}: EmployeeInfoProps) {
  return (
    <>
      <motion.div layout className="wrapper">
        <div className="employee-name">{name}</div>
        <div className="employee-role">{role}</div>
      </motion.div>

      {!isExpanded && (
        <motion.div layout className="project-name">
          {projectName || "Not tracking time"}
        </motion.div>
      )}
    </>
  );
}
