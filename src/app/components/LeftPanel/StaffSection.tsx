"use client";

import "@/app/styling/staffSection.scss";
import StaffCard from "./StaffCard";
import type { Staff } from "../../types/staff";
import { useState } from "react";
import { useEffect } from "react";

export default function StaffSection() {
  const [users, setUsers] = useState<Staff[]>([]);

  useEffect(() => {
    fetch("/mockData/MOCKDATA.json")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  // Rotate array every 5 seconds
  useEffect(() => {
    if (users.length === 0) return;

    const interval = setInterval(() => {
      setUsers((prevUsers) => {
        const [first, ...rest] = prevUsers;
        return [...rest, first]; // Move forst element to the end of array
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [users]);

  // 4 visible users, expnaded always fisrt
  const visibleUsers = users.slice(0, 4).map((user, index) => ({
    ...user,
    isExpanded: index === 0,
  }));

  return (
    <section className="staffSection">
      {visibleUsers.map((user, index) => (
        <StaffCard
          key={user.id}
          staff={user}
          isExpanded={index === 0}
          showProgress={true} // <--- change to false if progressbar and hours should not be visible
        />
      ))}
    </section>
  );
}
