import React from 'react';

// Agent answers are markdown, and may carry Zwiki's two custom inline forms:
// [Text](short_id) links and {Text}(short_id) embeds. short_ids are arbitrary
// Unicode and are not URLs, so those render as node chips rather than anchors.
const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))|(\{[^}]+\}\([^)]+\))/g;
const REF = /^[[{]([^\]}]+)[\]}]\(([^)]+)\)$/;
const isUrl = (target) => /^(https?:\/\/|mailto:|\/)/.test(target);

const inline = (text) => {
  const out = [];
  let last = 0;
  let match;
  INLINE.lastIndex = 0;

  const push = (node) => out.push(<React.Fragment key={out.length}>{node}</React.Fragment>);

  // eslint-disable-next-line no-cond-assign
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) push(text.slice(last, match.index));
    const token = match[0];

    if (token.startsWith('`')) {
      push(<code>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**')) {
      push(<strong>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      push(<em>{token.slice(1, -1)}</em>);
    } else {
      const [, label, target] = token.match(REF);
      push(
        isUrl(target) ? (
          <a href={target} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          <span className="node-ref" title={target}>
            {label}
          </span>
        )
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) push(text.slice(last));
  return out;
};

const HEADING = /^(#{1,6})\s+(.*)$/;
const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBER = /^\s*\d+[.)]\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;

const blocks = (source) => {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const key = () => out.length;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(
        <pre key={key()}>
          <code>{code.join('\n')}</code>
        </pre>
      );
    } else if (HEADING.test(line)) {
      const [, hashes, text] = line.match(HEADING);
      const Tag = `h${Math.min(hashes.length + 2, 6)}`;
      out.push(<Tag key={key()}>{inline(text)}</Tag>);
      i += 1;
    } else if (BULLET.test(line) || NUMBER.test(line)) {
      const ordered = !BULLET.test(line);
      const items = [];
      while (
        i < lines.length &&
        (ordered ? NUMBER.test(lines[i]) : BULLET.test(lines[i]))
      ) {
        items.push(lines[i].match(ordered ? NUMBER : BULLET)[1]);
        i += 1;
      }
      const List = ordered ? 'ol' : 'ul';
      out.push(
        <List key={key()}>
          {items.map((item, n) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={n}>{inline(item)}</li>
          ))}
        </List>
      );
    } else if (QUOTE.test(line)) {
      const quoted = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        quoted.push(lines[i].match(QUOTE)[1]);
        i += 1;
      }
      out.push(<blockquote key={key()}>{inline(quoted.join(' '))}</blockquote>);
    } else if (line.trim() === '') {
      i += 1;
    } else {
      const para = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !HEADING.test(lines[i]) &&
        !BULLET.test(lines[i]) &&
        !NUMBER.test(lines[i]) &&
        !QUOTE.test(lines[i]) &&
        !lines[i].trim().startsWith('```')
      ) {
        para.push(lines[i]);
        i += 1;
      }
      out.push(<p key={key()}>{inline(para.join(' '))}</p>);
    }
  }

  return out;
};

const Markdown = ({ source }) => <div className="markdown">{blocks(source || '')}</div>;

export default Markdown;
