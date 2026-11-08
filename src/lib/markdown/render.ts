import 'server-only';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

// Server-side Markdown -> sanitised HTML. Post bodies are untrusted
// input (rule 12 in AGENTS.md): raw HTML is stripped by sanitize-html
// after rendering, and link/image URLs are scheme-checked.
const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
  { gfm: true, breaks: false },
);

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = text.replace(/<[^>]+>/g, '');
      const id = plain.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

export type Heading = { depth: number; text: string; id: string };

export function getHeadings(md: string): Heading[] {
  const out: Heading[] = [];
  for (const line of md.split('\n')) {
    const m = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (!m) continue;
    const text = m[2]!.replace(/[*`]/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    out.push({ depth: m[1]!.length, text, id });
  }
  return out;
}

const ALLOWED_TAGS = sanitizeHtml.defaults.allowedTags.concat([
  'img', 'h1', 'h2', 'figure', 'figcaption', 'del', 'input',
]);
const ALLOWED_ATTRS: sanitizeHtml.IOptions['allowedAttributes'] = {
  ...sanitizeHtml.defaults.allowedAttributes,
  '*': ['id'],
  a: ['href', 'name', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  code: ['class'],
  pre: ['class'],
  span: ['class'],
  input: ['type', 'checked', 'disabled'],
};

export function renderMarkdown(md: string): string {
  const html = marked.parse(md) as string;
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => {
        const isExternal = /^https?:\/\//.test(attribs.href ?? '') ;
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal ? { rel: 'noopener noreferrer' } : {}),
          },
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: 'lazy' },
      }),
    },
  });
}

// Cheap reading-time estimate for the byline row.
export function readingTime(md: string): number {
  const words = md.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// First-paragraph excerpt when an author leaves the field blank.
export function autoExcerpt(md: string): string {
  const para = md
    .split(/\n{2,}/)
    .map((p) => p.replace(/[#>*`_-]/g, '').trim())
    .find((p) => p.length > 40);
  if (!para) return '';
  return para.length > 180 ? `${para.slice(0, 177).trim()}...` : para;
}
