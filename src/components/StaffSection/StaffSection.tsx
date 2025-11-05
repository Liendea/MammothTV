"use client";

import { AnimatePresence, motion } from "framer-motion";
import StaffCard from "./card/StaffCard";
import { useStaffData } from "@/hooks/useStaffData";
import { useRotation } from "@/hooks/useRotation";
import LoadingSpinner from "../LoadingSpinner";

export default function StaffSection() {
  const { staff, loading, error } = useStaffData(60000);
  const { visibleStaff } = useRotation(staff, 10000);

  const showProgress = process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true";

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <section className="staffSection">
        <div className="error">
          <p>{error}</p>
          <p>Failed to fetch team members</p>
        </div>
      </section>
    );

  return (
    <section className="staffSection">
      <motion.div layout className="staffCardContainer">
        <AnimatePresence mode="sync">
          {visibleStaff.map((user, index) => (
            <StaffCard
              key={user.id}
              staff={user}
              isActive={user.isActive || false}
              showProgress={showProgress}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
