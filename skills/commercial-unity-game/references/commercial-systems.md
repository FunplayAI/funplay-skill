# Commercial Systems Checklist

Use this reference when the request involves save data, IAP, shop, retention, analytics, remote config, stability, or deciding whether a Unity game is more than a prototype.

## Save And Persistence

Track player-facing state from day one:

- Current level, tutorial progress, onboarding flags, settings, and last active timestamps.
- Currency balances, inventory, booster counts, shop grant history, and purchase recovery state.
- Daily login counters, streaks, offline reward timers, cooldowns, and feature unlock flags.
- Attribution fields, consent/privacy flags, and analytics identifiers if the product needs them.

Use observable state plus centralized storage. Avoid writing save data directly from UI widgets.

## Currency, Inventory, And Shop

- Mutate currency through one API, for example `ChangeCoins(delta, reason)`, so economy telemetry and UI updates stay consistent.
- Store shop items in config: SKU, price tier, rewards, grants, labels, limits, and experiment flags.
- Treat IAP grant flow as idempotent. A purchase callback may retry or arrive after a restart.
- Keep product display, localized price, ownership state, and grant state separate.

## Retention Loops

Common mobile/F2P loops:

- Daily login or daily quest with clear reset rules.
- Streaks that reward consecutive play without making one missed day fatal.
- Offline reward or timed claim with visible cooldown and cap.
- Meta-progression such as chapters, collection, decoration, unlocks, or long-term goals.
- Review prompt, notification hooks, and comeback rewards only after platform policy is understood.

Retention should support the core loop. Do not add daily systems that hide an unproven mechanic.

## Analytics And Remote Config

Before SDK wiring, define the event and config shape:

- First session: install/open, tutorial start/complete, first level start/complete/fail.
- Economy: source/sink, currency delta, balance after, reason, item/SKU, grant result.
- Retention: daily login, offline reward, streak, meta unlock, return source.
- Stability: asset load failure, config fallback, save migration, SDK init result.
- Remote config: economy curves, product catalog, feature toggles, ad caps, difficulty tuning, rollout flags.

Use remote config for tuning, not for hiding unfinished core logic.

## Stability And Recovery

- Boot must survive missing or stale remote config by falling back to bundled defaults.
- Asset loading should report missing paths and use a visible fallback when appropriate.
- Save migration should be versioned and repeatable.
- Network and SDK failures should degrade gracefully.
- Frequently spawned objects should be pooled.
- Console warnings from the happy path should be treated as production debt.

## Commercial Audit Questions

- What can a returning player do today, tomorrow, and after a week?
- Which values can design or ops tune without code changes?
- What happens if IAP succeeds but the app closes before the reward animation?
- Can the user recover purchases or restore state after a restart?
- Which checks require a real device, store sandbox, privacy review, or backend environment?
