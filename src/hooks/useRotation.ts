"use client";
import { useState, useEffect, useRef } from "react";
import type { Staff } from "@/types/staff";

export function useRotation(staff: Staff[]) {
  const [duplicatedStaff, setDuplicatedStaff] = useState<Staff[]>([]);
  const rotationIndexRef = useRef(0);

  useEffect(() => {
    if (staff.length === 0) {
      setDuplicatedStaff([]);
      return;
    }

    // Rotate the list every time new data is fetched
    const newRotationIndex = rotationIndexRef.current % staff.length;

    const rotated = [
      ...staff.slice(newRotationIndex),
      ...staff.slice(0, newRotationIndex),
    ];

    // Duplicate for seamless infinite scroll
    setDuplicatedStaff([...rotated, ...rotated]);

    // Increase the rotation index for the next update (every minute)
    rotationIndexRef.current = (newRotationIndex + 2) % staff.length;
  }, [staff]);

  // Calculate animation speed based on the number of employees
  const cardHeight = 200; // Approximate height per card in pixels
  const singleSetHeight = staff.length * cardHeight;
  const duration = staff.length * 3; // scroll speed

  return {
    visibleStaff: duplicatedStaff,
    animationConfig: {
      totalHeight: -singleSetHeight,
      duration: duration,
    },
  };
}
