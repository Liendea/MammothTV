"use client";
import { useState, useEffect } from "react";
import type { Staff } from "@/types/staff";

export function useRotation(staff: Staff[]) {
  const [duplicatedStaff, setDuplicatedStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();

    if (staff.length === 0) {
      console.log(
        `[${timestamp}] Clearing duplicated staff — no staff in array.`
      );
      setDuplicatedStaff([]);
      return;
    }

    setDuplicatedStaff((prev) => {
      // Om detta är första körningen
      if (prev.length === 0) {
        console.log(`[${timestamp}] Initial duplication of staff.`);
        return [...staff, ...staff];
      }

      // --- Kontrollera om något faktiskt ändrats ---
      let hasChanged = false;

      // Samma längd men olika data → uppdatera
      if (staff.length !== prev.length / 2) {
        hasChanged = true;
      } else {
        for (const member of staff) {
          const match = prev.find((p) => p.id === member.id);
          if (
            !match ||
            match.name !== member.name ||
            match.role !== member.role ||
            match.image !== member.image ||
            match.fun_fact !== member.fun_fact ||
            match.isActive !== member.isActive
          ) {
            hasChanged = true;
            break;
          }
        }
      }

      if (!hasChanged) {
        console.log(
          `[${timestamp}] No data changes detected — keeping duplicatedStaff.`
        );
        return prev;
      }

      console.log(
        `[${timestamp}] Staff changed — rebuilding duplicatedStaff from scratch.`
      );
      return [...staff, ...staff];
    });
  }, [staff]);

  // Animation config
  const cardHeight = 300;
  const singleSetHeight = staff.length * cardHeight;
  const duration = staff.length * 3;

  return {
    visibleStaff: duplicatedStaff,
    animationConfig: {
      totalHeight: -singleSetHeight,
      duration,
    },
  };
}
