/**
 * Turns a repository README into a short plain-text summary (for project
 * cards) and a few case-study sections (for the project page).
 *
 * READMEs are written for developers, so the digest skips what a portfolio
 * visitor does not need: badges, images, code blocks, tables of contents and
 * setup instructions. It returns `summary: null` when the README has no real
 * descriptive paragraph (for example a README that is only a title), so the
 * caller can fall back to the description written in the CMS.
 */

export type ReadmeSection = { heading: string; body: string };
export type ReadmeDigest = {
  summary: string | null;
  sections: ReadmeSection[];
};

const SUMMARY_MAX = 300;
const SECTION_MAX = 700;
const BULLET_MAX = 160;
const MAX_BULLETS = 8;
const MAX_SECTIONS = 5;

type Paragraph = { kind: 'paragraph'; text: string };
type List = { kind: 'list'; items: string[] };
type Table = { kind: 'table'; rows: string[][] };
type Block = Paragraph | List | Table;
type Section = { level: number; heading: string; blocks: Block[] };

type SectionKind =
  'overview' | 'features' | 'stack' | 'architecture' | 'testing' | 'role';

const SECTION_ORDER: SectionKind[] = [
  'overview',
  'features',
  'stack',
  'architecture',
  'testing',
  'role',
];

const SKIP_HEADING =
  /\b(contents|table of contents|getting started|quick ?start|install(ation)?|set ?up|prerequisites?|requirements|environment|env vars|configuration|usage|running|run locally|run the tests|scripts|commands|licen[cs]e|contribut\w*|troubleshoot\w*|demo accounts?|credentials|deploy\w*|faq|acknowledg\w*|contact|support|screenshots?|authors?|team|roadmap|changelog|folder|structure|directory|links?|next steps|known issues|optional services|required services|api keys?)\b/i;

const KIND_PATTERNS: Array<[SectionKind, RegExp]> = [
  [
    'overview',
    /\b(overview|about|introduction|intro|summary|description|what is|why|the problem|problem)\b/i,
  ],
  [
    'features',
    /\b(features?|capabilities|highlights|functionality|what it does|what you can do)\b/i,
  ],
  [
    'stack',
    /\b(tech(nology)? stack|technolog(y|ies)|built with|stack|tools)\b/i,
  ],
  [
    'architecture',
    /\b(architecture|system design|design decisions|key decisions|how it works)\b/i,
  ],
  ['testing', /\b(test(s|ing)?|quality)\b/i],
  ['role', /\b(my role|what i built|contributions?|responsibilit(y|ies))\b/i],
];

const LABEL_LINE =
  /^(links?|stack|tech stack|tagline|status|note|see|licen[cs]e|demo|live demo|built with|repository|repo|docs|documentation)\s*[:—–-]/i;

export function digestReadme(markdown: string): ReadmeDigest {
  const sections = parseSections(markdown);
  return { summary: pickSummary(sections), sections: pickSections(sections) };
}

// ---- summary -----------------------------------------------------------------

function pickSummary(sections: Section[]): string | null {
  const firstSubsection = sections.findIndex((section) => section.level >= 2);
  const intro =
    firstSubsection === -1 ? sections : sections.slice(0, firstSubsection);
  const overview = sections.filter(
    (section) =>
      section.level >= 2 && sectionKind(section.heading) === 'overview',
  );
  const name = projectName(sections);
  const worthy = (blocks: Block[]) =>
    blocks.filter(
      (block): block is Paragraph =>
        block.kind === 'paragraph' && summaryWorthy(block.text),
    );
  const introParagraphs = worthy(intro.flatMap((section) => section.blocks));
  const candidates = [
    ...introParagraphs,
    ...worthy(overview.flatMap((section) => section.blocks)),
  ];
  // Prefer the opening paragraph, or one that says what the project is
  // ("BenchBook gives …"), over a slogan ("Empowering students …") or a
  // problem statement. Ties go to the earlier paragraph.
  let best: Paragraph | null = null;
  let bestScore = -Infinity;
  for (const paragraph of candidates) {
    const score =
      summaryScore(paragraph.text, name) +
      (paragraph === introParagraphs[0] ? 2 : 0);
    if (score > bestScore) {
      best = paragraph;
      bestScore = score;
    }
  }
  return best ? truncateAtSentence(best.text, SUMMARY_MAX) : null;
}

function projectName(sections: Section[]): string | null {
  const title = sections.find((section) => section.level === 1)?.heading ?? '';
  const word = title
    .split(/[\s—–:|-]+/)
    .find((part) => part.replace(/[^\p{L}\p{N}]/gu, '').length >= 4);
  return word ? word.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase() : null;
}

function summaryScore(text: string, name: string | null): number {
  let score = 0;
  if (name && text.slice(0, 60).toLowerCase().includes(name)) score += 2;
  if (/^[A-Z][a-z]+ing\b/.test(text)) score -= 1;
  return score;
}

