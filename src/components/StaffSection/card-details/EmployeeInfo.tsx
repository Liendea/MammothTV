import { motion } from "framer-motion";

type EmployeeInfoProps = {
  name: string;
  role: string;
  isExpanded?: boolean;
  truncatedName?: string;
};

export function EmployeeInfo({ name, role }: EmployeeInfoProps) {
  return (
    <>
      <motion.div
        className="wrapper"
        layout
        transition={{ layout: { duration: 2, ease: "easeInOut" } }}
      >
        <div className="employee-name">{name}</div>
        <div className="employee-role">{role}</div>
      </motion.div>
    </>
  );
}
