import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getMessages, getFacts, getSessions } from '@/src/server/agent/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || 'default-session';
    const type = searchParams.get('type') || 'all';

    const workbook = XLSX.utils.book_new();

    if (type === 'facts' || type === 'all') {
      const facts = await getFacts();
      const factsData = facts.map((f) => ({
        ID: f.id,
        Key: f.key,
        Value: f.value,
        Category: f.category,
        Tags: f.tags.join(', '),
        'Updated At': new Date(f.updatedAt).toLocaleString('id-ID')
      }));
      const factsSheet = XLSX.utils.json_to_sheet(factsData);
      XLSX.utils.book_append_sheet(workbook, factsSheet, 'Memory Facts');
    }

    if (type === 'chat' || type === 'all') {
      const messages = await getMessages(sessionId);
      const chatData = messages.map((m) => ({
        ID: m.id,
        Role: m.role.toUpperCase(),
        Content: m.content,
        'Model Used': m.modelUsed || 'N/A',
        Provider: m.provider || 'N/A',
        'Latency (ms)': m.latencyMs || 0,
        Time: new Date(m.timestamp).toLocaleString('id-ID')
      }));
      const chatSheet = XLSX.utils.json_to_sheet(chatData.length > 0 ? chatData : [{ Status: 'No messages found in session' }]);
      XLSX.utils.book_append_sheet(workbook, chatSheet, 'Chat History');
    }

    if (type === 'all') {
      const sessions = await getSessions();
      const sessionData = sessions.map((s) => ({
        'Session ID': s.id,
        Title: s.title,
        'Messages Count': s.messageCount,
        'Created At': new Date(s.createdAt).toLocaleString('id-ID'),
        'Updated At': new Date(s.updatedAt).toLocaleString('id-ID')
      }));
      const sessionSheet = XLSX.utils.json_to_sheet(sessionData);
      XLSX.utils.book_append_sheet(workbook, sessionSheet, 'Sessions');
    }

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="aslynx_agent_export_${Date.now()}.xlsx"`
      }
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to export agent data to Excel', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}