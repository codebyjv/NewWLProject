import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

type AlertDialogActionProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">{children}</div>;
};

const AlertDialogTrigger = ({ children, asChild }: AlertDialogTriggerProps) => {
  if (asChild) {
    const child = React.Children.only(children);
    if (React.isValidElement(child)) {
      return <button onClick={child.props.onClick}>{children}</button>;
    }
    return null;
  }
  
  return (
    <button onClick={() => {/* Lógica para abrir dialog */}}>
      {children}
    </button>
  );
};

const AlertDialogContent = ({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg p-6 w-full max-w-md",
      className
    )}>
      {children}
    </div>
  );
};

const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-lg font-semibold">{children}</h3>;
};

const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-gray-600">{children}</p>;
};

const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
};

const AlertDialogAction = ({ 
  children,
  className,
  onClick 
}: AlertDialogActionProps) => {
  return (
    <button 
      className={cn(
        "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const AlertDialogCancel = ({ 
  children,
  className,
  onClick
}: { 
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button className={cn(
      "px-4 py-2 border border-gray-300 rounded hover:bg-gray-50",
      className
    )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};