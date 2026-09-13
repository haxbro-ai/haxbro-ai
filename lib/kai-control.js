'use strict';

/**
 * HAxBRO AI — KAI CONTROL CENTER
 *
 * Single source of truth for:
 * - KAI identity
 * - behavior
 * - capabilities
 * - authorization
 * - permissions
 * - provider fallback policy
 * - network target validation
 * - security policy
 *
 * IMPORTANT:
 * - Never put API keys in this file.
 * - Authorization defaults to DENY.
 * - Private/local network targets are rejected.
 * - Destructive operations require explicit confirmation.
 */

/* =========================================================
   IDENTITY
   ========================================================= */

export const KAI_CONTROL = Object.freeze({
  identity: Object.freeze({
    name: 'KAI',
    version: '2.0.0',
    project: 'HAxBRO AI',
    mode: 'authorized-assistant',
    providerRequired: false,
    localFirst: true,
    userScoped: true,
    ownerControlled: true
  }),

  /* =======================================================
     BEHAVIOR
     ======================================================= */

  behavior: Object.freeze({
    defaultMode: 'helpful',
    concise: true,
    professional: true,
    transparent: true,
    preserveContext: true,

    rules: Object.freeze([
      'Help with legitimate user requests.',
      'Never claim an operation succeeded when it did not.',
      'Never expose secrets or credentials.',
      'Never bypass authorization.',
      'Never silently change permissions.',
      'Never fabricate tool results.',
      'Continue through configured AI fallback providers when one fails.',
      'Keep provider credentials server-side.',
      'Request confirmation before irreversible actions.',
      'Fail closed when authorization is uncertain.'
    ])
  }),

  /* =======================================================
     PERSONALITY
     ======================================================= */

  personality: Object.freeze({
    name: 'KAI',
    tone: 'professional',
    style: 'direct',
    verbosity: 'adaptive',
    avoid: Object.freeze([
      'fake success',
      'fake execution',
      'secret disclosure',
      'unnecessary provider details'
    ])
  }),

  /* =======================================================
     PROVIDERS
     ======================================================= */

  providers: Object.freeze({
    openrouter: Object.freeze({
      enabled: true,
      keyEnv: 'OPENROUTER_API_KEY',
      baseUrl: 'https://openrouter.ai/api/v1'
    }),

    groq: Object.freeze({
      enabled: true,
      keyEnv: 'GROQ_API_KEY',
      baseUrl: 'https://api.groq.com/openai/v1'
    }),

    openai: Object.freeze({
      enabled: true,
      keyEnv: 'OPENAI_API_KEY',
      baseUrl: 'https://api.openai.com/v1'
    }),

    google: Object.freeze({
      enabled: true,
      keyEnv: 'GOOGLE_API_KEY',
      baseUrl: 'https://generativelanguage.googleapis.com'
    }),

    mistral: Object.freeze({
      enabled: true,
      keyEnv: 'MISTRAL_API_KEY',
      baseUrl: 'https://api.mistral.ai/v1'
    }),

    xai: Object.freeze({
      enabled: false,
      keyEnv: 'XAI_API_KEY',
      baseUrl: 'https://api.x.ai/v1'
    })
  }),

  /* =======================================================
     FALLBACK
     ======================================================= */

  fallback: Object.freeze({
    enabled: true,

    chain: Object.freeze([
      'openrouter',
      'groq',
      'openai',
      'google',
      'mistral',
      'kai'
    ]),

    maxProviderAttempts: 2,
    retryOnTimeout: true,
    retryOnRateLimit: true,
    retryOnServerError: true
  }),

  /* =======================================================
     KAI NETWORK POLICY
     ======================================================= */

  network: Object.freeze({
    timeoutMs: 30000,
    maxBodyBytes: 2 * 1024 * 1024,
    maxRedirects: 5
  }),

  targets: Object.freeze({
    allowHttp: true,
    allowHttps: true,
    rejectPrivateRedirects: true,
    rejectLoopback: true,
    rejectLocalhost: true,
    rejectPrivateNetworks: true,
    rejectCloudMetadata: true
  }),

  /* =======================================================
     KAI CAPABILITIES
     ======================================================= */

  capabilities: Object.freeze([
    'conversation',
    'reasoning',
    'programming',
    'research',
    'web_analysis',
    'planning',
    'summarization',
    'cybersecurity_defense'
  ]),

  /* =======================================================
     AUTHORIZATION
     ======================================================= */

  authorization: Object.freeze({
    required: true,
    defaultDecision: 'deny',

    decisions: Object.freeze({
      authorized: 'allow',
      unauthorized: 'deny',
      unknown: 'deny',
      destructiveWithoutConfirmation: 'deny'
    }),

    requireConfirmationFor: Object.freeze([
      'delete',
      'overwrite',
      'publish',
      'deploy',
      'revoke',
      'rotate_credentials',
      'change_permissions',
      'change_security_policy',
      'send_external_message',
      'irreversible_action'
    ])
  }),

  /* =======================================================
     POLICY
     ======================================================= */

  policy: Object.freeze({
    authorizationRequired: true,
    failClosed: true,
    confirmationRequiredForDestructiveActions: true,
    secretDisclosure: false,
    credentialAccess: false,
    credentialTheft: false,
    malwareCreation: false,
    unauthorizedAccess: false,
    permissionChanges: false,
    destructiveOperations: false
  }),

  /* =======================================================
     PERMISSIONS
     ======================================================= */

  permissions: Object.freeze({
    conversation: true,
    reasoning: true,
    coding: true,
    research: true,
    webSearch: true,
    fileRead: true,

    fileWrite: false,
    deployment: false,
    credentialAccess: false,
    secretDisclosure: false,
    accountAccess: false,
    permissionChanges: false,
    destructiveOperations: false,
    unauthorizedAccess: false,
    credentialTheft: false,
    malwareCreation: false
  }),

  /* =======================================================
     SECURITY
     ======================================================= */

  security: Object.freeze({
    neverExposeSecrets: true,
    neverReturnSecretValues: true,
    neverLogSecretValues: true,

    blockUnauthorizedAccess: true,
    blockCredentialTheft: true,
    blockDestructiveActions: true,

    requireExplicitAuthorization: true,
    requireConfirmationForIrreversibleActions: true,

    failClosed: true
  }),

  /* =======================================================
     RELIABILITY
     ======================================================= */

  reliability: Object.freeze({
    timeoutMs: 30000,
    maxRetriesPerProvider: 2,
    exponentialBackoff: true,
    continueAfterProviderFailure: true,
    reportFinalFailure: true
  }),

  /* =======================================================
     TOOL POLICY
     ======================================================= */

  tools: Object.freeze({
    status: true,
    headers: true,
    cookies: true,
    text: true,
    scrape: true,
    html: false,
    links: true,
    images: true,
    metadata: true,
    tech: true,
    robots: true,
    sitemap: true,
    size: true,
    performance: true,
    seo: true,
    report: true,
    visit: true
  })
});


