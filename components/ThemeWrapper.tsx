"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/useSettings";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings?.theme]);

  return <>{children}</>;
}
