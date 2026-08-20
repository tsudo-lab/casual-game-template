# Modules

This directory is the reserved home for reusable casual-game capabilities.

Do not create empty implementations for every planned feature. Add a module only when a real game needs it.

Planned grouping:

```text
core/
  ads
  analytics
  share
  settings

growth/
  leaderboard
  dailyChallenge
  friendChallenge

liveops/
  remoteConfig
  events
  notifications
```

Existing shared code can remain in `src/services/` and `src/storage/` until moving it here makes the codebase clearer rather than merely matching a diagram.

The module strategy is:

```text
first real use → implement in this template/game
repeated use   → organize under modules
cross-template reuse → consider extracting a shared package/repository
```
