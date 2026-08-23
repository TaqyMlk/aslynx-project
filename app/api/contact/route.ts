import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (discordWebhookUrl) {
      const title = 'New Contact Form Submission';
      const color = 3447003;
      const payload = {
        embeds: [
          {
            title,
            color,
            fields: [
              { name: 'Name', value: name.trim(), inline: true },
              { name: 'Email', value: email.trim(), inline: true },
              { name: 'Message', value: message.trim() }
            ],
            footer: { text: `Submitted at ${new Date().toISOString()}` }
          }
        ]
      };

      try {
        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000)
        });
      } catch {
        // If Discord delivery fails, continue and return success to user
      }
    }

    return NextResponse.json({ success: true, message: 'Thank you for your message. We will get back to you soon.' });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to send message', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}