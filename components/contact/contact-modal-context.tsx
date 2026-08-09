"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ContactModalContextValue {
  isOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

/** Lets any CTA anywhere in the tree (header, hero, nav overlay, footer) open the contact modal. */
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ContactModalContext.Provider
      value={{
        isOpen,
        openContactModal: () => setIsOpen(true),
        closeContactModal: () => setIsOpen(false),
      }}
    >
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal(): ContactModalContextValue {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}
