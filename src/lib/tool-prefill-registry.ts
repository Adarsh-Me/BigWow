/**
 * Tool pre-fill registry.
 * Maps tool hrefs to functions that convert AI-extracted params
 * into props that can be passed to the tool component on mount.
 *
 * Phase 1: Calculator only.
 * Phase 2: Extend to QR Generator, Image Resizer, Text tools, etc.
 */

export type PrefillFn = (params: Record<string, unknown>) => Record<string, unknown>;

const registry: Record<string, PrefillFn> = {
  "/tools/calculator": (params) => {
    // AI returns e.g. { expression: "20 * 500" }
    const raw = String(params?.expression ?? "");
    // Normalize: replace × with *, ÷ with /, "multiply" with *, "divide" with /
    const normalized = raw
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\bmultiply\b/gi, "*")
      .replace(/\btimes\b/gi, "*")
      .replace(/\bdivide\b/gi, "/")
      .replace(/\bplus\b/gi, "+")
      .replace(/\bminus\b/gi, "-")
      .replace(/\bby\b/gi, "")
      .trim();
    return { initialExpression: normalized };
  },

  "/tools/qr-generator": (params) => ({
    initialText: String(params?.text ?? params?.url ?? ""),
  }),

  "/tools/image-resizer": (params) => ({
    initialWidth: Number(params?.width ?? 0) || undefined,
    initialHeight: Number(params?.height ?? 0) || undefined,
  }),

  "/tools/text-counter": (params) => ({
    initialText: String(params?.text ?? ""),
  }),

  "/tools/url-encoder": (params) => ({
    initialInput: String(params?.url ?? params?.text ?? ""),
  }),

  "/tools/hash-generator": (params) => ({
    initialText: String(params?.text ?? ""),
  }),

  "/tools/base64": (params) => ({
    initialText: String(params?.text ?? ""),
  }),

  "/tools/lorem-ipsum": (params) => ({
    initialParagraphs: Number(params?.paragraphs ?? 0) || undefined,
  }),

  "/tools/password-generator": (params) => ({
    initialLength: Number(params?.length ?? 0) || undefined,
  }),

  "/tools/uuid-generator": (params) => ({
    initialVersion: String(params?.version ?? ""),
  }),

  "/tools/currency-converter": (params) => ({
    initialFrom: String(params?.from ?? ""),
    initialTo: String(params?.to ?? ""),
    initialAmount: Number(params?.amount ?? 0) || undefined,
  }),

  "/tools/unit-converter": (params) => ({
    initialValue: Number(params?.value ?? 0) || undefined,
    initialFrom: String(params?.from ?? ""),
    initialTo: String(params?.to ?? ""),
  }),
};

/**
 * Get pre-fill props for a tool given AI-extracted params.
 * Returns empty object if no pre-fill handler is registered for the href.
 */
export function getPrefillProps(href: string, params?: Record<string, unknown>): Record<string, unknown> {
  if (!params || Object.keys(params).length === 0) return {};
  const fn = registry[href];
  if (!fn) return {};
  try {
    return fn(params);
  } catch {
    return {};
  }
}