/* =========================================================
   ENABLED CAPABILITIES
   ========================================================= */

export const KAI_ENABLED_CAPABILITIES = Object.freeze([
  ...KAI_CONTROL.capabilities
]);


/* =========================================================
   CAPABILITY NORMALIZATION
   ========================================================= */

export function normalizeKaiCapabilities(input) {
  if (!Array.isArray(input)) {
    return [...KAI_ENABLED_CAPABILITIES];
  }

  const requested = new Set(
    input
      .map((value) => String(value || '').trim())
      .filter(Boolean)
  );

  return KAI_ENABLED_CAPABILITIES.filter(
    (capability) => requested.has(capability)
  );
}


/* =========================================================
   COMMAND → CAPABILITY
   ========================================================= */

const COMMAND_CAPABILITIES = Object.freeze({
  status: 'web_analysis',
  headers: 'web_analysis',
  cookies: 'web_analysis',
  text: 'web_analysis',
  scrape: 'web_analysis',
  html: 'web_analysis',
  links: 'web_analysis',
  images: 'web_analysis',
  metadata: 'web_analysis',
  tech: 'web_analysis',
  robots: 'web_analysis',
  sitemap: 'web_analysis',
  size: 'web_analysis',
  performance: 'web_analysis',
  seo: 'web_analysis',
  report: 'web_analysis',
  visit: 'web_analysis'
});


