"use client";

/** Submit button that asks before a destructive action. */
export default function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button className="sbtn danger" type="submit" onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
