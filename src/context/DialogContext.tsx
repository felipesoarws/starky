import React, { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog } from "../components/ui/Dialog";

interface DialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "alert" | "confirm";
  onConfirm?: () => void;
}

interface DialogContextType {
  showAlert: (title: string, description?: string) => void;
  showConfirm: (title: string, description: string, onConfirm: () => void) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({ title: "" });

  const showAlert = (title: string, description?: string) => {
    setOptions({
      title,
      description,
      variant: "alert",
      confirmLabel: "OK",
    });
    setIsOpen(true);
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setOptions({
      title,
      description,
      variant: "confirm",
      confirmLabel: "Confirmar",
      cancelLabel: "Cancelar",
      onConfirm,
    });
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        title={options.title}
        description={options.description}
        confirmLabel={options.confirmLabel}
        cancelLabel={options.cancelLabel}
        variant={options.variant}
        onConfirm={options.onConfirm}
      />
    </DialogContext.Provider>
  );
};
