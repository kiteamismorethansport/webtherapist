'use client';

import { useState, FormEvent } from 'react';

type Lang = 'en' | 'ukr' | 'ru';

const TEXTS: Record<
  Lang,
  {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    honeypot: string;
  }
> = {
  en: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send',
    sending: 'Sending…',
    success: 'Thank you! Your message has been sent.',
    error: 'Something went wrong. Please try again.',
    honeypot: "Don’t fill this out if you're human:",
  },
  ru: {
    name: 'Имя',
    email: 'Email',
    message: 'Сообщение',
    send: 'Отправить',
    sending: 'Отправка…',
    success: 'Спасибо! Ваше сообщение отправлено.',
    error: 'Что-то пошло не так. Попробуйте ещё раз.',
    honeypot: 'Не заполняйте это поле, если вы человек:',
  },
  ukr: {
    name: "Ім'я",
    email: 'Email',
    message: 'Повідомлення',
    send: 'Надіслати',
    sending: 'Надсилання…',
    success: 'Дякую! Ваше повідомлення надіслано.',
    error: 'Щось пішло не так. Спробуйте ще раз.',
    honeypot: 'Не заповнюйте це поле, якщо ви людина:',
  },
};

export default function ContactForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const t = TEXTS[lang];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setStatus('submitting');

  const form = e.currentTarget;
  const formData = new FormData(form);

  // Honeypot: if bot-field is filled, silently treat as success
  const botField = formData.get('bot-field');
  if (botField) {
    console.warn('Bot detected, ignoring submission');
    setStatus('success');
    form.reset();
    return;
  }

  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!name || !email || !message) {
    console.warn('Missing form fields:', { name, email, message });
    setStatus('error');
    return;
  }

  console.log('Submitting contact form', { name, email, message, lang });

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message, lang }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      console.warn('Contact API returned non-JSON response');
    }

    console.log('Contact API response:', res.status, data);

    if (res.ok && data?.success) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
    }
  } catch (err) {
    console.error('Contact fetch error:', err);
    setStatus('error');
  }
}

  return (
    <div>
      {status === 'success' && (
        <div className="mb-4 rounded-xl border bg-green-50 text-green-800 p-3 text-sm">
          {t.success}
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 rounded-xl border bg-red-50 text-red-800 p-3 text-sm">
          {t.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Was for Netlify; no longer needed */}
        {/* <input type="hidden" name="form-name" value="contact" /> */}

        {/* Honeypot */}
        <p className="hidden">
          <label>
            {t.honeypot}{' '}
            <input name="bot-field" />
          </label>
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t.name}
          </label>
          <input
            name="name"
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t.email}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t.message}
          </label>
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
          {status === 'submitting' ? t.sending : t.send}
        </button>
      </form>
    </div>
  );
}
