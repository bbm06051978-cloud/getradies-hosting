"use client";

import React, { useState } from "react";
import NextImage, { ImageProps } from "next/image";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

/**
 * ImageWithFallback – wraps next/image with an error fallback.
 *
 * Differences from the Vite version:
 * - Uses next/image for automatic optimisation (lazy loading, WebP, sizing).
 * - Requires `width` + `height` OR `fill` prop (Next.js requirement).
 * - Falls back to a plain <img> error placeholder on load failure.
 *
 * For images whose dimensions are unknown at build time (e.g. hero bg,
 * logo), pass `fill` and wrap the parent in `position: relative`.
 */
type Props = Omit<ImageProps, "src"> & {
  src: string;
  /** Optional plain-img className used only in the fallback state */
  fallbackClassName?: string;
};

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  ...rest
}: Props) {
  const [didError, setDidError] = useState(false);

  if (didError) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gray-100 ${className ?? ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          className={fallbackClassName}
          data-original-url={src}
        />
      </div>
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      className={className}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
