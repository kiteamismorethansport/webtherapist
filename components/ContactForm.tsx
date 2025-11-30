'use client';

import { useState, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

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
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    captchaRequired: string;
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
    nameRequired: 'Please enter your name.',
    emailRequired: 'Please enter your email.',
    emailInvalid: 'Please enter a valid email address.',
    messageRequired: 'Please enter a message (at least 10 characters).',
    captchaRequired: 'Please confirm you are not a robot.',
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
    nameRequired: 'Пожалуйста, введите имя.',
    emailRequired: 'Пожалуйста, введите email.',
    emailInvalid: 'Пожалуйста, введите корректный email.',
    messageRequired: 'Пожалуйста, введите сообщение (минимум 10 символов).',
    captchaRequired: 'Пожалуйста, подтвердите, что вы не робот.',
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
    nameRequired: "Будь ласка, введіть ім'я.",
    emailRequired: 'Будь ласка, введіть email.',
    emailInvalid: 'Будь ласка, введіть коректний email.',
    messageRequired: 'Будь ласка, введіть повідомлення (мінімум 10 символів).',
    captchaRequired: 'Будь ласка, підтвердіть, що ви не робот.',
  },
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Errors = {
  name?: string;
  email?: string;
  message?: string;
  captcha?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

export default function ContactForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const t = TEXTS[lang];

  console.log('ContactForm rendered with lang:', lang);

  function validate(formData: FormData): boolean {
    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';

    const newErrors: Errors = {};

    if (!name) newErrors.name = t.nameRequired;
    if (!email) {
      newErrors.email = t.emailRequired;
    } else if (!emailRegex.test(email)) {
      newErrors.email = t.emailInvalid;
    }

    if (!message || message.length < 10) {
      newErrors.message = t.messageRequired;
    }

    if (!captchaToken) {
      newErrors.captcha = t.captchaRequired;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('handleSubmit called');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot
    const botField = formData.get('bot-field');
    if (botField) {
      console.warn('Bot detected, ignoring submission');
      setStatus('success');
      form.reset();
      return;
    }

    if (!validate(formData)) {
      console.warn('Validation failed');
      return;
    }

    setStatus('submitting');

    const name = formData.get('name')!.toString().trim();
    const email = formData.get('email')!.toString().trim();
    const message = formData.get('message')!.toString().trim();

    console.log('Submitting contact form', { name, email, message, lang });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, lang, captchaToken }),
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
        setErrors({});
        setCaptchaToken(null);
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

      <form
        onSubmit={handleSubmit}
        method="POST"
        noValidate
        className="space-y-4 max-w-lg"
      >
        {/* Honeypot */}
        <p className="hidden">
          <label>
            {t.honeypot}{' '}
            <input name="bot-field" />
          </label>
        </p>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t.name}
          </label>
          <input
            name="name"
            className="w-full rounded-lg border px-3 py-2"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t.email}
          </label>
          <input
            type="email"
            name="email"
            className="w-full rounded-lg border px-3 py-2"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t.message}
          </label>
          <textarea
            name="message"
            rows={6}
            className="w-full rounded-lg border px-3 py-2"
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        {/* reCAPTCHA */}
        {siteKey ? (
          <div>
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={(token) => {
                setCaptchaToken(token);
                setErrors((prev) => ({ ...prev, captcha: undefined }));
              }}
            />
            {errors.captcha && (
              <p className="mt-1 text-xs text-red-600">{errors.captcha}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-red-600">
            reCAPTCHA site key is not configured.
          </p>
        )}

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
