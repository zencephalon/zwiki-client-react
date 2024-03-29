import { getDefaultKeyBinding } from 'draft-js';

export default function keyBindings(e) {
  if (e.key === 'p' && e.ctrlKey) {
    return 'TOGGLE_PRIVACY';
  }
  if (e.key === 'd' && e.ctrlKey) {
    return 'INSERT_TIME_STAMP';
  }
  if (e.key === 'D' && e.ctrlKey) {
    return 'INSERT_DATE_STAMP';
  }
  if (e.key === 'z' && e.ctrlKey) {
    return 'TOGGLE_TODO';
  }
  if (e.key === 'Enter' && e.ctrlKey) {
    return 'OPEN_LINK';
  }
  if (e.key === 'f' && e.ctrlKey) {
    return 'REFOCUS';
  }
  if (e.key === ' ' && e.ctrlKey) {
    return 'SWITCH_FOCUS';
  }
  if (e.key === 'q' && e.ctrlKey) {
    return 'SELECT_BLOCK_DOWN';
  }
  if (e.key === 'Q' && e.ctrlKey) {
    return 'SELECT_BLOCK_UP';
  }
  if (e.key === 'J' && e.ctrlKey) {
    return 'SHIFT_DOWN';
  }
  if (e.key === 'K' && e.ctrlKey) {
    return 'SHIFT_UP';
  }
  if (e.key === 'j' && e.ctrlKey) {
    return 'CYCLE_DOWN';
  }
  if (e.key === 'k' && e.ctrlKey) {
    return 'CYCLE_UP';
  }
  if (e.key === 'l' && e.ctrlKey) {
    return 'SLIDE_RIGHT';
  }
  if (e.key === 'h' && e.ctrlKey) {
    return 'SLIDE_LEFT';
  }
  if (e.key === 'n' && e.ctrlKey) {
    return 'NEW_NODE';
  }
  const num = parseInt(e.key, 10);
  if (num > 0 && e.ctrlKey) {
    return { setColumn: true, num };
  }

  return getDefaultKeyBinding(e);
}
