"use client";

import { useEffect, useRef } from "react";
import "swagger-ui-dist/swagger-ui.css";

export default function ApiDocsPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    import("swagger-ui-dist/swagger-ui-es-bundle.js").then((mod) => {
      if (cancelled || !containerRef.current) return;
      const SwaggerUI = mod.default;
      SwaggerUI({
        domNode: containerRef.current,
        url: "/api/openapi.yaml",
        presets: [SwaggerUI.presets.apis],
        plugins: [SwaggerUI.plugins.DownloadUrl],
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={containerRef} />;
}