function summaryWorthy(text: string): boolean {
  const words = text.split(/\s+/).filter(Boolean);
  if (text.length < 70 || words.length < 12) return false;
  if (!/[.!?](\s|$)/.test(text) && text.length < 140) return false;
  if (LABEL_LINE.test(text)) return false;
  // A row of links ("Docs · Demo · Report") is navigation, not a description.
  return (text.match(/ [·|•] /g) ?? []).length < 3;
}

// ---- case-study sections ---------------------------------------------------

function pickSections(sections: Section[]): ReadmeSection[] {
  const picked = new Map<SectionKind, ReadmeSection>();
  sections.forEach((section, index) => {
    if (section.level < 2) return;
    const kind = sectionKind(section.heading);
    if (!kind || picked.has(kind)) return;
    const body = sectionBody(section, childSections(sections, index), kind);
    // Short bodies are usually leftovers ("See below:"), but a bullet list is content.
    if (body.length >= 40 || (body.startsWith('•') && body.length >= 20)) {
      picked.set(kind, { heading: displayHeading(section.heading), body });
    }
  });
  return SECTION_ORDER.filter((kind) => picked.has(kind))
    .map((kind) => picked.get(kind)!)
    .slice(0, MAX_SECTIONS);
}

function sectionKind(heading: string): SectionKind | null {
  if (SKIP_HEADING.test(heading)) return null;
  return (
    KIND_PATTERNS.find(([, pattern]) => pattern.test(heading))?.[0] ?? null
  );
}

/** Sections nested directly under a section, e.g. "### 1. Role-based portals". */
function childSections(sections: Section[], index: number): Section[] {
  const parent = sections[index];
  const children: Section[] = [];
  for (
    let i = index + 1;
    i < sections.length && sections[i].level > parent.level;
    i += 1
  ) {
    if (sections[i].level === parent.level + 1) children.push(sections[i]);
  }
  return children;
}

/**
 * One bullet per sub-heading: "Admin — User management, Event oversight".
 * For a tech stack the values matter more than the labels:
 * "Frontend — React 19, Vite 8" rather than "Frontend — Framework, Build tool".
 */
function childBullets(children: Section[], kind: SectionKind): string[] {
  return children.map((child) => {
    const items = child.blocks.flatMap((block) => {
      if (block.kind === 'list') return block.items;
      if (block.kind === 'table') return tableBullets(block);
      return [];
    });
    const labels = items
      .map(itemLabel)
      .filter((label): label is string => Boolean(label));
    const values = items
      .map(itemValue)
      .filter((value): value is string => Boolean(value));
    const paragraph = child.blocks.find(
      (block): block is Paragraph =>
        block.kind === 'paragraph' && !block.text.endsWith(':'),
    );
    let detail = '';
    if (kind === 'stack' && values.length) {
      detail = values
        .slice(0, 4)
        .map((value) => truncateAtWord(shortTechName(value), 36))
        .join(', ');
    } else if (labels.length >= 2) detail = labels.slice(0, 4).join(', ');
    else if (items.length) {
      // Short items ("React.js", "Redux Toolkit") read well as a list;
      // long ones are sentences, so keep just the first.
      detail = items.every((item) => item.length <= 40)
        ? items.slice(0, 4).join(', ')
        : truncateAtWord(items[0], 90);
    } else if (paragraph) detail = firstSentence(paragraph.text);
    return detail ? `${child.heading} — ${detail}` : child.heading;
  });
}

const LABEL_SEPARATOR = /^([^:—–]{2,40}?)\s*(?::|—|–| - )\s*(\S.*)$/;

function itemLabel(item: string): string | null {
  return item.match(LABEL_SEPARATOR)?.[1].trim() ?? null;
}

