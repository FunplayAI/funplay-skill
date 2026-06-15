# Economy And Reward Design

Use this reference when designing currency, rewards, shop products, IAP packs, offline rewards, or balance curves.

## Principles

- Economy is a system of sources, sinks, pacing, and perceived value, not a list of numbers.
- Currency mutation should pass through one API with a reason string.
- Rewards and prices should be data-driven and testable.
- Late-game values should not make early-game products feel absurd or make late-game purchases worthless.
- UI numbers should look intentional: round and format large values cleanly.

## Reward Curves

Use config tables for curves:

```text
player level -> milestone value -> reward or pack amount -> rounded display value
```

Recommended fields:

- Level threshold.
- Base milestone value.
- Reward coefficient.
- Rounding step.
- Cap or final plateau.
- Optional experiment key or config version.

Use a floor-match lookup: choose the highest threshold less than or equal to the player's level. Keep the table server-configurable when the product has live-ops needs.

## Shop And IAP

Define a product catalog in config:

- SKU/product id.
- Price tier or platform product id.
- Main currency grant.
- Booster/item grants.
- Badge, discount label, first-purchase bonus, or limit.
- Display priority and visibility conditions.

Implementation requirements:

- Idempotent grant flow.
- Local receipt/pending grant state.
- Restore/retry behavior.
- Clear separation between platform price display and game reward calculation.
- Sandbox/device/store validation before release claims.

## Sources And Sinks

List every source and sink before tuning:

- Sources: level completion, daily login, offline reward, quest, ad reward, purchase, compensation.
- Sinks: level entry, retry, booster use, upgrades, decorations, chapter unlocks, shop refreshes.

For each source/sink, define unlock level, cadence, cap, expected frequency, and event logging.

## Offline Rewards

Offline/timed rewards need:

- Unlock condition.
- Cooldown and maximum accumulation.
- Base reward curve.
- Optional ad multiplier and daily cap.
- Last claim timestamp and reset policy.
- Play Mode tests for time travel or injected clock.

Keep timer state in save data. Do not rely on UI countdown text as the source of truth.

## Validation Questions

- Can the player earn and spend currency in the first session?
- Does each product still make sense at early, mid, and late progression?
- Can design retune the curve without code changes?
- Are all grants recoverable if the app restarts mid-flow?
- Are source/sink events detailed enough to debug economy leaks?
