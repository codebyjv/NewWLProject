import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement;

export const ToastViewport = ({ toasts }: { toasts: ToastProps[] }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-md border bg-white p-4 shadow-lg w-[320px]",
            toast.variant === "destructive"
              ? "border-red-600 text-red-800"
              : "border-gray-300 text-gray-900"
          )}
        >
          <div className="font-medium">{toast.title}</div>
          {toast.description && (
            <div className="text-sm text-gray-600 mt-1">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};
