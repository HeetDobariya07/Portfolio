"use client";

import { useEffect, useState } from "react";

const format = (timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });

/** Local time in the given zone. Renders a placeholder until mounted so SSR output stays static. */
export function LiveClock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = format(timeZone);
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}
