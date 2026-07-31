import { API_BASE } from '~/apis/api';

// The agent runs a synchronous tool loop of up to 12 model round trips, so this
// has to outlast anything a normal fetch would tolerate.
const TIMEOUT_MS = 180000;

export class AgentError extends Error {
  constructor(message, { status, toolCalls, retryAfter, aborted } = {}) {
    super(message);
    this.name = 'AgentError';
    this.status = status;
    this.toolCalls = toolCalls || [];
    this.retryAfter = retryAfter;
    this.aborted = !!aborted;
  }
}

const parse = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

const messageFor = (status, body) => {
  if (status === 401) return 'Your session expired. Sign in again.';
  if (status === 429) return 'Rate limited. Wait a moment and retry.';
  if (status === 502) return 'The model API failed. Worth retrying.';
  if (body && typeof body === 'object' && body.error) return body.error;
  if (typeof body === 'string' && body) return body;
  return `Request failed (${status})`;
};

export const askAgent = async (query, controller = new AbortController()) => {
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_BASE}agent`, {
      method: 'post',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ query }),
    });
  } catch (e) {
    throw new AgentError(
      controller.signal.aborted
        ? 'Cancelled.'
        : 'Could not reach the server.',
      { aborted: controller.signal.aborted }
    );
  } finally {
    clearTimeout(timer);
  }

  const body = parse(await res.text());

  if (!res.ok) {
    throw new AgentError(messageFor(res.status, body), {
      status: res.status,
      toolCalls: body && body.tool_calls,
      retryAfter: res.headers.get('Retry-After'),
    });
  }

  return {
    answer: body.answer || '',
    toolCalls: body.tool_calls || [],
    nodesTouched: body.nodes_touched || [],
    usage: body.usage,
  };
};
