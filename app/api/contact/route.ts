import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // In production, integrate with an email service like Resend, SendGrid, etc.
    // For now, we'll just log it
    console.log('Contact form submission:', { name, email, message });

    // TODO: Send email to coach
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@coachly.com',
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `New contact form submission from ${name}`,
    //   html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message}</p>`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
