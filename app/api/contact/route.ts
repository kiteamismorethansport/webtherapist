import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const contactEmail = process.env.CONTACT_EMAIL;

if (!resendApiKey) {
  console.error('RESEND_API_KEY is not set in environment variables');
}
if (!contactEmail) {
  console.error('CONTACT_EMAIL is not set in environment variables');
}

const resend = new Resend(resendApiKey);

export async function POST(req: Request) {
  try {
    const { name, email, message, lang } = await req.json();

    if (!name || !email || !message) {
      console.warn('Missing fields in contact form:', { name, email, message });
      return NextResponse.json(
        { success: false, error: 'Missing fields' },
        { status: 400 }
      );
    }

    if (!resendApiKey || !contactEmail) {
      console.error('Missing RESEND_API_KEY or CONTACT_EMAIL on server');
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      );
    }

    console.log('Sending contact email via Resend:', {
      to: contactEmail,
      fromVisitor: email,
      name,
      lang,
    });

    await resend.emails.send({
      from: 'Website Contact <onboarding@resend.dev>', // you can change this later to your domain
      to: contactEmail,
      replyTo: email, // ✅ correct property name
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

    console.log('Contact email sent successfully');

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
