import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Website Contact <onboarding@resend.dev>', // later you can change this to your domain
      to: process.env.CONTACT_EMAIL as string,
      replyTo: email, // so you can reply directly to the client
      subject: `New contact form message from ${name}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
