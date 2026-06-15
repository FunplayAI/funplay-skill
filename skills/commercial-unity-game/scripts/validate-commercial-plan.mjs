import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const gateSpecs = [
  {
    id: 'coreLoop',
    label: 'core loop',
    patterns: [/\bcore\s+loop\b/i, /\bprimary\s+loop\b/i, /核心循环/]
  },
  {
    id: 'architecture',
    label: 'Unity architecture',
    patterns: [/\barchitecture\b/i, /\bframework\b/i, /\bcontroller\b/i, /架构/]
  },
  {
    id: 'bootstrap',
    label: 'bootstrap',
    patterns: [/\bbootstrap\b/i, /\bGameInit\b/, /\binit(?:ialization)? order\b/i, /启动|初始化顺序/]
  },
  {
    id: 'persistence',
    label: 'save/persistence',
    patterns: [/\bsave\b/i, /\bpersistence\b/i, /\bProperty<[^>]+>/, /\bstorage\b/i, /存档|持久化/]
  },
  {
    id: 'dataPipeline',
    label: 'data-driven content pipeline',
    patterns: [/\bdata[-\s]?driven\b/i, /\bScriptableObject\b/, /\bCSV\b|\bJSON\b/, /数据驱动|配置表/]
  },
  {
    id: 'economy',
    label: 'economy and currency',
    patterns: [/\beconomy\b/i, /\bcurrency\b/i, /\breward curve\b/i, /\bcoin[s]?\b/i, /经济|货币|奖励曲线/]
  },
  {
    id: 'monetization',
    label: 'monetization/IAP/shop',
    patterns: [/\bIAP\b/i, /\bshop\b/i, /\bstore\b/i, /\bpurchase\b/i, /\bmonetization\b/i, /内购|商店|商业化|变现/]
  },
  {
    id: 'retention',
    label: 'retention/meta progression',
    patterns: [/\bretention\b/i, /\bdaily login\b/i, /\bstreak\b/i, /\boffline reward\b/i, /\bmeta[-\s]?progression\b/i, /留存|每日登录|离线奖励|元进度/]
  },
  {
    id: 'assetAudioPipeline',
    label: 'asset/audio/juice pipeline',
    patterns: [/\basset pipeline\b/i, /\bart direction\b/i, /\baudio\b/i, /\bSFX\b/i, /\bBGM\b/i, /\bjuice\b/i, /资源管线|美术|音频|手感/]
  },
  {
    id: 'analyticsRemoteConfig',
    label: 'analytics/remote config',
    patterns: [/\banalytics\b/i, /\bremote config\b/i, /\btelemetry\b/i, /\battribution\b/i, /埋点|远程配置|分析|归因/]
  },
  {
    id: 'unityVerification',
    label: 'Unity MCP verification',
    patterns: [/\bUnity MCP\b/i, /\bFunplay MCP\b/i, /\bPlay Mode\b/i, /\bcompile\b/i, /\bscreenshot\b/i, /\breadback\b/i, /编译|截图|读回|控制台/]
  },
  {
    id: 'riskReadiness',
    label: 'risks and readiness',
    patterns: [/\brisk[s]?\b/i, /\breadiness\b/i, /\bmanual validation\b/i, /\bdevice\b/i, /\bstore\b/i, /\bprivacy\b/i, /风险|就绪|人工验证|真机|商店|隐私/]
  }
];

function normalizeText(text) {
  return String(text ?? '').replace(/```[\s\S]*?```/g, ' ');
}

function countHeadings(text) {
  return (text.match(/^#{2,3}\s+\S+/gm) ?? []).length;
}

export function validateCommercialPlan(text, options = {}) {
  const source = normalizeText(text);
  const minSections = options.minSections ?? 8;
  const errors = [];
  const warnings = [];

  if (!source.trim()) {
    return {
      ok: false,
      errors: ['Plan text is empty.'],
      warnings,
      stats: { headingCount: 0, gateCount: 0, found: {} }
    };
  }

  const found = {};
  for (const gate of gateSpecs) {
    found[gate.id] = gate.patterns.some((pattern) => pattern.test(source));
    if (!found[gate.id]) {
      errors.push(`Missing ${gate.label} coverage.`);
    }
  }

  const headingCount = countHeadings(source);
  if (headingCount < minSections) {
    errors.push(`Expected at least ${minSections} second/third-level sections, found ${headingCount}.`);
  }

  if (!/\bMVP\b|\bv1\b|\bnon[-\s]?goals?\b|非目标|范围/i.test(source)) {
    warnings.push('Consider separating MVP, v1 commercial scope, and non-goals.');
  }

  if (!/\bdevice\b|\bsandbox\b|\bstore\b|\bSDK\b|真机|沙盒|商店/i.test(source)) {
    warnings.push('Call out device, store sandbox, or SDK validation that cannot be proven by static files alone.');
  }

  const gateCount = Object.values(found).filter(Boolean).length;

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      headingCount,
      gateCount,
      requiredGateCount: gateSpecs.length,
      found
    }
  };
}

export async function validateCommercialPlanFile(path, options = {}) {
  const text = await readFile(path, 'utf8');
  return {
    file: basename(path),
    ...validateCommercialPlan(text, options)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node skills/commercial-unity-game/scripts/validate-commercial-plan.mjs <plan.md>');
    process.exit(2);
  }

  try {
    const result = await validateCommercialPlanFile(path);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
