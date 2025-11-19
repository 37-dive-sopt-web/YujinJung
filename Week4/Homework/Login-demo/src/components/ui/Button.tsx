import type { ButtonHTMLAttributes, ReactNode } from "react";
import React from "react";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const variantClassNames: Record<Variant, string> = {
  primary:
    "bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-300",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 disabled:bg-slate-100",
  danger:
    "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed ${variantClassNames[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
