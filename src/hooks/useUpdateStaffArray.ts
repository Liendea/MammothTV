"use client";
import { useState, useEffect } from "react";
import type { Staff } from "@/types/staff";

export function useUpdateStaffArray(staff: Staff[]) {
  const [localStaff, setLocalStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true); // Sätt initialt till true för att visa laddning vid första hämtningen

  useEffect(() => {
    // 1. Jämför längd och sätt loading
    if (localStaff.length !== staff.length) {
      // Sätt loading till true om arrayens längd har ändrats (tillägg eller borttagning)
      setLoading(true);

      // Sätt en timeout för att simulera en "laddningstid"
      // och säkerställa att LoadingSpinner hinner visas.
      // Uppdatera sedan localStaff till den nya, kortare/längre listan.
      const timer = setTimeout(() => {
        setLocalStaff(staff);
        setLoading(false);
      }, 500); // 500ms laddningstid, justera efter behov

      return () => clearTimeout(timer); // Rensning
    }

    // 2. Hantera uppdatering av befintliga element (om längden är densamma)
    setLocalStaff((prev) => {
      // Om det är första rendern (längden är 0) eller om staff är tom
      if (prev.length === 0 && staff.length > 0) {
        setLoading(false);
        return [...staff];
      }

      // Om arrayerna har samma längd, uppdatera endast om objektet faktiskt har ändrats
      if (prev.length === staff.length) {
        return prev.map((oldItem, index) => {
          const newItem = staff[index];
          // Jämför om objektet ändrats
          const hasChanged =
            JSON.stringify(oldItem) !== JSON.stringify(newItem);
          return hasChanged ? newItem : oldItem;
        });
      }

      // Om ingen längdförändring eller initial kopiering, returnera föregående tillstånd
      return prev;
    });

    // 3. Återställ loading om längden är densamma och uppdateringen är klar
    if (localStaff.length === staff.length && loading) {
      setLoading(false);
    }
  }, [staff, localStaff.length, loading]); // Beroenden inkluderar staff och localStaff.length för att trigga vid längdförändring

  return {
    visibleStaff: localStaff,
    loading,
  };
}
