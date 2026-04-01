"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X, CheckCircle, Info } from "lucide-react";

type ToastVariant = "error" | "success" | "info";

const icons = {
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const styles = {
  error: {
    border: "border-red-100",
    bg: "bg-white",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    shadow: "shadow-red-500/8",
  },
  success: {
    border: "border-green-100",
    bg: "bg-white",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    shadow: "shadow-green-500/8",
  },
  info: {
    border: "border-blue-100",
    bg: "bg-white",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    shadow: "shadow-blue-500/8",
  },
};

export function Toast({
  message,
  onClose,
  variant = "error",
}: {
  message: string;
  onClose: () => void;
  variant?: ToastVariant;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const Icon = icons[variant];
  const style = styles[variant];

  return (
    <div className="fixed top-6 left-1/2 z-50 w-max max-w-[90vw] -translate-x-1/2 animate-[toastIn_0.35s_cubic-bezier(.21,1.02,.73,1)]">
      <div className={`flex items-center gap-3 rounded-xl border ${style.border} ${style.bg} px-5 py-3 shadow-lg ${style.shadow}`}>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}>
          <Icon className={`h-4 w-4 ${style.iconColor}`} />
        </div>
        <span className="text-sm font-medium text-gray-700 break-words">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// Hook for easy toast usage
export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    variant?: ToastVariant;
  } | null>(null);

  const showToast = (message: string, variant: ToastVariant = "error") => {
    setToast({ message, variant });
  };

  const clearToast = () => setToast(null);

  return { toast, showToast, clearToast };
}