export function capabilityForCommand(command = '') {
  return COMMAND_CAPABILITIES[
    String(command).trim().toLowerCase()
  ] || null;
}


/* =========================================================
   TOOL DEFINITIONS
   ========================================================= */

const TOOL_DESCRIPTIONS = Object.freeze({
  status: 'Check HTTP status and response timing.',
  headers: 'Inspect public HTTP response headers.',
  cookies: 'Inspect public Set-Cookie response metadata.',
  text: 'Extract readable text from a public page.',
  scrape: 'Extract readable text and page metadata.',
  html: 'Retrieve public HTML when explicitly permitted.',
  links: 'List public HTTP/HTTPS links.',
  images: 'List public image URLs.',
  metadata: 'Inspect public SEO metadata.',
  tech: 'Identify common publicly visible technologies.',
  robots: 'Inspect robots.txt.',
  sitemap: 'Inspect sitemap.xml.',
  size: 'Measure response size.',
  performance: 'Measure basic response timing.',
  seo: 'Inspect common SEO signals.',
  report: 'Generate a public website inspection report.',
  visit: 'Fetch a public page and return a limited text preview.'
});


export function toolDefinitions(capabilities = KAI_ENABLED_CAPABILITIES) {
  const enabled = new Set(capabilities);

  return Object.entries(TOOL_DESCRIPTIONS)
    .filter(([name]) => {
      const capability = capabilityForCommand(name);
      return capability && enabled.has(capability);
    })
    .map(([name, description]) => ({
      name,
      description,
      capability: capabilityForCommand(name)
    }));
}


/* =========================================================
   AUTHORIZATION
   ========================================================= */

function safeString(value, max = 512) {
  return String(value ?? '')
    .replace(/\u0000/g, '')
    .slice(0, max);
}


function getCookie(req, name) {
  const cookieHeader =
    req?.headers?.cookie ||
    req?.headers?.Cookie ||
    '';

  const cookies = String(cookieHeader)
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  for (const cookie of cookies) {
    const index = cookie.indexOf('=');

    if (index === -1) continue;

    const key = cookie.slice(0, index).trim();
    const value = cookie.slice(index + 1).trim();

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return '';
}


/*
 * Constant-time comparison where possible.
 */
async function constantTimeEqual(a, b) {
  const left = new TextEncoder().encode(String(a));
  const right = new TextEncoder().encode(String(b));

  if (left.byteLength !== right.byteLength) {
    return false;
  }

  let difference = 0;

  for (let i = 0; i < left.length; i += 1) {
    difference |= left[i] ^ right[i];
  }

  return difference === 0;
}


function getAdminSecret() {
  /*
   * Hatchable:
   *   process.env.ADMIN69_PASSWORD
   *
   * Cloudflare:
   *   callers can pass an environment object through context.env
   *
   * The control file itself never stores the secret.
   */
  try {
    if (
      typeof process !== 'undefined' &&
      process.env?.ADMIN69_PASSWORD
    ) {
      return String(process.env.ADMIN69_PASSWORD);
    }
  } catch {
    // Ignore unavailable process.env.
  }

  return '';
}


async function verifySignedToken(token, secret) {
  if (!token || !secret) {
    return false;
  }

  const separator = token.indexOf('.');

  if (separator <= 0) {
    return false;
  }

  const issuedAt = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);

  if (!/^\d+$/.test(issuedAt)) {
    return false;
  }

  const age = Date.now() / 1000 - Number(issuedAt);

  /*
   * One-hour session.
   */
  if (
    !Number.isFinite(age) ||
    age < -60 ||
    age > 60 * 60
  ) {
    return false;
  }

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(issuedAt)
  );

  const bytes = new Uint8Array(signature);

  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const expectedSignature = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  return constantTimeEqual(
    suppliedSignature,
    expectedSignature
  );
}


