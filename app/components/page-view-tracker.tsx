"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastRecordedPath = useRef("");

  useEffect(() => {
    if (!pathname || pathname === lastRecordedPath.current) return;
    lastRecordedPath.current = pathname;

    void supabase
      .from("site_pageviews")
      .insert({ page_path: pathname })
      .then(({ error }) => {
        if (error) console.error("Could not record page view:", error.message);
      });
  }, [pathname]);

  return null;
}
