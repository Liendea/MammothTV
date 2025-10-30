import { useState, useEffect, useRef } from "react";
import type { Staff } from "@/types/staff";

export function useRotation(staff: Staff[], interval: number = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (staff.length === 0) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % staff.length);
    }, interval);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [staff.length, currentIndex, interval]);

  // Skapa synliga kort baserat på currentIndex
  const visibleStaff = [
    ...staff.slice(currentIndex, currentIndex + 4),
    ...staff.slice(0, Math.max(0, currentIndex + 4 - staff.length)),
  ].slice(0, 4);

  return visibleStaff;
}
