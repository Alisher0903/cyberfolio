import type { ReactNode } from 'react';

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 w-full rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-[10px] text-text-dim transition-colors hover:border-accent hover:text-accent"
    >
      + {children}
    </button>
  );
}

export function EditorCard({ onRemove, children }: { onRemove: () => void; children: ReactNode }) {
  return (
    <div className="relative mb-3 rounded-lg border border-border bg-bg p-3">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 px-1.5 py-0.5 font-mono text-[10px] text-danger"
        aria-label="Remove item"
      >
        ✕
      </button>
      {children}
    </div>
  );
}
