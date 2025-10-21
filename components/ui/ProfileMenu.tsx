"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-gray-200 hover:bg-emerald-50"
        aria-label="Profile menu"
      >
        <User className="h-5 w-5 text-emerald-700" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 text-gray-700"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4 text-emerald-600" />
            <span>Settings</span>
          </Link>
          <div className="border-t border-gray-100" />
          <div className="px-2 py-1">
            <LogoutButton className="flex w-full items-center gap-2 px-2 py-2 hover:bg-red-50 text-red-600 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
