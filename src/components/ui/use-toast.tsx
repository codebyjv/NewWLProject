import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from "react";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextProps {
  toasts: ToastProps[];
  addToast: (toast: ToastProps) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
};

const ToastViewport = ({ toasts }: { toasts: ToastProps[] }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-[320px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md border shadow-lg p-4 bg-white transition-all ${
            toast.variant === "destructive"
              ? "border-red-600 text-red-700"
              : "border-gray-300 text-gray-900"
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.description && (
            <div className="text-sm mt-1 text-gray-600">
              {toast.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