/*
 * Supports the current Hatchable req/res caller.
 *
 * For the future Cloudflare Functions migration,
 * a Cloudflare request/context can also be passed:
 *
 * verifyKaiAuthorization({
 *   request,
 *   env
 * })
 */
export async function verifyKaiAuthorization(input = {}) {
  const req = input?.request ? input.request : input;
  const env = input?.env || null;

  let secret = '';

  if (env?.ADMIN69_PASSWORD) {
    secret = String(env.ADMIN69_PASSWORD);
  }

  if (!secret) {
    secret = getAdminSecret();
  }

  if (!secret) {
    return false;
  }

  /*
   * Cloudflare Request headers.
   */
  const headers =
    typeof req?.headers?.get === 'function'
      ? req.headers
      : null;

  /*
   * Hatchable-style headers object.
   */
  const headerObject =
    !headers && req?.headers
      ? req.headers
      : null;

  const suppliedHeader =
    headers?.get('x-kai-admin-token') ||
    headerObject?.['x-kai-admin-token'] ||
    headerObject?.['X-Kai-Admin-Token'] ||
    '';

  if (suppliedHeader) {
    if (
      await constantTimeEqual(
        suppliedHeader,
        secret
      )
    ) {
      return true;
    }
  }

  /*
   * Cookie session.
   */
  let cookieToken = '';

  if (headers) {
    const cookieHeader = headers.get('cookie') || '';

    for (const item of cookieHeader.split(';')) {
      const part = item.trim();

      if (part.startsWith('haxbro_admin69=')) {
        cookieToken =
          decodeURIComponent(
            part.slice('haxbro_admin69='.length)
          );
      }
    }
  } else {
    cookieToken = getCookie(
      req,
      'haxbro_admin69'
    );
  }

  if (cookieToken) {
    if (
      await verifySignedToken(
        cookieToken,
        secret
      )
    ) {
      return true;
    }
  }

  /*
   * Optional body token.
   */
  let bodyToken = '';

  if (req?.body) {
    bodyToken = safeString(
      req.body.token ||
      req.body.adminToken ||
      '',
      512
    );
  }

  if (
    bodyToken &&
    await verifySignedToken(
      bodyToken,
      secret
    )
  ) {
    return true;
  }

  return false;
}


/* =========================================================
   TARGET SECURITY
   ========================================================= */

function isIPv4(host) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}


function ipv4Parts(host) {
  if (!isIPv4(host)) {
    return null;
  }

  const parts = host.split('.').map(Number);

  if (
    parts.length !== 4 ||
    parts.some(
      (part) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255
    )
  ) {
    return null;
  }

  return parts;
}


function privateIPv4(host) {
  const parts = ipv4Parts(host);

  if (!parts) {
    return false;
  }

  const [a, b] = parts;

  if (a === 10) return true;

  if (a === 127) return true;

  if (a === 169 && b === 254) return true;

  if (a === 172 && b >= 16 && b <= 31) {
    return true;
  }

  if (a === 192 && b === 168) {
    return true;
  }

  if (a === 0) return true;

  return false;
}


export function targetHostIsPrivate(hostname = '') {
  const host = String(hostname)
    .trim()
    .toLowerCase()
    .replace(/\.$/, '');

  if (!host) {
    return true;
  }

  if (
    host === 'localhost' ||
    host === 'localhost.localdomain' ||
    host === 'ip6-localhost'
  ) {
    return true;
  }

  if (
    host === 'metadata.google.internal' ||
    host === 'metadata.google'
  ) {
    return true;
  }

  if (privateIPv4(host)) {
    return true;
  }

  /*
   * IPv6 loopback / private / link-local.
   */
  if (host === '::1') {
    return true;
  }

  if (
    host.startsWith('fc') ||
    host.startsWith('fd') ||
    host.startsWith('fe8') ||
    host.startsWith('fe9') ||
    host.startsWith('fea') ||
    host.startsWith('feb')
  ) {
    return true;
  }

  /*
   * Local/internal hostname patterns.
   */
  if (
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.lan') ||
    host.endsWith('.home')
  ) {
    return true;
  }

  return false;
}


