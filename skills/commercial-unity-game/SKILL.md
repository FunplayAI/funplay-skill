---
name: commercial-unity-game
description: Use this when designing, building, or auditing a commercial-grade Unity mobile/F2P game beyond prototype scope, including architecture, save data, data-driven content, economy, IAP/shop, retention, asset/audio pipelines, analytics, remote config, and Funplay Unity MCP verification.
category: engine-workflow
dependencies:
  - Funplay MCP for Unity
  - unity-mcp-workflow
inputs:
  - Unity project root or greenfield Unity game brief
  - target platform and business model
  - core mechanic, art direction, and production constraints
outputs:
  - commercial Unity production plan
  - architecture and system checklist
  - MCP-grounded verification plan
  - remaining manual, device, store, or SDK validation notes
examples:
  - Ask the agent to turn a Unity puzzle prototype into a commercial F2P production plan with economy, retention, data pipeline, and Play Mode validation gates.
---

# Commercial Unity Game

Use this skill when the user asks for a commercial, premium, F2P, mobile, store-ready, or retention/monetization-aware Unity game workflow. This skill complements `unity-mcp-workflow`: use this skill to decide what a commercial game needs, then use `unity-mcp-workflow` to verify Unity Editor state, compilation, Play Mode behavior, screenshots, hierarchy, and console output.

Do not treat a prototype as commercial-grade just because the core mechanic runs. A commercial Unity game needs persistent state, tuned content, economy, retention, platform risk handling, and a verification trail.

## Operating Loop

1. Capture the product frame.
   - Define target platform, session length, business model, target player, genre, and the one mechanic or fantasy that must survive production.
   - Separate MVP, v1 commercial requirements, and post-launch/live-ops scope.
2. Build the commercial plan before broad implementation.
   - Draft a markdown plan with sections for core loop, architecture, bootstrap, persistence, data pipeline, economy, monetization, retention, asset/audio pipeline, analytics/remote config, Unity MCP verification, and risks.
   - Validate the plan with `node <path-to-this-skill>/scripts/validate-commercial-plan.mjs <plan.md>`.
3. Read only the reference files needed for the current decision.
   - Architecture/bootstrap: `references/architecture-template.md`
   - Save, IAP, retention, analytics, stability: `references/commercial-systems.md`
   - CSV/JSON to ScriptableObject workflows: `references/data-pipeline.md`
   - Currency, reward curves, shop, idle rewards: `references/economy-design.md`
   - Art, UI assets, cutouts, audio, import checks: `references/asset-audio-pipeline.md`
4. Implement in verifiable phases.
   - Core loop and feel come before monetization.
   - Framework, bootstrap, save, content data, and economy are persistent code/assets.
   - Scene/prefab assembly and readback should use Funplay Unity MCP when available.
5. Report evidence honestly.
   - Distinguish static file edits, compilation, Play Mode behavior, screenshots, device/store checks, SDK checks, and manual art/audio review.
   - Never claim IAP, attribution, push notifications, privacy prompts, remote config, or store compliance as verified unless the relevant SDK/device/store path was actually tested.

## Commercial Readiness Gates

A plan is not commercial-ready until it covers:

- Core loop and first-session fun.
- Unity architecture and deterministic bootstrap order.
- Save/persistence for player-facing state.
- Data-driven content and tuning pipeline.
- Economy, currency, rewards, shop, and IAP shape.
- Retention and meta-progression loops.
- Asset, UI, juice, and audio production route.
- Analytics, attribution fields, and remote config hooks.
- Unity MCP compile/Play Mode/screenshot/readback verification.
- Risks, non-goals, and manual validation still required.

## Phase Order

1. **Prototype-to-pillar**: identify the single fun loop and remove ideas that dilute it.
2. **Framework and bootstrap**: establish project structure, init order, event bus, storage, and panel/navigation shell.
3. **Core gameplay vertical slice**: implement one polished loop and verify it in Play Mode.
4. **Persistence**: make player-facing values observable and saved from day one.
5. **Data pipeline**: move levels, shop, rewards, curves, chapters, and balance values out of hardcoded logic.
6. **Economy and shop**: design currency sinks/sources, product catalog, reward curves, and safe IAP grant flow.
7. **Retention/meta**: add daily login, streaks, offline rewards, meta progression, and return reasons only after the core loop works.
8. **Polish layer**: add UI transitions, particles, haptics, SFX, BGM, and visual hierarchy.
9. **Ops and platform readiness**: analytics, remote config, privacy, store flow, device checks, crash and asset-failure handling.

## Validation Script

Run the bundled validator against the plan file before implementation:

```bash
node <path-to-this-skill>/scripts/validate-commercial-plan.mjs docs/commercial-plan.md
```

The script checks whether the plan covers the required commercial gates. Passing the script does not prove the game is good or shippable; it proves the plan has the minimum production surface area for an agent to execute and verify.
