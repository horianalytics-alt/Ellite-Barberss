// Allow-list of URL schemes that are safe to render in href/src attributes.
const ALLOWED_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

/**
 * Returns the URL when it uses a safe scheme, otherwise an empty string.
 * Blocks javascript:, data:, vbscript: and other dangerous URIs that could
 * execute code when a visitor clicks a link built from stored content.
 */
export function safeUrl(url: unknown, fallback = ""): string {
  if (typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Relative links and in-page anchors are safe.
  if (/^[#/](?![/\\])/.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed, "https://example.invalid");
    if (!ALLOWED_SCHEMES.includes(parsed.protocol)) return fallback;
    return trimmed;
  } catch {
    return fallback;
  }
}

/** Same as safeUrl but only allows http(s) — used for iframe embeds. */
export function safeEmbedUrl(url: unknown, fallback = ""): string {
  const safe = safeUrl(url, "");
  if (!safe) return fallback;
  return /^https?:\/\//i.test(safe) ? safe : fallback;
}