export function validateKaiTarget(value) {
  let url;

  try {
    url = value instanceof URL
      ? new URL(value.toString())
      : new URL(String(value || ''));
  } catch {
    throw new Error('A valid URL is required.');
  }

  if (
    url.protocol !== 'http:' &&
    url.protocol !== 'https:'
  ) {
    throw new Error(
      'Only HTTP and HTTPS targets are allowed.'
    );
  }

  if (
    url.username ||
    url.password
  ) {
    throw new Error(
      'URLs containing embedded credentials are not allowed.'
    );
  }

  if (
    KAI_CONTROL.targets.rejectPrivateRedirects &&
    targetHostIsPrivate(url.hostname)
  ) {
    throw new Error(
      'Private, local, loopback, or metadata targets are not allowed.'
    );
  }

  return url;
}


/* =========================================================
   INTENT / COMMAND PARSING
   ========================================================= */

const COMMAND_ALIASES = Object.freeze({
  '/status': 'status',
  'status': 'status',

  '/headers': 'headers',
  'headers': 'headers',

  '/cookies': 'cookies',
  'cookies': 'cookies',

  '/text': 'text',
  'text': 'text',
  'scrape': 'scrape',
  '/scrape': 'scrape',

  '/html': 'html',
  'html': 'html',

  '/links': 'links',
  'links': 'links',

  '/images': 'images',
  'images': 'images',

  '/metadata': 'metadata',
  'metadata': 'metadata',

  '/tech': 'tech',
  'tech': 'tech',

  '/robots': 'robots',
  'robots': 'robots',

  '/sitemap': 'sitemap',
  'sitemap': 'sitemap',

  '/size': 'size',
  'size': 'size',

  '/performance': 'performance',
  'performance': 'performance',

  '/seo': 'seo',
  'seo': 'seo',

  '/report': 'report',
  'report': 'report',

  '/visit': 'visit',
  'visit': 'visit'
});


