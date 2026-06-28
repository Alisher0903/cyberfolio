import type { FormEvent } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export type ContactStatus = 'idle' | 'sending' | 'sent';

interface ContactFormProps {
  data: ContactFormData;
  status: ContactStatus;
  onChange: (data: ContactFormData) => void;
  onSubmit: () => void;
}

const fieldClass =
  'w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-text-primary outline-none transition-colors duration-300 placeholder:text-text-dim focus:border-accent/30';

export function ContactForm({ data, status, onChange, onSubmit }: ContactFormProps) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-8 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-2xl text-accent">
          ✓
        </div>
        <p className="font-mono text-lg text-accent">Message sent!</p>
        <p className="text-center font-mono text-xs text-text-dim">
          I&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <h3 className="mb-6 font-mono text-sm text-accent">$ send_message --encrypted</h3>
      <form onSubmit={submit} className="space-y-4">
        <label className="block font-mono text-xs text-text-dim">
          <span className="mb-2 block">name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={data.name}
            onChange={(event) => onChange({ ...data, name: event.target.value })}
            className={fieldClass}
            placeholder="Alisher Sodiqov"
          />
        </label>

        <label className="block font-mono text-xs text-text-dim">
          <span className="mb-2 block">email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={data.email}
            onChange={(event) => onChange({ ...data, email: event.target.value })}
            className={fieldClass}
            placeholder="hello@company.dev"
          />
        </label>

        <label className="block font-mono text-xs text-text-dim">
          <span className="mb-2 block">message</span>
          <textarea
            required
            rows={5}
            value={data.message}
            onChange={(event) => onChange({ ...data, message: event.target.value })}
            className={`${fieldClass} resize-none`}
            placeholder="I'd love to work together on..."
          />
        </label>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-lg bg-accent py-3 font-mono text-sm font-medium text-bg transition-opacity duration-300 disabled:opacity-70"
        >
          {status === 'sending' ? 'Encrypting...' : 'Send Message →'}
        </button>
      </form>
    </div>
  );
}
