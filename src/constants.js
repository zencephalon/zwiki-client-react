export const OMNI_SEARCH = 'omni_search';
export const EDITOR = 'editor';
export const ROOT = 'root';

export const zeroWidthNonJoiner = '‌';

// From Slimdown
// export const LINK_REGEX_NO_G = /\[([^[]+)\]\(([^)]+)\)/;
// export const LINK_AND_IMPORT_REGEX = /(\[([^[]+)\]|\{([^{]+)\})\(([^)]+)\)/g;
// export const LINK_AND_IMPORT_REGEX_NO_G = /(\[([^[]+)\]|\{([^{]+)\})\(([^)]+)\)/;

const leftBraceBracket = String.raw`(?:\{|\[)`;
const rightBraceBracket = String.raw`(?:\}|\])`;
const innerTextCapture = String.raw`([^[{]+)`;

const braceCapture = String.raw`\{([^{]+)\}`;
const bracketCapture = String.raw`\[([^[]+)\]`;
const parenCapture = String.raw`\(([^)]+)\)`;
export const LINK_REGEX_NO_G = RegExp(`${bracketCapture}${parenCapture}`);
export const LINK_REGEX = RegExp(`${bracketCapture}${parenCapture}`, 'g');

export const IMPORT_REGEX_NO_G = RegExp(`${braceCapture}${parenCapture}`);
export const IMPORT_REGEX = RegExp(`${braceCapture}${parenCapture}`, 'g');

export const LINK_AND_IMPORT_REGEX = RegExp(
  `${leftBraceBracket}${innerTextCapture}${rightBraceBracket}${parenCapture}`,
  'g'
);
export const LINK_AND_IMPORT_REGEX_NO_G = RegExp(
  `${leftBraceBracket}${innerTextCapture}${rightBraceBracket}${parenCapture}`
);

export const NOT_DONE_TODO = '☐';
export const DONE_TODO = '☑';
