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
    <motion.div
      className="wrapper"
      layout="position"
      transition={{
        layout: { duration: 2, ease: "easeIn" },
      }}
    >
      <motion.div
        className="employee-name"
        animate={{
          color: undefined,
          scale: isExpanded ? 1 : 0.9,
        }}
        transition={{
          duration: 2,
          ease: "easeIn",
        }}
      >
        {name}
      </motion.div>

      <motion.div
        className="employee-role"
        animate={{
          color: "#888888",
          textTransform: "uppercase",
          scale: isExpanded ? 1 : 0.9,
        }}
        transition={{
          duration: 2,
          ease: "easeIn",
        }}
      >
        {isExpanded ? role : project?.client || "Not tracking time"}
      </motion.div>
    </motion.div>
  );
}
