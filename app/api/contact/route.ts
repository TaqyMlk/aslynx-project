import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4_000;
const DISCORD_FIELD_LIMIT = 1_024;

function fitDiscordField(value: string, limit: number): string {
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (name.length > MAX_NAME) {
      return NextResponse.json({ error: `Name must be at most ${MAX_NAME} characters.` }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Message must be at most ${MAX_MESSAGE} characters.` },
        { status: 400 }
      );
    }

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (discordWebhookUrl) {
      // Discord embed field values are limited to 1024 chars.
      const payload = {
        embeds: [
          {
            title: 'New Contact Form Submission',
            color: 3447003,
            fields: [
              { name: 'Name', value: fitDiscordField(name.trim(), DISCORD_FIELD_LIMIT), inline: true },
              { name: 'Email', value: fitDiscordField(email.trim(), DISCORD_FIELD_LIMIT), inline: true },
              { name: 'Message', value: fitDiscordField(message.trim(), DISCORD_FIELD_LIMIT) }
            ],
            footer: { text: `Submitted at ${new Date().toISOString()}` }
          }
        ]
      };

      let delivered = false;
      try {
        const res = await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000)
        });
        delivered = res.ok;
      } catch {
        delivered = false;
      }

      if (!delivered) {
        console.error('[contact] Discord webhook delivery failed');
        return NextResponse.json(
          { error: 'Your message could not be delivered right now. Please retry in a moment.' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.'
    });
  } catch (err: unknown) {
    console.error('[contact POST]', err);
    return NextResponse.json({ error: 'Failed to send your message. Please retry.' }, { status: 500 });
  }
}
