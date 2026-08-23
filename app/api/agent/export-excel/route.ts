import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { getMessages, getFacts, getSessions } from '@/src/server/agent/store';
import { isValidSessionId } from '@/src/server/agent/validation';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MAX_EXPORT_ROWS = 5_000;

/**
 * Neutralizes spreadsheet formula injection: a cell whose value starts with
 * = + - @ would otherwise be evaluated by Excel/LibreOffice on open.
 */
function safeCell(value: string): string {
  if (/^[=+\-\t\r@\[]/.test(value)) {
    return `'${value}`;
  }
  return value;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionIdParam = searchParams.get('sessionId') || '';
    const type = searchParams.get('type') || 'all';

    if (type === 'chat' || type === 'all') {
      if (!isValidSessionId(sessionIdParam)) {
        return NextResponse.json({ error: 'A valid sessionId is required.' }, { status: 400 });
      }
    }

    const workbook = new ExcelJS.Workbook();

    if (type === 'facts' || type === 'all') {
      const sheet = workbook.addWorksheet('Memory Facts');
      sheet.columns = [
        { header: 'ID', key: 'id', width: 26 },
        { header: 'Key', key: 'key', width: 26 },
        { header: 'Value', key: 'value', width: 60 },
        { header: 'Category', key: 'category', width: 14 },
        { header: 'Tags', key: 'tags', width: 28 },
        { header: 'Updated At', key: 'updatedAt', width: 22 }
      ];
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1a1d23' } };

      const facts = (await getFacts()).slice(0, MAX_EXPORT_ROWS);
      for (const f of facts) {
        sheet.addRow({
          id: safeCell(f.id),
          key: safeCell(f.key),
          value: safeCell(f.value),
          category: safeCell(f.category),
          tags: safeCell(f.tags.join(', ')),
          updatedAt: new Date(f.updatedAt).toLocaleString('id-ID')
        });
      }
      if (!facts.length) sheet.addRow({ id: '', key: '', value: 'No memory facts stored', category: '', tags: '', updatedAt: '' });
    }

    if (type === 'chat' || type === 'all') {
      const sheet = workbook.addWorksheet('Chat History');
      sheet.columns = [
        { header: 'ID', key: 'id', width: 26 },
        { header: 'Role', key: 'role', width: 12 },
        { header: 'Content', key: 'content', width: 60 },
        { header: 'Model Used', key: 'modelUsed', width: 22 },
        { header: 'Provider', key: 'provider', width: 16 },
        { header: 'Latency (ms)', key: 'latencyMs', width: 14 },
        { header: 'Time', key: 'time', width: 22 }
      ];
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1a1d23' } };

      const messages = (await getMessages(sessionIdParam)).slice(0, MAX_EXPORT_ROWS);
      for (const m of messages) {
        sheet.addRow({
          id: safeCell(m.id),
          role: safeCell(m.role.toUpperCase()),
          content: safeCell(m.content),
          modelUsed: safeCell(m.modelUsed || 'N/A'),
          provider: safeCell(m.provider || 'N/A'),
          latencyMs: m.latencyMs || 0,
          time: new Date(m.timestamp).toLocaleString('id-ID')
        });
      }
      if (!messages.length) sheet.addRow({ id: '', role: '', content: 'No messages found in session', modelUsed: '', provider: '', latencyMs: 0, time: '' });
    }

    if (type === 'all') {
      const sheet = workbook.addWorksheet('Sessions');
      sheet.columns = [
        { header: 'Session ID', key: 'sessionId', width: 36 },
        { header: 'Title', key: 'title', width: 32 },
        { header: 'Messages Count', key: 'messageCount', width: 16 },
        { header: 'Created At', key: 'createdAt', width: 22 },
        { header: 'Updated At', key: 'updatedAt', width: 22 }
      ];
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1a1d23' } };

      const sessions = (await getSessions()).slice(0, MAX_EXPORT_ROWS);
      for (const s of sessions) {
        sheet.addRow({
          sessionId: safeCell(s.id),
          title: safeCell(s.title),
          messageCount: s.messageCount,
          createdAt: new Date(s.createdAt).toLocaleString('id-ID'),
          updatedAt: new Date(s.updatedAt).toLocaleString('id-ID')
        });
      }
      if (!sessions.length) sheet.addRow({ sessionId: '', title: 'No sessions stored', messageCount: 0, createdAt: '', updatedAt: '' });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="aslynx_agent_export_${Date.now()}.xlsx"`
      }
    });
  } catch (err: unknown) {
    console.error('[agent/export-excel GET]', err);
    return NextResponse.json({ error: 'Failed to export agent data. Please retry.' }, { status: 500 });
  }
}