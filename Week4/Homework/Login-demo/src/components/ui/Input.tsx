import React from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

export function Input({
  label,
  errorMessage,
  className = "",
  ...rest
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-300 transition focus:border-emerald-400 focus:ring ${className}`}
        {...rest}
      />
      {errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
