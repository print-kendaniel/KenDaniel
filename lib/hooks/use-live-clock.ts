"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const meridiem = hours >= 12 ? "pm" : "am";
  return `${hours % 12 || 12}:${minutes}${meridiem}`;
}

function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

/** Live-updating local time/date, ticking every second. Falls back to a fixed string until the first client tick. */
export function useLiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    time: now ? formatTime(now) : "9:41am",
    date: now ? formatDate(now) : "12 March, 2025",
  };
}
