import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Renders WhatsApp-style (*bold*, _italic_, ~strike~, `code`, ```block```)
 * as well as fallback Markdown (**bold**, ### headings, bullets) cleanly in chat bubbles.
 */
function ChatCodeSnippet({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  };

  return (
    <div className="my-2 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-900 text-slate-100">
      <div className="px-3 py-1.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-300">
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-100 transition normal-case"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[11px] sm:text-xs font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Match inline code first, then **bold**, *bold*, ~strike~, and word-bounded _italic_
const INLINE_TOKEN_RE =
  /(`[^`\n]+`|\*\*[^\n*](?:[^\n]*?[^\n*])?\*\*|\*[^\s*\n](?:[^\n]*?[^\s*\n])?\*|~[^\s~\n](?:[^\n]*?[^\s~\n])?~|(?:^|(?<=[\s(]))_[^\s_\n](?:[^\n]*?[^\s_\n])?_(?=$|[\s.,!?:;)]))/g;

function renderInlineFormatting(text, isUser) {
  if (!text) return null;
  const parts = [];
  let lastIdx = 0;
  let match;
  let key = 0;

  INLINE_TOKEN_RE.lastIndex = 0;
  while ((match = INLINE_TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key++}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
            isUser
              ? 'bg-sky-700/80 text-white'
              : 'bg-slate-100 dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={key++} className="font-semibold">{renderInlineFormatting(token.slice(2, -2), isUser)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<strong key={key++} className="font-semibold">{renderInlineFormatting(token.slice(1, -1), isUser)}</strong>);
    } else if (token.startsWith('~') && token.endsWith('~')) {
      parts.push(<del key={key++} className="opacity-75">{token.slice(1, -1)}</del>);
    } else if (token.startsWith('_') && token.endsWith('_')) {
      parts.push(<em key={key++} className="italic">{renderInlineFormatting(token.slice(1, -1), isUser)}</em>);
    } else {
      parts.push(token);
    }

    lastIdx = INLINE_TOKEN_RE.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

function renderTextSegment(segment, isUser, segKey) {
  const lines = segment.split(/\r?\n/);
  const nodes = [];
  let listItems = [];
  let listOrdered = false;

  const flushList = (keyPrefix) => {
    if (listItems.length === 0) return;
    const Tag = listOrdered ? 'ol' : 'ul';
    nodes.push(
      <Tag
        key={`${segKey}-list-${keyPrefix}`}
        className={`my-1.5 space-y-1.5 pl-4 ${listOrdered ? 'list-decimal' : 'list-disc'}`}
      >
        {listItems.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInlineFormatting(item, isUser)}
          </li>
        ))}
      </Tag>
    );
    listItems = [];
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushList(idx);
      return;
    }

    if (/^---+$/.test(line)) {
      flushList(idx);
      nodes.push(<hr key={`${segKey}-hr-${idx}`} className="my-2 border-slate-200 dark:border-slate-700" />);
      return;
    }

    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    const standaloneBoldMatch = !headingMatch && line.match(/^(?:\*\*([^*]+)\*\*|\*([^*]+)\*)$/);
    if (headingMatch || standaloneBoldMatch) {
      flushList(idx);
      const headingText = (headingMatch?.[1] || standaloneBoldMatch?.[1] || standaloneBoldMatch?.[2] || '').trim();
      nodes.push(
        <div
          key={`${segKey}-h-${idx}`}
          className={`font-bold text-xs sm:text-sm pt-1.5 pb-0.5 ${
            isUser ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          {renderInlineFormatting(headingText, isUser)}
        </div>
      );
      return;
    }

    const bulletMatch = line.match(/^(?:[-*•])\s+(.+)$/);
    if (bulletMatch) {
      if (listItems.length > 0 && listOrdered) flushList(idx);
      listOrdered = false;
      listItems.push(bulletMatch[1]);
      return;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      if (listItems.length > 0 && !listOrdered) flushList(idx);
      listOrdered = true;
      listItems.push(orderedMatch[1]);
      return;
    }

    flushList(idx);

    if (line.startsWith('>')) {
      const quoteText = line.replace(/^>\s?/, '').replace(/^\[![A-Z]+\]\s*/i, '');
      if (quoteText) {
        nodes.push(
          <blockquote
            key={`${segKey}-q-${idx}`}
            className="my-1.5 pl-3 border-l-2 border-sky-500 text-slate-600 dark:text-slate-300 italic"
          >
            {renderInlineFormatting(quoteText, isUser)}
          </blockquote>
        );
      }
      return;
    }

    nodes.push(
      <p key={`${segKey}-p-${idx}`} className="leading-relaxed">
        {renderInlineFormatting(line, isUser)}
      </p>
    );
  });

  flushList('end');
  return nodes;
}

export function ChatMessageContent({ content, isUser = false }) {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const blocks = [];
  const fenceRe = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = fenceRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push(
        <div key={key++} className="space-y-1">
          {renderTextSegment(text.slice(lastIndex, match.index), isUser, `seg-${key}`)}
        </div>
      );
    }
    blocks.push(
      <ChatCodeSnippet
        key={key++}
        language={match[1]}
        code={match[2].replace(/\r?\n$/, '')}
      />
    );
    lastIndex = fenceRe.lastIndex;
  }

  if (lastIndex < text.length) {
    blocks.push(
      <div key={key++} className="space-y-1">
        {renderTextSegment(text.slice(lastIndex), isUser, `seg-${key}`)}
      </div>
    );
  }

  return <div className="space-y-1.5">{blocks}</div>;
}
