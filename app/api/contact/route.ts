import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const contactEmail = process.env.CONTACT_EMAIL;
const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

if (!resendApiKey) {
  console.error('RESEND_API_KEY is not set');
}
if (!contactEmail) {
  console.error('CONTACT_EMAIL is not set');
}
if (!recaptchaSecret) {
  console.error('RECAPTCHA_SECRET_KEY is not set');
}

const resend = new Resend(resendApiKey);

export async function POST(req: Request) {
  try {
    const { name, email, message, lang, captchaToken } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing fields' },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: 'Missing captcha' },
        { status: 400 }
      );
    }

    if (!resendApiKey || !contactEmail || !recaptchaSecret) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      );
    }

    // Verify reCAPTCHA
    const captchaRes = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: captchaToken,
        }),
      }
    );

    const captchaJson = await captchaRes.json();

    if (!captchaJson.success) {
      console.error('reCAPTCHA failed:', captchaJson);
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Website Contact <onboarding@resend.dev>',
      to: contactEmail,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Language:</strong> ${lang ?? 'unknown'}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
