"use client";

import type { CSSProperties, ReactNode } from "react";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  style,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-roast/45 p-4 backdrop-blur-sm"
      style={style}
    >
      <div
        className="w-full max-w-2xl rounded-[2rem] border border-mocha/10 bg-white p-6 shadow-glow sm:p-7"
        style={{
          maxHeight: "650px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-roast">{title}</h3>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-mocha/75">
                {description}
              </p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="btn-secondary h-11 w-11 rounded-full px-0"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
