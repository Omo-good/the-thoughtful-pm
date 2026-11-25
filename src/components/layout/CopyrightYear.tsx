"use client";

import { useSyncExternalStore } from "react";

// Build-time year, used only for the server-rendered HTML. The browser then shows the visitor's current year.
const BUILD_YEAR = new Date().getUTCFullYear();

function subscribe() {
  return () => {};
}

/** Dynamic copyright year (PRD §6.7) without forcing every page to render at request time. */
export function CopyrightYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getUTCFullYear(),
    () => BUILD_YEAR,
  );
  return <>{year}</>;
}
