import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "alert" | "confirm";
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "OK",
  cancelLabel = "Cancelar",
  onConfirm,
  variant = "alert",
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-scale-in overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800 rounded-full">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          
          {description && (
            <p className="text-zinc-400 mb-6 leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex justify-end gap-3">
            {variant === "confirm" && (
              <Button variant="ghost" onClick={onClose} size="sm">
                {cancelLabel}
              </Button>
            )}
            <Button 
                onClick={() => {
                    if (onConfirm) onConfirm();
                    onClose();
                }} 
                size="sm"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
