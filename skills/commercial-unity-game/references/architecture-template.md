# Commercial Unity Architecture Template

Use this reference when creating or auditing the Unity project structure, bootstrap, framework primitives, and feature boundaries for a commercial mobile/F2P game.

## Suggested Layout

```text
Assets/
  Game/
    Scripts/
      <GameNamespace>/
        GameInit.cs
        Framework/
          Singleton.cs
          Property.cs
          Storage.cs
          MsgBus.cs
          ResManager.cs
          PoolManager.cs
        Gameplay/
          GameplayController.cs
          GameplayModel.cs
          GameplayPanel.cs
        UI/
          PanelController.cs
          PanelBase.cs
        Levels/
          LevelController.cs
          LevelModel.cs
          LevelConfig.cs
        Economy/
          CurrencyController.cs
          CurrencyModel.cs
          ShopController.cs
          ShopConfigDatabase.cs
        Retention/
          DailyLoginController.cs
          OfflineRewardController.cs
        Audio/
          AudioController.cs
        Editor/
          Importers/
    Data/
    Prefabs/
    Scenes/
    Art/
    Audio/
```

Use the actual project conventions when they already exist. The important part is not the exact folder names; it is that framework, gameplay, UI, content data, economy, retention, and editor importers have clear ownership.

## Bootstrap

Create a single boot scene or boot object responsible for deterministic initialization:

1. Load local config and save state.
2. Initialize asset loading.
3. Initialize low-level services: storage, event bus, audio, analytics stubs.
4. Initialize player data, level/content data, economy, shop, retention, and UI controllers in dependency order.
5. Route to onboarding, home, or gameplay based on saved player state.

Avoid hidden initialization in random scene objects. Commercial games need predictable boot behavior so failed assets, migration errors, and SDK failures can be reported clearly.

## Framework Primitives

- `Property<T>`: observable player-facing state. Use it for currency, level, inventory, settings, timers, tutorial flags, and feature gates.
- `Storage`: a typed wrapper around the local save backend. Keep the backend swappable.
- `MsgBus` or typed event bus: decouple UI, economy, retention, and gameplay events.
- `PanelController`: owns screen/popup stack, transitions, back handling, and modal priority.
- `ResManager`: centralizes asset loading, fallback handling, and release policy.
- `PoolManager`: avoids allocation churn for spawned gameplay objects, rewards, particles, and UI effects.

## Feature Shape

Use a stable triad for each major feature:

- Model: state and tiny mutators only.
- Controller: orchestration and public API.
- View/panel/presenter: Unity references, visual updates, input forwarding.

Controllers should not rely on scene references unless that is the explicit feature boundary. UI should observe models rather than polling or duplicating state.

## Verification Notes

After implementation, use Funplay Unity MCP to:

- Recompile and inspect console errors.
- Read back boot scene objects, controller roots, and serialized references.
- Enter Play Mode and assert init state.
- Capture a screenshot of the first routed screen.
- Report any SDK, device, network, or store checks that remain manual.
