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

    // Rotera listan varje gång ny data hämtas
    const newRotationIndex = rotationIndexRef.current % staff.length;

    const rotated = [
      ...staff.slice(newRotationIndex),
      ...staff.slice(0, newRotationIndex),
    ];

    // Duplicera för seamless infinite scroll
    setDuplicatedStaff([...rotated, ...rotated]);

    // Öka rotationsindex för nästa uppdatering (varje minut)
    rotationIndexRef.current = (newRotationIndex + 2) % staff.length;
  }, [staff]);

  // Beräkna animationshastighet baserat på antal anställda
  const cardHeight = 200; // Ungefärlig höjd per kort i pixels
  const singleSetHeight = staff.length * cardHeight;
  const duration = staff.length * 4; // 4 sekunder per kort (justera efter behov)

  return {
    visibleStaff: duplicatedStaff,
    animationConfig: {
      totalHeight: -singleSetHeight,
      duration: duration,
    },
  };
}
