import React from "react";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>;
}

export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={`hover:bg-gray-100 ${className}`}>{children}</tr>;
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>;
}

export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>{children}</tbody>;
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}