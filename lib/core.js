const PROVIDERS = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    model: 'openai/gpt-oss-120b',
    base: 'https://openrouter.ai/api/v1',
    keyEnv: 'OPENROUTER_API_KEY'
  },
  {
    id: 'groq',
    name: 'Groq',
    model: 'openai/gpt-oss-120b',
    base: 'https://api.groq.com/openai/v1',
    keyEnv: 'GROQ_API_KEY'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-5.4-mini',
    base: 'https://api.openai.com/v1',
    keyEnv: 'OPENAI_API_KEY'
  },
  {
    id: 'google',
    name: 'Google Gemini',
    model: 'gemini-2.5-flash',
    kind: 'google',
    keyEnv: 'GOOGLE_API_KEY'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    model: 'mistral-small-latest',
    base: 'https://api.mistral.ai/v1',
    keyEnv: 'MISTRAL_API_KEY'
  }
];

const SPECIALISTS = {
  visual: {
    id: 'visual',
    name: 'Visual Agent',
    description:
      'Handles image understanding, screenshots, visual analysis, visual reasoning and image-related tasks.',
    capabilities: [
      'image-analysis',
      'screenshot-analysis',
      'visual-reasoning',
      'image-generation'
    ]
  },

  coding: {
    id: 'coding',
    name: 'Coding Agent',
    description:
      'Handles programming, debugging, refactoring, architecture and code generation.',
    capabilities: [
      'code-generation',
      'debugging',
      'refactoring',
      'architecture',
      'code-review'
    ]
  },

  research: {
    id: 'research',
    name: 'Knowledge Research Agent',
    description:
      'Handles research, knowledge gathering, summarization, comparisons and evidence-based analysis.',
    capabilities: [
      'research',
      'web-research',
      'fact-analysis',
      'summarization',
      'comparison'
    ]
  },

  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity Agent',
    description:
      'Handles defensive cybersecurity, threat modeling, secure coding and security analysis.',
    capabilities: [
      'security-analysis',
      'threat-modeling',
      'secure-coding',
      'incident-analysis',
      'defensive-security'
    ]
  },

  creative: {
    id: 'creative',
    name: 'Creative Agent',
    description:
      'Handles writing, advertising, marketing, scripts, ideas and creative content.',
    capabilities: [
      'writing',
      'advertising',
      'marketing',
      'scripts',
      'creative-ideas'
    ]
  }
};

function getEnvValue(env, key) {
  if (env && typeof env === 'object' && env[key]) {
    return env[key];
  }

  if (
    typeof globalThis !== 'undefined' &&
    globalThis.process &&
    globalThis.process.env
  ) {
    return globalThis.process.env[key];
  }

  return null;
}

function getConfiguredProviders(env = {}) {
  return PROVIDERS.filter((provider) => {
    const key = getEnvValue(env, provider.keyEnv);
    return typeof key === 'string' && key.trim().length > 0;
  });
}

function getProviderStatus(env = {}) {
  return [
    ...PROVIDERS.map((provider) => ({
      id: provider.id,
      provider: provider.name,
      model: provider.model,
      configured: Boolean(getEnvValue(env, provider.keyEnv))
    })),
    {
      id: 'kai',
      provider: 'KAI',
      model: 'kai',
      configured: true
    }
  ];
}

function getFallbackChain(env = {}) {
  return [
    ...getConfiguredProviders(env),
    {
      id: 'kai',
      name: 'KAI',
      model: 'kai',
      kind: 'kai'
    }
  ];
}

function getSpecialist(id) {
  return SPECIALISTS[id] || null;
}

function getSpecialists() {
  return Object.values(SPECIALISTS);
}

function classifyTask(input = {}) {
  const text = String(
    input.task ??
    input.prompt ??
    input.message ??
    ''
  ).toLowerCase();

  if (
    /image|photo|picture|visual|screenshot|diagram|look at|see this|camera/.test(
      text
    )
  ) {
    return 'visual';
  }

  if (
    /code|coding|program|javascript|typescript|python|html|css|react|bug|debug|function|api|database|sql|refactor/.test(
      text
    )
  ) {
    return 'coding';
  }

  if (
    /hack|hacking|cyber|security|vulnerability|cve|exploit|threat|malware|phishing|incident|secure/.test(
      text
    )
  ) {
    return 'cybersecurity';
  }

  if (
    /research|search|investigate|study|latest|compare|sources|facts|information|knowledge/.test(
      text
    )
  ) {
    return 'research';
  }

  if (
    /write|rewrite|story|script|ad|advertisement|marketing|caption|creative|idea|content|copy/.test(
      text
    )
  ) {
    return 'creative';
  }

  return 'research';
}

function buildSpecialistSystemPrompt(specialist, baseSystem = '') {
  return [
    baseSystem,
    `You are the ${specialist.name} inside HAxBRO AI.`,
    specialist.description,
    '',
    'Stay focused on your specialist role.',
    'Do not pretend to have capabilities you do not have.',
    'For cybersecurity tasks, operate defensively and only on authorized targets.',
    'Return useful, concrete results that can be passed back to the KAI orchestrator.'
  ]
    .filter(Boolean)
    .join('\n');
}

