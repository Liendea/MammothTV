import { AnimatePresence, motion } from "framer-motion";

type EmployeeInfoProps = {
  name: string;
  role: string;
  isExpanded?: boolean;
  truncatedName?: string;
};

export function EmployeeInfo({
  name,
  role,
  truncatedName,
  isExpanded,
}: EmployeeInfoProps) {
  return (
    <>
      <motion.div
        layout
        transition={{
          layout: { duration: 1, ease: "easeInOut" },
        }}
        className="wrapper"
      >
        <div className="employee-name">{name}</div>
        <div className="employee-role">{role}</div>
      </motion.div>
      {/* Only show when card is not expanded */}
      <AnimatePresence initial={false}>
        {!isExpanded && (
          <motion.div
            key="project-name"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                opacity: { duration: 0.1, delay: 1 },
                height: { duration: 0, ease: "easeInOut", delay: 0.5 },
              },
            }}
            className="project-name"
          >
            {truncatedName || "Not tracking time"}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
