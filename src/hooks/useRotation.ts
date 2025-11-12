"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import type { Staff } from "@/types/staff";

export function useRotation(staff: Staff[]) {
  const [duplicatedStaff, setDuplicatedStaff] = useState<Staff[]>([]);
  const rotationIndexRef = useRef(0);
  const previousStaffHashRef = useRef<string>("");

  // Skapa en hash av staff-data för jämförelse
  const staffHash = useMemo(() => {
    return JSON.stringify(
      staff.map((s) => ({
        id: s.id,
        isActive: s.isActive,
        currentHours: s.currentHours,
        activeProject: s.activeProject,
      }))
    );
  }, [staff]);

  useEffect(() => {
    if (staff.length === 0) {
      setDuplicatedStaff([]);
      previousStaffHashRef.current = "";
      return;
    }

    // Uppdatera bara om staff faktiskt har ändrats
    if (staffHash === previousStaffHashRef.current) {
      console.log("✓ Staff oförändrad, behåller animation");
      return;
    }

    console.log("📊 Staff har ändrats, uppdaterar rotation");
    previousStaffHashRef.current = staffHash;

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
  }, [staff, staffHash]);

  // Calculate animation speed based on the number of employees
  const cardHeight = 300; // Approximate height per card in pixels
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