function getProviderHeaders(provider, key) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`
  };

  if (provider.id === 'openrouter') {
    headers['HTTP-Referer'] = 'https://haxbro.hatchable.site';
    headers['X-Title'] = 'HAxBRO AI';
  }

  return headers;
}

async function callOpenAICompatible(
  provider,
  key,
  messages,
  options = {}
) {
  const response = await fetch(
    `${provider.base}/chat/completions`,
    {
      method: 'POST',
      headers: getProviderHeaders(provider, key),
      body: JSON.stringify({
        model: provider.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 4096,
        stream: false
      })
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => '');

    throw new Error(
      `${provider.name} returned ${response.status}: ${body.slice(0, 500)}`
    );
  }

  const data = await response.json();

  const text =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.text ??
    '';

  if (!text) {
    throw new Error(`${provider.name} returned an empty response`);
  }

  return {
    text,
    provider: provider.name,
    model: provider.model
  };
}

async function callGemini(
  provider,
  key,
  messages,
  options = {}
) {
  const systemParts = [];
  const contents = [];

  for (const message of messages) {
    if (message.role === 'system') {
      systemParts.push(String(message.content ?? ''));
      continue;
    }

    contents.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [
        {
          text: String(message.content ?? '')
        }
      ]
    });
  }

  if (!contents.length) {
    contents.push({
      role: 'user',
      parts: [{ text: '' }]
    });
  }

  const payload = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.max_tokens ?? 4096
    }
  };

  if (systemParts.length) {
    payload.systemInstruction = {
      parts: [
        {
          text: systemParts.join('\n\n')
        }
      ]
    };
  }

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(provider.model)}` +
    `:generateContent?key=${encodeURIComponent(key)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');

    throw new Error(
      `Google Gemini returned ${response.status}: ${body.slice(0, 500)}`
    );
  }

  const data = await response.json();

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('') || '';

  if (!text) {
    throw new Error('Google Gemini returned an empty response');
  }

  return {
    text,
    provider: provider.name,
    model: provider.model
  };
}

async function callProvider(
  provider,
  env,
  messages,
  options = {}
) {
  if (provider.kind === 'kai') {
    throw new Error(
      'KAI is the final orchestration fallback and is handled by the KAI layer.'
    );
  }

  const key = getEnvValue(env, provider.keyEnv);

  if (!key) {
    throw new Error(`${provider.name} is not configured`);
  }

  if (provider.kind === 'google') {
    return callGemini(provider, key, messages, options);
  }

  return callOpenAICompatible(
    provider,
    key,
    messages,
    options
  );
}

async function complete(input = {}, env = {}) {
  const specialistId =
    input.specialist ||
    input.agent ||
    classifyTask(input);

  const specialist =
    getSpecialist(specialistId) ||
    SPECIALISTS.research;

  const originalMessages = Array.isArray(input.messages)
    ? input.messages
    : [
        {
          role: 'user',
          content: String(
            input.prompt ??
            input.task ??
            input.message ??
            ''
          )
        }
      ];

  const messages = [
    {
      role: 'system',
      content: buildSpecialistSystemPrompt(
        specialist,
        input.system || ''
      )
    },
    ...originalMessages
  ];

  const options = {
    temperature: input.temperature,
    max_tokens: input.max_tokens
  };

  const providers = getConfiguredProviders(env);
  const failures = [];

  for (const provider of providers) {
    try {
      const result = await callProvider(
        provider,
        env,
        messages,
        options
      );

      return {
        ok: true,
        text: result.text,
        provider: result.provider,
        model: result.model,
        specialist: specialist.id,
        specialistName: specialist.name,
        fallbackUsed: failures.length > 0,
        failures
      };
    } catch (error) {
      failures.push({
        provider: provider.name,
        model: provider.model,
        error:
          error instanceof Error
            ? error.message
            : String(error)
      });
    }
  }

  return {
    ok: false,
    text: '',
    provider: 'KAI',
    model: 'kai',
    specialist: specialist.id,
    specialistName: specialist.name,
    fallbackUsed: true,
    needsKaiFallback: true,
    failures,
    error: 'All configured inference providers failed'
  };
}

function getProvider(env = {}) {
  const configured = getConfiguredProviders(env);

  return (
    configured[0] || {
      id: 'kai',
      name: 'KAI',
      model: 'kai',
      kind: 'kai'
    }
  );
}

function getEnabledProviders(env = {}) {
  return getFallbackChain(env);
}

function getProviderEnvironmentStatus(env = {}) {
  return getProviderStatus(env);
}

export {
  PROVIDERS,
  SPECIALISTS,
  complete,
  classifyTask,
  getSpecialist,
  getSpecialists,
  getProvider,
  getEnabledProviders,
  getFallbackChain,
  getProviderStatus,
  getProviderEnvironmentStatus
};

export default {
  PROVIDERS,
  SPECIALISTS,
  complete,
  classifyTask,
  getSpecialist,
  getSpecialists,
  getProvider,
  getEnabledProviders,
  getFallbackChain,
  getProviderStatus,
  getProviderEnvironmentStatus
};
