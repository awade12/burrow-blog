import { currentUser } from '@/features/auth/session';
import { renderMarkdown } from '@/lib/markdown/render';
import { assertSameOrigin } from '@/lib/http/security';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await currentUser())) return Response.json({ error: 'unauthorized' }, { status: 401 });
  await assertSameOrigin();
  const { md } = (await req.json()) as { md?: string };
  return Response.json({ html: renderMarkdown(String(md ?? '')) });
}
