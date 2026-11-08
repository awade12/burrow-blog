'use client';

// Markdown insert/wrap helpers for the editor toolbar. Each helper is
// a pure transform over (value, selectionStart, selectionEnd) so the
// Editor owns the textarea and these stay trivially testable.

export type EditResult = { value: string; start: number; end: number };
export type Transform = (value: string, start: number, end: number) => EditResult;

function wrap(before: string, after: string, placeholder: string): Transform {
  return (value, start, end) => {
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    const selStart = start + before.length;
    return { value: next, start: selStart, end: selStart + selected.length };
  };
}

function insert(text: string, cursorBack = 0): Transform {
  return (value, start, end) => {
    const next = value.slice(0, start) + text + value.slice(end);
    const pos = start + text.length - cursorBack;
    return { value: next, start: pos, end: pos };
  };
}

// Applies fn to every line touched by the selection (headings,
// quotes, lists all work line-wise).
function mapLines(fn: (line: string) => string): Transform {
  return (value, start, end) => {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value.slice(lineStart, lineEnd);
    const mapped = block.split('\n').map(fn).join('\n');
    const next = value.slice(0, lineStart) + mapped + value.slice(lineEnd);
    return { value: next, start: lineStart, end: lineStart + mapped.length };
  };
}

const heading = (level: number): Transform =>
  mapLines((line) => `${'#'.repeat(level)} ${line.replace(/^#{1,6}\s+/, '').replace(/^>\s?/, '')}`);

const quote: Transform = mapLines((line) => (line.startsWith('> ') ? line : `> ${line}`));
const bulletList: Transform = mapLines((line) =>
  line.trim() === '' || line.startsWith('- ') ? line : `- ${line.replace(/^\d+\.\s+/, '')}`,
);

const codeBlock: Transform = (value, start, end) => {
  const selected = value.slice(start, end) || 'code here';
  const before = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
  const block = `${before}\`\`\`\n${selected}\n\`\`\`\n`;
  const next = value.slice(0, start) + block + value.slice(end);
  const selStart = start + before.length + 4;
  return { value: next, start: selStart, end: selStart + selected.length };
};

type Props = { onTransform: (t: Transform) => void };

export default function EditorToolbar({ onTransform }: Props) {
  const link = () => {
    const url = window.prompt('Link URL', 'https://');
    if (!url) return;
    onTransform((value, start, end) => {
      const selected = value.slice(start, end);
      if (selected.startsWith('http')) {
        const text = `[link text](${selected})`;
        const next = value.slice(0, start) + text + value.slice(end);
        return { value: next, start: start + 1, end: start + 10 };
      }
      const text = selected || 'link text';
      const inserted = `[${text}](${url})`;
      const next = value.slice(0, start) + inserted + value.slice(end);
      const pos = start + inserted.length;
      return { value: next, start: pos, end: pos };
    });
  };

  const image = () => {
    const url = window.prompt('Image URL (or a /media/... path)', '/media/');
    if (!url) return;
    const alt = window.prompt('Alt text', '') ?? '';
    onTransform(insert(`![${alt}](${url})`));
  };

  return (
    <>
      <button type="button" className="adm-tool-btn" title="Heading 2" onClick={() => onTransform(heading(2))}>H2</button>
      <button type="button" className="adm-tool-btn" title="Heading 3" onClick={() => onTransform(heading(3))}>H3</button>
      <span className="adm-tool-sep" aria-hidden />
      <button type="button" className="adm-tool-btn" title="Bold" onClick={() => onTransform(wrap('**', '**', 'bold text'))}><strong>B</strong></button>
      <button type="button" className="adm-tool-btn" title="Italic" onClick={() => onTransform(wrap('*', '*', 'italic text'))}><em>I</em></button>
      <button type="button" className="adm-tool-btn" title="Inline code" onClick={() => onTransform(wrap('`', '`', 'code'))}>{'<>'}</button>
      <span className="adm-tool-sep" aria-hidden />
      <button type="button" className="adm-tool-btn" title="Link" onClick={link}>Link</button>
      <button type="button" className="adm-tool-btn" title="Image" onClick={image}>Image</button>
      <button type="button" className="adm-tool-btn" title="Code block" onClick={() => onTransform(codeBlock)}>Block</button>
      <span className="adm-tool-sep" aria-hidden />
      <button type="button" className="adm-tool-btn" title="Quote" onClick={() => onTransform(quote)}>Quote</button>
      <button type="button" className="adm-tool-btn" title="Bullet list" onClick={() => onTransform(bulletList)}>List</button>
    </>
  );
}
