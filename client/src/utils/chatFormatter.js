const INLINE_TOKEN_SOURCE =
  '(`[^`\\n]+`|\\*\\*[^\\s*\\n](?:[^\\n*]*?[^\\s*\\n])?\\*\\*|\\*[^\\s*\\n](?:[^\\n*]*?[^\\s*\\n])?\\*|~[^\\s~\\n](?:[^\\n~]*?[^\\s~\\n])?~|_[^\\s_\\n](?:[^\\n_]*?[^\\s_\\n])?_)';

function isWordBoundedUnderscore(text, start, end) {
  const prev = start > 0 ? text[start - 1] : '';
  const next = end < text.length ? text[end] : '';
  const prevOk = !prev || /[\s(]/.test(prev);
  const nextOk = !next || /[\s.,!?:;)]/.test(next);
  return prevOk && nextOk;
}

/**
 * Pure, non-backtracking inline tokenizer for WhatsApp + Markdown spans.
 * Always creates a fresh RegExp per invocation so recursive formatting never
 * shares or resets a module-level `lastIndex`.
 */
export function tokenizeInline(text, depth = 0) {
  if (!text) return [];
  if (depth >= 4) return [{ type: 'text', value: text }];

  const regex = new RegExp(INLINE_TOKEN_SOURCE, 'g');
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[0].length === 0) {
      regex.lastIndex += 1;
      continue;
    }

    const token = match[0];
    const start = match.index;
    const end = regex.lastIndex;

    // Protect snake_case identifiers like zi_travel_m from italic conversion
    if (token.startsWith('_') && !isWordBoundedUnderscore(text, start, end)) {
      regex.lastIndex = start + 1;
      continue;
    }

    if (start > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, start) });
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      tokens.push({ type: 'code', value: token.slice(1, -1) });
    } else if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push({ type: 'bold', children: tokenizeInline(token.slice(2, -2), depth + 1) });
    } else if (token.startsWith('*') && token.endsWith('*')) {
      tokens.push({ type: 'bold', children: tokenizeInline(token.slice(1, -1), depth + 1) });
    } else if (token.startsWith('~') && token.endsWith('~')) {
      tokens.push({ type: 'strike', children: tokenizeInline(token.slice(1, -1), depth + 1) });
    } else if (token.startsWith('_') && token.endsWith('_')) {
      tokens.push({ type: 'italic', children: tokenizeInline(token.slice(1, -1), depth + 1) });
    } else {
      tokens.push({ type: 'text', value: token });
    }

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
}

/**
 * Splits a chat message into text segments and fenced code blocks.
 */
export function splitCodeBlocks(content) {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const blocks = [];
  const fenceRe = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = fenceRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    blocks.push({
      type: 'code',
      language: match[1],
      value: match[2].replace(/\r?\n$/, '')
    });
    lastIndex = fenceRe.lastIndex;
  }

  if (lastIndex < text.length) {
    blocks.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return blocks;
}
