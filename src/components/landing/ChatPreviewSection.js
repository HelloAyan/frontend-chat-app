"use client";

import { useEffect, useState } from "react";
import { ChatPreview } from "./ChatPreview";
import { ChatPreviewSkeleton } from "./ChatPreviewSkeleton";

// briefly simulated, this section has no real data to wait on (it's static
// mock content), but showing the skeleton for a beat demonstrates the same
// loading state the real chat panel uses instead of just popping in
const SIMULATED_LOAD_MS = 700;

/**
 * @param {import("@/lib/landingContent").ChatPreviewContent} props
 */
export function ChatPreviewSection(props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), SIMULATED_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <ChatPreviewSkeleton /> : <ChatPreview {...props} />;
}
