import { useId } from 'react';

interface EditorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

const inputClass =
  'w-full rounded-md border border-border bg-bg px-2.5 py-2 text-[13px] text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent/30';

export function EditorField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
}: EditorFieldProps) {
  const id = useId();

  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="mb-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={3}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} resize-y leading-normal`}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
}
