import React from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function Modal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-7 shadow-xl">
        <h2 className="mb-2 text-center text-xl font-semibold text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mb-4 text-center text-sm text-slate-600">
            {description}
          </p>
        )}

        {children}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-lg bg-red-400 text-sm font-semibold text-white hover:bg-red-500 disabled:bg-red-300"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
