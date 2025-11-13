"use client";
import { useState, useEffect } from "react";
import type { Staff } from "@/types/staff";

export function useRotation(staff: Staff[]) {
  const [duplicatedStaff, setDuplicatedStaff] = useState<Staff[]>([]);

  // Antal gånger arrayen dupliceras för seamless scroll
  const duplicationFactor = 3;

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();

    if (staff.length === 0) {
      console.log(
        `[${timestamp}] 🗑️ Clearing duplicated staff — no staff in array.`
      );
      setDuplicatedStaff([]);
      return;
    }

    setDuplicatedStaff((prev) => {
      // Om det är första körningen
      if (prev.length === 0) {
        console.log(`[${timestamp}] ✨ Initial duplication of staff.`);
        const newArray = Array(duplicationFactor).fill(staff).flat();
        return newArray;
      }

      // --- Uppdatera befintliga kort utan att nollställa arrayen ---
      const updated = prev.map((item, i) => {
        const newData = staff[i % staff.length];
        return { ...item, ...newData };
      });

      console.log(
        `[${timestamp}] 🔄 Staff updated — seamless scroll preserved.`
      );
      return updated;
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
