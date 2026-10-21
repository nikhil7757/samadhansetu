import { URL } from 'url';
import dns from 'dns/promises';

const BLOCKED_IP_PATTERNS = [
  /^127\./,                         // Loopback (127.0.0.0/8)
  /^10\./,                          // Private class A (10.0.0.0/8)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private class B (172.16.0.0/12)
  /^192\.168\./,                    // Private class C (192.168.0.0/16)
  /^169\.254\./,                    // Link-local / Cloud metadata (169.254.0.0/16)
  /^0\./,                           // Current network
  /^::1$/,                          // IPv6 loopback
  /^[fF][cCdD]/,                    // IPv6 Unique Local Address
  /^[fF][eE][89aAbB]/,              // IPv6 Link-Local
];

const ALLOWED_PROTOCOLS = ['https:', 'http:'];

export interface SsrfValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export async function validateExternalUrl(
  inputUrl: string,
  allowedDomains?: string[]
): Promise<SsrfValidationResult> {
  try {
    const parsed = new URL(inputUrl);

    // 1. Verify scheme
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return { isValid: false, error: `Invalid protocol: ${parsed.protocol}. Only http/https allowed.` };
    }

    // 2. Reject credentials in URL
    if (parsed.username || parsed.password) {
      return { isValid: false, error: 'URLs with embedded credentials are prohibited.' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 3. Domain allowlist check if specified
    if (allowedDomains && allowedDomains.length > 0) {
      const match = allowedDomains.some((domain) =>
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
      if (!match) {
        return { isValid: false, error: `Host ${hostname} is not in the allowed domain list.` };
      }
    }

    // 4. Resolve DNS to ensure destination does not resolve to private/loopback/cloud metadata IP
    try {
      const lookupResult = await dns.lookup(hostname, { all: true });
      for (const entry of lookupResult) {
        for (const pattern of BLOCKED_IP_PATTERNS) {
          if (pattern.test(entry.address)) {
            return {
              isValid: false,
              error: `Host ${hostname} resolves to blocked internal address: ${entry.address}`,
            };
          }
        }
      }
    } catch {
      return { isValid: false, error: `Could not resolve hostname: ${hostname}` };
    }

    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch (err: any) {
    return { isValid: false, error: `Malformed URL: ${err.message}` };
  }
}