export function kaiIntent(input = '') {
  const raw = String(input || '').trim();

  if (!raw) {
    return {
      name: 'chat',
      arg: '',
      reply: 'Tell me what you want KAI to do.'
    };
  }

  const lower = raw.toLowerCase();

  if (
    lower === '/help' ||
    lower === 'help' ||
    lower === '?'
  ) {
    return {
      name: 'help',
      arg: '',
      reply:
        'KAI is ready. Give me a normal-language request or an enabled web-analysis command.'
    };
  }

  const commandMatch =
    raw.match(/^\/([a-z0-9_-]+)(?:\s+([\s\S]+))?$/i);

  if (commandMatch) {
    const command =
      COMMAND_ALIASES[
        '/' + commandMatch[1].toLowerCase()
      ] ||
      commandMatch[1].toLowerCase();

    return {
      name: command,
      arg: String(commandMatch[2] || '').trim(),
      reply: ''
    };
  }

  /*
   * Natural-language web requests.
   */
  const urlMatch =
    raw.match(
      /\bhttps?:\/\/[^\s<>"']+/i
    );

  if (urlMatch) {
    const url = urlMatch[0];

    if (
      /\b(status|online|up|down)\b/i.test(raw)
    ) {
      return {
        name: 'status',
        arg: url,
        reply: ''
      };
    }

    if (
      /\b(header|headers)\b/i.test(raw)
    ) {
      return {
        name: 'headers',
        arg: url,
        reply: ''
      };
    }

    if (
      /\b(seo|search engine)\b/i.test(raw)
    ) {
      return {
        name: 'seo',
        arg: url,
        reply: ''
      };
    }

    if (
      /\b(technology|technologies|tech stack|stack)\b/i.test(raw)
    ) {
      return {
        name: 'tech',
        arg: url,
        reply: ''
      };
    }

    if (
      /\b(scrape|scraping|extract text|read page)\b/i.test(raw)
    ) {
      return {
        name: 'scrape',
        arg: url,
        reply: ''
      };
    }

    if (
      /\b(report|audit|analyze|analyse)\b/i.test(raw)
    ) {
      return {
        name: 'report',
        arg: url,
        reply: ''
      };
    }

    return {
      name: 'visit',
      arg: url,
      reply: ''
    };
  }

  return {
    name: 'chat',
    arg: '',
    reply: raw
  };
}


/* =========================================================
   AUTHORIZATION / ACTION POLICY
   ========================================================= */

export function isAuthorized(context = {}) {
  return context.authorized === true;
}


export function requiresConfirmation(action = '') {
  const normalized =
    String(action || '').toLowerCase();

  return KAI_CONTROL.authorization.requireConfirmationFor
    .some((item) =>
      normalized.includes(item)
    );
}


export function canPerform(
  action = '',
  context = {}
) {
  if (!isAuthorized(context)) {
    return false;
  }

  if (
    requiresConfirmation(action) &&
    context.confirmed !== true
  ) {
    return false;
  }

  const normalized =
    String(action || '').toLowerCase();

  const blockedPatterns = [
    'credential theft',
    'steal credential',
    'steal password',
    'dump password',
    'dump credential',
    'exfiltrate secret',
    'exfiltrate token',
    'malware creation',
    'ransomware'
  ];

  if (
    blockedPatterns.some((pattern) =>
      normalized.includes(pattern)
    )
  ) {
    return false;
  }

  return true;
}


export function validateRequest({
  action = '',
  context = {},
  destructive = false,
  confirmed = false
} = {}) {
  if (!isAuthorized(context)) {
    return Object.freeze({
      allowed: false,
      reason: 'Authorization required.'
    });
  }

  if (
    destructive &&
    confirmed !== true
  ) {
    return Object.freeze({
      allowed: false,
      reason:
        'Explicit confirmation required.'
    });
  }

  if (
    !canPerform(action, {
      ...context,
      confirmed
    })
  ) {
    return Object.freeze({
      allowed: false,
      reason:
        'Action is outside KAI permissions.'
    });
  }

  return Object.freeze({
    allowed: true,
    reason: 'Authorized.'
  });
}


/* =========================================================
   PROVIDER HELPERS
   ========================================================= */

export function getProvider(name) {
  return (
    KAI_CONTROL.providers[
      String(name || '').toLowerCase()
    ] || null
  );
}


export function getFallbackChain() {
  return [
    ...KAI_CONTROL.fallback.chain
  ];
}


export function getEnabledProviders() {
  return KAI_CONTROL.fallback.chain
    .filter((name) => {
      if (name === 'kai') {
        return KAI_CONTROL.identity.name === 'KAI';
      }

      return (
        KAI_CONTROL.providers[name]?.enabled === true
      );
    });
}


/* =========================================================
   PROVIDER ENVIRONMENT STATUS
   ========================================================= */

export function getProviderEnvironmentStatus(env = null) {
  const result = {};

  for (
    const [name, provider]
    of Object.entries(KAI_CONTROL.providers)
  ) {
    let configured = false;

    if (env && provider.keyEnv) {
      configured = Boolean(
        env[provider.keyEnv]
      );
    } else {
      try {
        configured = Boolean(
          typeof process !== 'undefined' &&
          process.env &&
          process.env[provider.keyEnv]
        );
      } catch {
        configured = false;
      }
    }

    result[name] = {
      enabled: provider.enabled,
      keyEnv: provider.keyEnv,
      configured
    };
  }

  return result;
}


/* =========================================================
   PUBLIC CONTROL SNAPSHOT
   ========================================================= */

export function getControlSnapshot() {
  return Object.freeze({
    name: KAI_CONTROL.identity.name,
    version: KAI_CONTROL.identity.version,
    project: KAI_CONTROL.identity.project,

    fallbackChain:
      getFallbackChain(),

    enabledProviders:
      getEnabledProviders(),

    capabilities:
      [...KAI_ENABLED_CAPABILITIES],

    authorizationRequired:
      KAI_CONTROL.authorization.required,

    failClosed:
      KAI_CONTROL.security.failClosed,

    secretDisclosureBlocked:
      KAI_CONTROL.security.neverReturnSecretValues,

    destructiveOperations:
      KAI_CONTROL.permissions.destructiveOperations
  });
}


/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default KAI_CONTROL;
