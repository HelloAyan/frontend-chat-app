"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

// shows a skeleton until the remote image actually finishes loading, rather
// than a blank box or a layout jump when it pops in
export function HeroImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-secondary shadow-xl ring-1 ring-border", className)}>
      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-secondary" />}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 480px, 90vw"
        onLoad={() => setIsLoaded(true)}
        className={cn("object-cover transition-opacity duration-700", isLoaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
