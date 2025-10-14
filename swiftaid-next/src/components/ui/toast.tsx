"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  duration?: number;
  type?: "default" | "success" | "error" | "warning";
}

interface ToastContextType {
  toast: (message: string, options?: { duration?: number; type?: ToastProps["type"] }) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: number }>>([]);

  const toast = React.useCallback((message: string, options?: { duration?: number; type?: ToastProps["type"] }) => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      duration: options?.duration || 3000,
      type: options?.type || "default"
    };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration);
  }, []);

  const removeToast = React.useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={cn(
              "min-w-[300px] rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right-5",
              {
                "bg-white border-gray-200 text-gray-900": type === "default",
                "bg-green-50 border-green-200 text-green-800": type === "success",
                "bg-red-50 border-red-200 text-red-800": type === "error",
                "bg-yellow-50 border-yellow-200 text-yellow-800": type === "warning",
              }
            )}
            onClick={() => removeToast(id)}
          >
            <div className="text-sm font-medium">{message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}