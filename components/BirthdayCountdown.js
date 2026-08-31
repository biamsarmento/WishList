"use client";

import { useEffect, useState } from "react";
import { AGE_AFTER, AGE_BEFORE, getBirthdayRange } from "@/lib/birthday";

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

function computeState() {
  const now = new Date();
  const { previous, next } = getBirthdayRange(now);

  const msRemaining = Math.max(next.getTime() - now.getTime(), 0);
  const totalYearMs = next.getTime() - previous.getTime();
  const elapsedMs = now.getTime() - previous.getTime();
  const progress = Math.min(Math.max(elapsedMs / totalYearMs, 0), 1);

  return {
    days: Math.floor(msRemaining / MS_IN_DAY),
    hours: Math.floor((msRemaining % MS_IN_DAY) / MS_IN_HOUR),
    minutes: Math.floor((msRemaining % MS_IN_HOUR) / MS_IN_MINUTE),
    seconds: Math.floor((msRemaining % MS_IN_MINUTE) / MS_IN_SECOND),
    progress,
    reached: msRemaining === 0,
  };
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-nerko text-4xl text-rose sm:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-comic text-sm text-rose">{label}</span>
    </div>
  );
}

export default function BirthdayCountdown() {
  const [state, setState] = useState(null);

  useEffect(() => {
    setState(computeState());
    const interval = setInterval(() => setState(computeState()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!state) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      {state.reached ? (
        <p className="font-nerko text-3xl text-rose">Hoje é o dia</p>
      ) : (
        <div className="flex items-start gap-4 sm:gap-6">
          <TimeBlock value={state.days} label="dias" />
          <TimeBlock value={state.hours} label="horas" />
          <TimeBlock value={state.minutes} label="minutos" />
          <TimeBlock value={state.seconds} label="segundos" />
        </div>
      )}

      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between font-comic text-sm text-rose">
          <span>{AGE_BEFORE}</span>
          <span>{AGE_AFTER}</span>
        </div>
        <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-rose transition-all duration-1000 ease-linear"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
