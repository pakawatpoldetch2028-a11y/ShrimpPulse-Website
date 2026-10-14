// Small helpers shared by the build script and templates. No dependencies.

/** Escape text for safe insertion into HTML. */
export function h(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Join template fragments, dropping empty values. */
export function join(parts, sep = '\n') {
  return parts.filter(Boolean).join(sep);
}

/** Replace {{people.key}} tokens (and {{version.x}}) in every string of a content tree. */
export function applyTokens(tree, lang, config) {
  const lookup = (path) => {
    const [group, key] = path.split('.');
    if (group === 'people') return config.people?.[key]?.[lang] ?? config.people?.[key]?.en;
    if (group === 'version') return config.release?.[key]?.version;
    return undefined;
  };
  const walk = (node) => {
    if (typeof node === 'string') {
      return node.replace(/\{\{([a-zA-Z.]+)\}\}/g, (m, p) => {
        const v = lookup(p);
        if (v === undefined) throw new Error(`Unknown token ${m}`);
        return v;
      });
    }
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(node)) out[k] = walk(v);
      return out;
    }
    return node;
  };
  return walk(tree);
}

/** Simple {name} interpolation for UI strings. */
export function fmt(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

/**
 * Localised date rendering. Accepts "YYYY-MM", "YYYY-MM-DD" or "YYYY-Qn".
 * Underlying dates never change; Thai output can use the Buddhist year.
 */
export function formatDate(value, lang, common, config) {
  const buddhist = lang === 'th' && config.site.thaiCalendar !== 'gregorian';
  const year = (y) => (buddhist ? y + 543 : y);
  const months = common.dates.months;
  let m;
  if ((m = /^(\d{4})-Q([1-4])$/.exec(value))) {
    return fmt(common.dates.quarter, { q: m[2], year: year(+m[1]) });
  }
  if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value))) {
    return `${+m[3]} ${months[+m[2] - 1]} ${year(+m[1])}`;
  }
  if ((m = /^(\d{4})-(\d{2})$/.exec(value))) {
    return `${months[+m[2] - 1]} ${year(+m[1])}`;
  }
  throw new Error(`Unrecognised date: ${value}`);
}

/** Machine-readable value for <time datetime>. */
export function isoDate(value) {
  const q = /^(\d{4})-Q([1-4])$/.exec(value);
  if (q) return `${q[1]}-${String((+q[2] - 1) * 3 + 1).padStart(2, '0')}`;
  return value;
}

export function formatDateRange(from, to, lang, common, config) {
  if (!to) return formatDate(from, lang, common, config);
  return fmt(common.dates.range, {
    from: formatDate(from, lang, common, config),
    to: formatDate(to, lang, common, config),
  });
}
