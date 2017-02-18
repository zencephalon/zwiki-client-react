import { getDefaultKeyBinding } from 'draft-js'

export default function keyBindings(e) {
  if (e.key === ' ' && e.ctrlKey) {
    return 'SWITCH_FOCUS'
  }
  if (e.key === 'j' && e.ctrlKey && !e.shiftKey) {
    return 'CYCLE_DOWN'
  }
  if (e.key === 'k' && e.ctrlKey && !e.shiftKey) {
    return 'CYCLE_UP'
  }
  if (e.key === 'j' && e.ctrlKey && e.shiftKey) {
    return 'SHIFT_DOWN'
  }
  if (e.key === 'k' && e.ctrlKey && e.shiftKey) {
    return 'SHIFT_UP'
  }
  if (e.key === 'l' && e.ctrlKey) {
    return 'SLIDE_RIGHT'
  }
  if (e.key === 'h' && e.ctrlKey) {
    return 'SLIDE_LEFT'
  }
  return getDefaultKeyBinding(e)
}