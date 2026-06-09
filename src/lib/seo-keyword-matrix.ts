/**
 * BigWow SEO Keyword Matrix — Phase 4
 *
 * Maps privacy-first modifiers × local-capable tools to identify
 * which combinations have high search potential and whether a
 * programmatic page exists or should be created.
 *
 * Usage: Import `keywordMatrix` to drive sitemap gap analysis,
 * content generation scripts, or internal link suggestions.
 */

export const MODIFIERS = [
  "private",
  "offline",
  "no upload",
  "secure",
  "browser",
  "local",
  "client-side",
  "free",
  "no signup",
  "open source",
] as const;

export type Modifier = (typeof MODIFIERS)[number];

export interface KeywordEntry {
  toolName: string;
  toolHref: string;
  modifier: Modifier;
  /** Composite target query — what users type into Google/AI search */
  targetQuery: string;
  /** Slug of existing programmatic page covering this combo, or null */
  existingPageSlug: string | null;
  /** Suggested slug if a new page should be created */
  suggestedSlug: string;
  /** Estimated search intent: 'informational' | 'transactional' | 'navigational' */
  intent: "informational" | "transactional" | "navigational";
  /** Priority score 1-10: higher = more valuable to build */
  priority: number;
}

export const keywordMatrix: KeywordEntry[] = [
  // ── PDF Tools ─────────────────────────────────────────────────────────────
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "private", targetQuery: "private pdf merger", existingPageSlug: "pdf-merger-no-upload", suggestedSlug: "private-pdf-merger", intent: "transactional", priority: 10 },
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "no upload", targetQuery: "merge pdf without uploading", existingPageSlug: "smallpdf-alternative-private", suggestedSlug: "merge-pdf-no-upload", intent: "transactional", priority: 10 },
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "offline", targetQuery: "offline pdf tools free", existingPageSlug: "offline-pdf-tools-free", suggestedSlug: "offline-pdf-tools", intent: "informational", priority: 9 },
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "secure", targetQuery: "secure pdf merger browser", existingPageSlug: null, suggestedSlug: "secure-pdf-tools-browser", intent: "informational", priority: 7 },
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "browser", targetQuery: "pdf tools in browser no server", existingPageSlug: null, suggestedSlug: "browser-pdf-editor-no-server", intent: "informational", priority: 8 },
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "local", targetQuery: "process pdf locally", existingPageSlug: "local-pdf-splitter", suggestedSlug: "local-pdf-processing", intent: "informational", priority: 8 },
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "no signup", targetQuery: "pdf tools no signup", existingPageSlug: null, suggestedSlug: "pdf-tools-no-signup", intent: "transactional", priority: 9 },
  { toolName: "PDF Tools", toolHref: "/tools/pdf", modifier: "free", targetQuery: "free pdf merger no limits", existingPageSlug: null, suggestedSlug: "free-unlimited-pdf-tools", intent: "transactional", priority: 8 },

  // ── Image Compression ─────────────────────────────────────────────────────
  { toolName: "Image Compression", toolHref: "/tools/image-compression", modifier: "private", targetQuery: "private image compressor", existingPageSlug: "private-jpg-compression", suggestedSlug: "private-image-compressor", intent: "transactional", priority: 10 },
  { toolName: "Image Compression", toolHref: "/tools/image-compression", modifier: "no upload", targetQuery: "compress image without uploading", existingPageSlug: "image-compressor-offline-no-signup", suggestedSlug: "compress-image-no-upload", intent: "transactional", priority: 10 },
  { toolName: "Image Compression", toolHref: "/tools/image-compression", modifier: "offline", targetQuery: "image compressor offline", existingPageSlug: "image-compressor-offline-no-signup", suggestedSlug: "offline-image-compressor", intent: "informational", priority: 9 },
  { toolName: "Image Compression", toolHref: "/tools/image-compression", modifier: "browser", targetQuery: "browser based image compressor", existingPageSlug: "browser-image-optimizer-free", suggestedSlug: "browser-image-compressor", intent: "informational", priority: 8 },
  { toolName: "Image Compression", toolHref: "/tools/image-compression", modifier: "secure", targetQuery: "compress images securely", existingPageSlug: null, suggestedSlug: "secure-image-compressor", intent: "informational", priority: 6 },
  { toolName: "Image Compression", toolHref: "/tools/image-compression", modifier: "no signup", targetQuery: "image compressor no signup", existingPageSlug: "image-compressor-offline-no-signup", suggestedSlug: "image-compressor-no-account", intent: "transactional", priority: 9 },
  { toolName: "Image Compression", toolHref: "/tools/image-compression", modifier: "free", targetQuery: "free image compressor no limits", existingPageSlug: null, suggestedSlug: "free-unlimited-image-compressor", intent: "transactional", priority: 8 },

  // ── Background Removal ────────────────────────────────────────────────────
  { toolName: "Background Removal", toolHref: "/tools/bg-removal", modifier: "private", targetQuery: "private background remover no upload", existingPageSlug: "private-background-remover", suggestedSlug: "private-background-remover", intent: "transactional", priority: 10 },
  { toolName: "Background Removal", toolHref: "/tools/bg-removal", modifier: "no upload", targetQuery: "remove background without uploading", existingPageSlug: "removebg-alternative-private", suggestedSlug: "remove-background-no-upload", intent: "transactional", priority: 10 },
  { toolName: "Background Removal", toolHref: "/tools/bg-removal", modifier: "browser", targetQuery: "ai background removal in browser", existingPageSlug: "photo-background-remove-without-login", suggestedSlug: "browser-ai-background-remover", intent: "informational", priority: 9 },
  { toolName: "Background Removal", toolHref: "/tools/bg-removal", modifier: "offline", targetQuery: "background remover offline ai", existingPageSlug: null, suggestedSlug: "offline-background-remover-ai", intent: "informational", priority: 8 },
  { toolName: "Background Removal", toolHref: "/tools/bg-removal", modifier: "free", targetQuery: "free background remover no watermark", existingPageSlug: null, suggestedSlug: "free-background-remover-no-watermark", intent: "transactional", priority: 9 },

  // ── JWT Decoder ───────────────────────────────────────────────────────────
  { toolName: "JWT Decoder", toolHref: "/tools/jwt-decoder", modifier: "private", targetQuery: "private jwt decoder no server", existingPageSlug: "online-jwt-decoder-without-server", suggestedSlug: "private-jwt-decoder", intent: "transactional", priority: 10 },
  { toolName: "JWT Decoder", toolHref: "/tools/jwt-decoder", modifier: "secure", targetQuery: "secure jwt token decoder", existingPageSlug: "jwtio-alternative-local", suggestedSlug: "secure-jwt-decoder", intent: "informational", priority: 9 },
  { toolName: "JWT Decoder", toolHref: "/tools/jwt-decoder", modifier: "local", targetQuery: "decode jwt locally no api", existingPageSlug: "online-jwt-decoder-without-server", suggestedSlug: "local-jwt-decoder", intent: "informational", priority: 9 },
  { toolName: "JWT Decoder", toolHref: "/tools/jwt-decoder", modifier: "no upload", targetQuery: "jwt decoder without uploading token", existingPageSlug: "jwtio-alternative-local", suggestedSlug: "jwt-decoder-no-upload", intent: "transactional", priority: 10 },
  { toolName: "JWT Decoder", toolHref: "/tools/jwt-decoder", modifier: "offline", targetQuery: "jwt decoder offline", existingPageSlug: null, suggestedSlug: "offline-jwt-decoder", intent: "informational", priority: 7 },

  // ── JSON Formatter ────────────────────────────────────────────────────────
  { toolName: "JSON Formatter", toolHref: "/tools/json-formatter", modifier: "offline", targetQuery: "offline json formatter browser", existingPageSlug: "offline-json-formatter", suggestedSlug: "offline-json-formatter", intent: "transactional", priority: 9 },
  { toolName: "JSON Formatter", toolHref: "/tools/json-formatter", modifier: "private", targetQuery: "private json formatter for api keys", existingPageSlug: "json-formatter-browser-tool", suggestedSlug: "private-json-formatter-api-keys", intent: "transactional", priority: 9 },
  { toolName: "JSON Formatter", toolHref: "/tools/json-formatter", modifier: "no upload", targetQuery: "format json without sending to server", existingPageSlug: "offline-json-formatter", suggestedSlug: "json-formatter-no-server", intent: "informational", priority: 8 },
  { toolName: "JSON Formatter", toolHref: "/tools/json-formatter", modifier: "secure", targetQuery: "json formatter safe for credentials", existingPageSlug: null, suggestedSlug: "secure-json-formatter", intent: "informational", priority: 7 },
  { toolName: "JSON Formatter", toolHref: "/tools/json-formatter", modifier: "browser", targetQuery: "json formatter browser no extension", existingPageSlug: null, suggestedSlug: "browser-json-formatter", intent: "informational", priority: 6 },

  // ── Hash Generator ────────────────────────────────────────────────────────
  { toolName: "Hash Generator", toolHref: "/tools/hash-generator", modifier: "private", targetQuery: "private sha256 hash generator", existingPageSlug: "private-hash-generator", suggestedSlug: "private-hash-generator", intent: "transactional", priority: 9 },
  { toolName: "Hash Generator", toolHref: "/tools/hash-generator", modifier: "local", targetQuery: "generate sha256 hash locally", existingPageSlug: "private-hash-generator", suggestedSlug: "local-sha256-hash-generator", intent: "informational", priority: 9 },
  { toolName: "Hash Generator", toolHref: "/tools/hash-generator", modifier: "no upload", targetQuery: "hash text without server", existingPageSlug: "private-hash-generator", suggestedSlug: "hash-generator-no-server", intent: "transactional", priority: 8 },
  { toolName: "Hash Generator", toolHref: "/tools/hash-generator", modifier: "offline", targetQuery: "offline sha256 hash tool", existingPageSlug: null, suggestedSlug: "offline-sha256-tool", intent: "informational", priority: 7 },
  { toolName: "Hash Generator", toolHref: "/tools/hash-generator", modifier: "secure", targetQuery: "secure hash generator web crypto", existingPageSlug: null, suggestedSlug: "web-crypto-hash-generator", intent: "informational", priority: 7 },

  // ── Password Generator ────────────────────────────────────────────────────
  { toolName: "Password Generator", toolHref: "/tools/password-generator", modifier: "secure", targetQuery: "cryptographically secure password generator browser", existingPageSlug: "secure-password-generator", suggestedSlug: "secure-password-generator", intent: "transactional", priority: 10 },
  { toolName: "Password Generator", toolHref: "/tools/password-generator", modifier: "offline", targetQuery: "password generator without internet", existingPageSlug: "secure-password-generator", suggestedSlug: "offline-password-generator", intent: "transactional", priority: 9 },
  { toolName: "Password Generator", toolHref: "/tools/password-generator", modifier: "private", targetQuery: "private password generator no tracking", existingPageSlug: "secure-password-generator", suggestedSlug: "private-password-generator", intent: "transactional", priority: 9 },
  { toolName: "Password Generator", toolHref: "/tools/password-generator", modifier: "local", targetQuery: "generate password locally no api", existingPageSlug: null, suggestedSlug: "local-password-generator", intent: "informational", priority: 7 },
  { toolName: "Password Generator", toolHref: "/tools/password-generator", modifier: "no signup", targetQuery: "password generator no signup no account", existingPageSlug: null, suggestedSlug: "password-generator-no-signup", intent: "transactional", priority: 8 },

  // ── Text Encryption ───────────────────────────────────────────────────────
  { toolName: "Text Encryption", toolHref: "/tools/text-encryption", modifier: "browser", targetQuery: "aes256 encrypt text browser", existingPageSlug: "text-encryption-browser", suggestedSlug: "text-encryption-browser", intent: "transactional", priority: 9 },
  { toolName: "Text Encryption", toolHref: "/tools/text-encryption", modifier: "no upload", targetQuery: "encrypt text without uploading", existingPageSlug: "text-encryption-browser", suggestedSlug: "encrypt-text-no-upload", intent: "transactional", priority: 9 },
  { toolName: "Text Encryption", toolHref: "/tools/text-encryption", modifier: "local", targetQuery: "encrypt text locally aes 256", existingPageSlug: "text-encryption-browser", suggestedSlug: "local-text-encryption-aes256", intent: "informational", priority: 8 },
  { toolName: "Text Encryption", toolHref: "/tools/text-encryption", modifier: "secure", targetQuery: "secure text encryption free tool", existingPageSlug: null, suggestedSlug: "secure-text-encryption-tool", intent: "informational", priority: 7 },
  { toolName: "Text Encryption", toolHref: "/tools/text-encryption", modifier: "offline", targetQuery: "offline text encryption tool", existingPageSlug: null, suggestedSlug: "offline-text-encryptor", intent: "informational", priority: 6 },

  // ── Regex Tester ──────────────────────────────────────────────────────────
  { toolName: "Regex Tester", toolHref: "/tools/regex-tester", modifier: "private", targetQuery: "private regex tester no server logs", existingPageSlug: "private-regex-tester", suggestedSlug: "private-regex-tester", intent: "transactional", priority: 9 },
  { toolName: "Regex Tester", toolHref: "/tools/regex-tester", modifier: "local", targetQuery: "test regex locally client side", existingPageSlug: "client-side-regex-tester", suggestedSlug: "local-regex-tester", intent: "informational", priority: 8 },
  { toolName: "Regex Tester", toolHref: "/tools/regex-tester", modifier: "no upload", targetQuery: "regex tester without server", existingPageSlug: "private-regex-tester", suggestedSlug: "regex-tester-no-server", intent: "transactional", priority: 8 },
  { toolName: "Regex Tester", toolHref: "/tools/regex-tester", modifier: "secure", targetQuery: "regex test sensitive data safely", existingPageSlug: null, suggestedSlug: "regex-tester-sensitive-data-safe", intent: "informational", priority: 7 },
  { toolName: "Regex Tester", toolHref: "/tools/regex-tester", modifier: "offline", targetQuery: "offline regex tester browser", existingPageSlug: null, suggestedSlug: "offline-regex-tester", intent: "informational", priority: 6 },

  // ── Base64 Tools ──────────────────────────────────────────────────────────
  { toolName: "Base64 Tools", toolHref: "/tools/base64", modifier: "private", targetQuery: "private base64 encoder no server", existingPageSlug: "client-side-base64-encoder", suggestedSlug: "private-base64-encoder", intent: "transactional", priority: 8 },
  { toolName: "Base64 Tools", toolHref: "/tools/base64", modifier: "local", targetQuery: "base64 encode locally browser", existingPageSlug: "local-base64-encoder", suggestedSlug: "local-base64-encoder", intent: "transactional", priority: 8 },
  { toolName: "Base64 Tools", toolHref: "/tools/base64", modifier: "secure", targetQuery: "encode api key base64 safely", existingPageSlug: null, suggestedSlug: "base64-encode-api-key-safely", intent: "informational", priority: 8 },
  { toolName: "Base64 Tools", toolHref: "/tools/base64", modifier: "offline", targetQuery: "offline base64 decoder", existingPageSlug: null, suggestedSlug: "offline-base64-decoder", intent: "informational", priority: 6 },
  { toolName: "Base64 Tools", toolHref: "/tools/base64", modifier: "no upload", targetQuery: "base64 without sending to server", existingPageSlug: "local-base64-encoder", suggestedSlug: "base64-no-server", intent: "transactional", priority: 7 },

  // ── Video Compression ─────────────────────────────────────────────────────
  { toolName: "Video Compressor", toolHref: "/tools/compress-video", modifier: "no upload", targetQuery: "compress video without uploading", existingPageSlug: "private-video-compressor", suggestedSlug: "compress-video-no-upload", intent: "transactional", priority: 10 },
  { toolName: "Video Compressor", toolHref: "/tools/compress-video", modifier: "private", targetQuery: "private video compressor browser", existingPageSlug: "private-video-compressor", suggestedSlug: "private-video-compressor", intent: "transactional", priority: 9 },
  { toolName: "Video Compressor", toolHref: "/tools/compress-video", modifier: "browser", targetQuery: "compress video in browser ffmpeg", existingPageSlug: "private-video-compressor", suggestedSlug: "browser-video-compressor-ffmpeg", intent: "informational", priority: 9 },
  { toolName: "Video Compressor", toolHref: "/tools/compress-video", modifier: "offline", targetQuery: "offline video compression tool", existingPageSlug: null, suggestedSlug: "offline-video-compressor", intent: "informational", priority: 8 },
  { toolName: "Video Compressor", toolHref: "/tools/compress-video", modifier: "free", targetQuery: "free video compressor no signup", existingPageSlug: null, suggestedSlug: "free-video-compressor-no-signup", intent: "transactional", priority: 8 },

  // ── QR Generator ─────────────────────────────────────────────────────────
  { toolName: "QR Generator", toolHref: "/tools/qr-generator", modifier: "offline", targetQuery: "qr code generator offline browser", existingPageSlug: "browser-qr-code-generator", suggestedSlug: "offline-qr-generator", intent: "transactional", priority: 8 },
  { toolName: "QR Generator", toolHref: "/tools/qr-generator", modifier: "private", targetQuery: "private qr code generator confidential url", existingPageSlug: "browser-qr-code-generator", suggestedSlug: "private-qr-generator", intent: "transactional", priority: 8 },
  { toolName: "QR Generator", toolHref: "/tools/qr-generator", modifier: "no upload", targetQuery: "generate qr code without server", existingPageSlug: "browser-qr-code-generator", suggestedSlug: "qr-generator-no-server", intent: "informational", priority: 7 },

  // ── Zip Tools ─────────────────────────────────────────────────────────────
  { toolName: "Zip Tools", toolHref: "/tools/zip", modifier: "private", targetQuery: "zip files without uploading", existingPageSlug: "private-zip-tool", suggestedSlug: "private-zip-tool", intent: "transactional", priority: 9 },
  { toolName: "Zip Tools", toolHref: "/tools/zip", modifier: "offline", targetQuery: "create zip offline browser", existingPageSlug: "private-zip-tool", suggestedSlug: "offline-zip-creator", intent: "informational", priority: 8 },
  { toolName: "Zip Tools", toolHref: "/tools/zip", modifier: "secure", targetQuery: "encrypted zip file browser", existingPageSlug: null, suggestedSlug: "encrypted-zip-browser", intent: "transactional", priority: 8 },
  { toolName: "Zip Tools", toolHref: "/tools/zip", modifier: "no upload", targetQuery: "zip file without uploading to server", existingPageSlug: "private-zip-tool", suggestedSlug: "zip-no-upload", intent: "transactional", priority: 9 },
];

// ── Analysis helpers ─────────────────────────────────────────────────────────

/** Returns all keyword entries that do NOT have an existing programmatic page */
export const missingPages = keywordMatrix
  .filter((entry) => entry.existingPageSlug === null)
  .sort((a, b) => b.priority - a.priority);

/** Returns top N highest-priority missing pages */
export function getTopMissingPages(n = 10): KeywordEntry[] {
  return missingPages.slice(0, n);
}

/** Returns all entries for a specific tool */
export function getEntriesForTool(toolHref: string): KeywordEntry[] {
  return keywordMatrix.filter((e) => e.toolHref === toolHref);
}

/** Returns all entries for a specific modifier */
export function getEntriesForModifier(modifier: Modifier): KeywordEntry[] {
  return keywordMatrix.filter((e) => e.modifier === modifier);
}

/** Summary stats for the matrix */
export const matrixStats = {
  totalEntries: keywordMatrix.length,
  covered: keywordMatrix.filter((e) => e.existingPageSlug !== null).length,
  missing: missingPages.length,
  coveragePercent: Math.round(
    (keywordMatrix.filter((e) => e.existingPageSlug !== null).length /
      keywordMatrix.length) *
      100
  ),
};
