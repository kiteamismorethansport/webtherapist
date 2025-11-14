'use client';

import { useState, FormEvent } from 'react';

type Lang = 'en' | 'ukr' | 'ru';

export default function ContactForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Netlify looks at form-name for routing
    if (!formData.has('form-name')) {
      formData.append('form-name', 'contact');
    }

    try {
      await fetch('/__forms.html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData as any).toString(),
      });

      setStatus('success');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <div>
      {status === 'success' && (
        <div className="mb-4 rounded-xl border bg-green-50 text-green-800 p-3 text-sm">
          Thank you! Your message has been sent.
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 rounded-xl border bg-red-50 text-red-800 p-3 text-sm">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* hidden form name so Netlify knows which form */}
        <input type="hidden" name="form-name" value="contact" />

        {/* simple honeypot field */}
        <p className="hidden">
          <label>
            Don’t fill this out if you're human: <input name="bot-field" />
          </label>
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            name="message"
            required
            rows={6}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-full px-5 py-3 border border-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
