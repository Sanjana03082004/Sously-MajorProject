// "use client";
// import { useEffect, useState } from "react";

// export interface Settings {
//   voiceMonitoring: boolean;
//   backgroundListening: boolean;
//   notifications: boolean;
//   dataSharing: boolean;
//   voiceSensitivity: number;
//   reminderFrequency: number;
//   theme: "light" | "dark" | "auto";
// }

// const defaultSettings: Settings = {
//   voiceMonitoring: true,
//   backgroundListening: false,
//   notifications: true,
//   dataSharing: false,
//   voiceSensitivity: 75,
//   reminderFrequency: 3,
//   theme: "light",
// };

// export function useSettings() {
//   const [settings, setSettings] = useState<Settings>(defaultSettings);

//   // Load from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("mindmate-settings");
//     if (stored) setSettings(JSON.parse(stored));
//   }, []);

//   // Save to localStorage whenever settings change
//   useEffect(() => {
//     localStorage.setItem("mindmate-settings", JSON.stringify(settings));
//   }, [settings]);

//   // Helper to update specific key
//   const updateSetting = (key: keyof Settings, value: any) => {
//     setSettings(prev => ({ ...prev, [key]: value }));
//   };

//   return { settings, updateSetting };
// }
"use client";

import { useEffect, useState } from "react";

export type Settings = {
  voiceMonitoring: boolean;
  backgroundListening: boolean;
  notifications: boolean;
  dataSharing: boolean;
  voiceSensitivity: number;
  reminderFrequency: number;
  theme: "light" | "dark" | "auto";
};

const DEFAULT_SETTINGS: Settings = {
  voiceMonitoring: true,
  backgroundListening: false,
  notifications: true,
  dataSharing: false,
  voiceSensitivity: 75,
  reminderFrequency: 3,
  theme: "light",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // 🧠 Load saved settings from localStorage when component mounts
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mindmate-settings");
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  // 💾 Save settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("mindmate-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [settings]);

  // 🔄 Update a specific setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
