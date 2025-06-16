import React from "react";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}