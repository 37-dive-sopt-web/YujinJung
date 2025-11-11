import { createPortal } from "react-dom";

export default function Modal({ open, title, children }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-md p-6 w-[min(92vw,420px)]">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="text-sm text-gray-700">{children}</div>
      </div>
    </div>,
    document.body
  );
}
