"use client";
import { useState, useEffect } from "react";
import type { Staff } from "@/types/staff";

export function useUpdateStaffArray(staff: Staff[]) {
  const [localStaff, setLocalStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true); // Set initial state to true to show loading on the first fetch

  useEffect(() => {
    // 1. Compare length and set loading
    if (localStaff.length !== staff.length) {
      // Set loading to true if the array length has changed (addition or removal)
      setLoading(true);

      // Set a timeout to simulate a "loading time"
      // and ensure the LoadingSpinner has time to be displayed.
      // Then update localStaff to the new, shorter/longer list.
      const timer = setTimeout(() => {
        setLocalStaff(staff);
        setLoading(false);
      }, 500); // 500ms loading time, adjust as needed

      return () => clearTimeout(timer); // Cleanup
    }

    // 2. Handle updates to existing elements (if the length is the same)
    setLocalStaff((prev) => {
      // If this is the first render (length is 0) or if staff is not empty
      if (prev.length === 0 && staff.length > 0) {
        setLoading(false);
        return [...staff];
      }

      // If the arrays have the same length, update only if the object has actually changed
      if (prev.length === staff.length) {
        return prev.map((oldItem, index) => {
          const newItem = staff[index];
          // Check if the object has changed
          const hasChanged =
            JSON.stringify(oldItem) !== JSON.stringify(newItem);
          return hasChanged ? newItem : oldItem;
        });
      }

      // If there is no length change or initial copy, return the previous state
      return prev;
    });

    // 3. Reset loading if the length is the same and the update is complete
    if (localStaff.length === staff.length && loading) {
      setLoading(false);
    }
  }, [staff, localStaff.length, loading]); // Dependencies include staff and localStaff.length to trigger on length changes

  return {
    visibleStaff: localStaff,
    loading,
  };
}
