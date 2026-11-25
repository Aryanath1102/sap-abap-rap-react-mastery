import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { splitCodeBlocks, tokenizeInline } from '../utils/chatFormatter';

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

function renderTokens(tokens, isUser, prefix = 't') {
  return tokens.map((tok, idx) => {
    const key = `${prefix}-${idx}`;
    if (tok.type === 'text') return tok.value;
    if (tok.type === 'code') {
      return (
        <code
          key={key}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
            isUser
              ? 'bg-sky-700/80 text-white'
              : 'bg-slate-100 dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          {tok.value}
        </code>
      );
    }
    if (tok.type === 'bold') {
      return <strong key={key} className="font-semibold">{renderTokens(tok.children, isUser, key)}</strong>;
    }
    if (tok.type === 'italic') {
      return <em key={key} className="italic">{renderTokens(tok.children, isUser, key)}</em>;
    }
    if (tok.type === 'strike') {
      return <del key={key} className="opacity-75">{renderTokens(tok.children, isUser, key)}</del>;
    }
    return null;
  });
}

function renderInlineFormatting(text, isUser) {
  return renderTokens(tokenizeInline(text), isUser);
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
  const blocks = splitCodeBlocks(content);
  return (
    <div className="space-y-1.5">
      {blocks.map((block, idx) =>
        block.type === 'code' ? (
          <ChatCodeSnippet key={idx} language={block.language} code={block.value} />
        ) : (
          <div key={idx} className="space-y-1">
            {renderTextSegment(block.value, isUser, `seg-${idx}`)}
          </div>
        )
      )}
    </div>
  );
}
