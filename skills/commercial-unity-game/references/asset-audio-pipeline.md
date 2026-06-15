# Asset, UI, Juice, And Audio Pipeline

Use this reference when the commercial plan needs a production route for 2D art, UI assets, visual effects, audio, and Unity import verification.

## Asset Planning

Start with an asset brief rather than generating one-off images:

- Art direction rule and anti-reference.
- Target aspect ratios and safe areas.
- Backgrounds, gameplay pieces, icons, panels, buttons, store cards, reward effects, logo, and loading screen.
- Which assets require transparency or cutout.
- Which text must be rendered in-engine instead of baked into art.
- Reuse rules for variants, palettes, states, and localization.

For UI prompt and cutout planning, route to `game-ui-asset-brief` when the task is mostly about UI asset specification.

## Import Rules

- Keep raw generated/source files separate from production-ready cutouts.
- Import 2D UI/gameplay images as sprites with consistent pixels-per-unit.
- Disable mipmaps for crisp UI sprites unless the project has a specific scaling reason.
- Verify alpha edges on dark and light backgrounds.
- Build prefabs from imported sprites, not from temporary external paths.
- Use stable asset paths so generated references do not break after a reimport.

## Juice Layer

Commercial casual games need visible response:

- Button press, panel open/close, reward reveal, coin fly, level complete, failure, streak, and purchase success.
- Use tweening consistently, but keep durations short.
- Add particles and screen feedback where the player earns or loses something.
- Add haptics only where the target platform and policy allow it.
- Verify motion and visibility in Play Mode, not only scene view.

## Audio

Define the audio map:

- UI click, back, confirm, error.
- Gameplay action, combo/streak, reward, purchase, win, lose.
- Home/menu music and gameplay music if the design needs distinct loops.
- Mute settings and saved volume.

Audio may come from generated sounds, licensed packs, composer work, or internal libraries. The agent can prepare import paths and playback systems, but user audition is required before calling audio final.

## Funplay MCP Verification

Use Unity MCP to:

- Refresh assets and inspect importer settings.
- Confirm sprites/audio clips are assigned to prefabs.
- Capture screenshots of UI states and reward flows.
- Enter Play Mode to verify transitions, SFX triggers, mute settings, and missing-reference console output.

Do not claim art or audio is final unless a human has reviewed the actual images and sounds.
