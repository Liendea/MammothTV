"use client";
import { useState, useEffect } from "react";
import type { Staff } from "@/types/staff";

export function useUpdateStaffArray(staff: Staff[]) {
  const [localStaff, setLocalStaff] = useState<Staff[]>([]);

  useEffect(() => {
    // Om tom array: rensa lokalt
    if (staff.length === 0) {
      setLocalStaff([]);
      return;
    }

    setLocalStaff((prev) => {
      // Första rendern → kopiera in staff
      if (prev.length === 0) return [...staff];

      // Annars: uppdatera endast de element som ändrats
      return prev.map((oldItem, index) => {
        const newItem = staff[index];

        // Om staff-arrayen blivit längre – lägg till nya direkt
        if (!oldItem) return newItem;

        // Om något i objektet ändrats → returnera nytt objekt
        const hasChanged = JSON.stringify(oldItem) !== JSON.stringify(newItem);
        return hasChanged ? newItem : oldItem;
      });
    });
  }, [staff]);

  return {
    visibleStaff: localStaff,
  };
}
