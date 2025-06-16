import React from "react";

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <aside className={`w-64 ${className}`}>{children}</aside>;
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

export function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-semibold text-gray-500 ${className}`}>{children}</div>;
}

export function SidebarMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={className}>{children}</ul>;
}

export function SidebarMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={className}>{children}</li>;
}

export function SidebarMenuButton({ children, className, asChild }: { children: React.ReactNode; className?: string; asChild?: boolean }) {
  return asChild ? <>{children}</> : <button className={className}>{children}</button>;
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SidebarTrigger({ className }: { className?: string }) {
  return <button className={className}>☰</button>;
}