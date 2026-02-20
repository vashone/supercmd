export type Modifier = 'cmd' | 'shift' | 'ctrl' | 'alt' | 'hyper';

const HYPER_MOD_KEYS = new Set([
  'command', 'cmd', 'meta', 'control', 'ctrl', 'alt', 'option', 'shift',
  'hyper', '✦',
]);

function normalizeModifierToken(token: string): string {
  const value = String(token || '').trim().toLowerCase();
  if (value === 'cmd' || value === 'command' || value === 'meta' || value === 'super') return 'command';
  if (value === 'ctrl' || value === 'control') return 'control';
  if (value === 'alt' || value === 'option') return 'alt';
  if (value === 'shift') return 'shift';
  if (value === 'hyper' || value === '✦') return 'hyper';
  return value;
}

export function collapseHyperShortcut(shortcut: string): string {
  const raw = String(shortcut || '').trim();
  if (!raw) return '';
  const parts = raw.split('+').map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) return raw;

  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1);
  const normalized = new Set(modifiers.map(normalizeModifierToken));

  const hasHyper =
    normalized.has('hyper') ||
    (normalized.has('command') && normalized.has('control') && normalized.has('alt') && normalized.has('shift'));

  if (!hasHyper) return raw;

  const remaining = modifiers.filter((token) => !HYPER_MOD_KEYS.has(normalizeModifierToken(token)));
  return ['Hyper', ...remaining, key].join('+');
}

export function formatShortcutForDisplay(shortcut: string): string {
  const collapsed = collapseHyperShortcut(shortcut);
  return collapsed
    .split('+')
    .map((token) => {
      const value = String(token || '').trim();
      if (!value) return value;
      if (/^hyper$/i.test(value) || value === '✦') return 'Hyper';
      if (/^(command|cmd)$/i.test(value)) return '⌘';
      if (/^(control|ctrl)$/i.test(value)) return '⌃';
      if (/^(alt|option)$/i.test(value)) return '⌥';
      if (/^shift$/i.test(value)) return '⇧';
      if (/^(function|fn)$/i.test(value)) return 'fn';
      if (/^arrowup$/i.test(value)) return '↑';
      if (/^arrowdown$/i.test(value)) return '↓';
      if (/^(backspace|delete)$/i.test(value)) return '⌫';
      if (/^period$/i.test(value)) return '.';
      return value.length === 1 ? value.toUpperCase() : value;
    })
    .join(' + ');
}