/** "Vite 8 with Fast Refresh (HMR)" -> "Vite 8" for compact stack bullets. */
function shortTechName(value: string): string {
  return value.split(/\s+(?:with|using|via|executed|for)\s+|\s*[(;]/)[0].trim();
}

function itemValue(item: string): string | null {
  return item.match(LABEL_SEPARATOR)?.[2].trim() ?? null;
}

function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

function sectionBody(
  section: Section,
  children: Section[],
  kind: SectionKind,
): string {
  const paragraphs = section.blocks.filter(
    (block): block is Paragraph => block.kind === 'paragraph',
  );
  const lists = section.blocks.filter(
    (block): block is List => block.kind === 'list',
  );
  const tables = section.blocks.filter(
    (block): block is Table => block.kind === 'table',
  );

  let bullets = lists.flatMap((list) => list.items);
  if (!bullets.length && tables.length) bullets = tableBullets(tables[0]);
  if (!bullets.length && kind !== 'overview')
    bullets = childBullets(children, kind);
  // A bare label ("Connection string:") introduced a code block that was removed.
  bullets = bullets.filter((item) => !item.endsWith(':'));

  const prose = paragraphs
    .filter((paragraph) => !LABEL_LINE.test(paragraph.text))
    // A lead-in such as "Run the suite:" only introduced a removed code block.
    .filter((paragraph) => bullets.length > 0 || !paragraph.text.endsWith(':'))
    .slice(0, bullets.length ? 1 : 2)
    .map((paragraph) => paragraph.text)
    .join('\n\n');
  const list = bullets
    .slice(0, MAX_BULLETS)
    .map((item) => `• ${truncateAtWord(item, BULLET_MAX)}`)
    .join('\n');
  const body = [truncateAtSentence(prose, SECTION_MAX), list]
    .filter(Boolean)
    .join('\n\n');
  return body.trim();
}

function tableBullets(table: Table): string[] {
  const [, ...rows] = table.rows; // first row is the header
  return rows
    .map((cells) => cells.filter(Boolean))
    .filter((cells) => cells.length > 0)
    .map((cells) =>
      cells.length > 1 ? `${cells[0]} — ${cells[1]}` : cells[0],
    );
}

function displayHeading(heading: string): string {
  const text = heading.length > 60 ? truncateAtWord(heading, 60) : heading;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ---- markdown parsing -------------------------------------------------------

function parseSections(markdown: string): Section[] {
  const sections: Section[] = [{ level: 0, heading: '', blocks: [] }];
  const current = () => sections[sections.length - 1];
  let paragraph: string[] = [];
  let list: string[] | null = null;
  let table: string[][] | null = null;
  let fence: string | null = null;

  const flush = () => {
    if (paragraph.length) {
      const text = paragraphText(paragraph);
      if (text) current().blocks.push({ kind: 'paragraph', text });
      paragraph = [];
    }
    if (list?.length) current().blocks.push({ kind: 'list', items: list });
    if (table?.length) current().blocks.push({ kind: 'table', rows: table });
    list = null;
    table = null;
  };

  const source = markdown
    .replace(/\r\n?/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '');
  for (const rawLine of source.split('\n')) {
    const fenceMatch = rawLine.match(/^\s*(```|~~~)/);
    if (fence) {
      if (fenceMatch && fenceMatch[1] === fence) fence = null;
      continue;
    }
    if (fenceMatch) {
      flush();
      fence = fenceMatch[1];
      continue;
    }

    const line = rawLine.replace(/^\s{0,3}(>\s?)+/, '');
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flush();
      sections.push({
        level: heading[1].length,
        heading: cleanHeading(heading[2]),
        blocks: [],
      });
      continue;
    }
    if (!line.trim() || /^\s*([-*_=])(\s*\1){2,}\s*$/.test(line)) {
      flush();
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      if (paragraph.length || list) flush();
      if (/^\s*\|?(\s*:?-{2,}:?\s*\|)+\s*:?-*:?\s*\|?\s*$/.test(line)) continue;
      table ??= [];
      table.push(
        line
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((cell) => cleanInline(cell)),
      );
      continue;
    }
    const item = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (item) {
      if (paragraph.length || table) flush();
      list ??= [];
      // Only top-level bullets; nested detail stays on GitHub.
      if (item[1].length < 2) {
        const text = cleanInline(item[3]);
        if (text) list.push(text);
      }
      continue;
    }
    if (list && /^\s{2,}\S/.test(line)) continue; // continuation of a list item
    if (list || table) flush();
    if (isTagline(line)) {
      // A standalone bold/italic line is a tagline, not part of the description.
      if (paragraph.length) flush();
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return sections;
}

function paragraphText(lines: string[]): string {
  return cleanInline(lines.join(' '));
}

function isTagline(line: string): boolean {
  const trimmed = line.trim().replace(/\\$/, '').trim();
  return (
    /^(\*\*|__)[^*_]+\1$/.test(trimmed) || /^[*_][^*_]+[*_]$/.test(trimmed)
  );
}

function cleanHeading(text: string): string {
  return cleanInline(text)
    .replace(/^(\d+(\.\d+)*[.)]?|[IVX]+\.)\s+/, '')
    .replace(/[:\s]+$/, '')
    .trim();
}

export function cleanInline(text: string): string {
  return text
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[\s*\]\([^)]*\)/g, '') // links left empty by removed badges
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1') // reference links
    .replace(/<(https?:\/\/[^>\s]+)>/g, '$1')
    .replace(/<\/?[a-zA-Z][^>]*>/g, '') // html tags
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,;:!?]|$)/g, '$1$2')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\(?=\s|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---- truncation -------------------------------------------------------------

export function truncateAtSentence(text: string, max: number): string {
  if (text.length <= max) return text;
  const window = text.slice(0, max);
  const end = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('! '),
    window.lastIndexOf('? '),
  );
  if (end >= max * 0.5) return window.slice(0, end + 1);
  return truncateAtWord(text, max);
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.5 ? cut.slice(0, space) : cut).replace(/[\s,;:—–-]+$/, '')}…`;
}
