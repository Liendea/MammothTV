"use client";
import { useState, useEffect } from "react";
import type { Staff } from "@/types/staff";

export function useRotation(staff: Staff[], interval: number = 5000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (staff.length === 0) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % staff.length);
    }, interval);

    return () => clearInterval(id);
  }, [staff.length, interval]);

  // Effect to reset index if staff shrinks
  useEffect(() => {
    if (index >= staff.length && staff.length > 0) {
      setIndex(0);
    }
  }, [staff.length, index]);

  // Compute visible staff
  let visibleStaff: Staff[] = [];
  if (staff.length > 0) {
    if (staff.length <= 5) {
      // If less than 5 staff, show them all (no duplication)
      visibleStaff = [...staff];
    } else {
      // Normal case: rotate window and wrap around list
      visibleStaff = [
        ...staff.slice(index, index + 5),
        ...staff.slice(0, Math.max(0, index + 5 - staff.length)),
      ];
    }
  }
  return { visibleStaff };
}
