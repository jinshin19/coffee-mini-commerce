export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildContainsRegex(value: string) {
  return new RegExp(escapeRegex(value.trim()), 'i');
}

export function buildExactCaseInsensitiveRegex(value: string) {
  return new RegExp(`^${escapeRegex(value.trim())}$`, 'i');
}

export function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return undefined;
}
