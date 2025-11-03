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

  const visibleStaff = [
    ...staff.slice(index, index + 5),
    ...staff.slice(0, Math.max(0, index + 5 - staff.length)),
  ];

  return { visibleStaff };
}
