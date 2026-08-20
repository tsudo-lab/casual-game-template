# Modules

このDirectoryは、Casual Gameで再利用できる機能を将来的に整理する場所です。

予定している機能を埋めるためだけに、空実装は作りません。**実際のゲームで必要になった時だけModuleを追加します。**

想定している分類:

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

現在の共通コードは、`src/services/` や `src/storage/` に置いたままで問題ありません。

図に合わせるためだけに移動するのではなく、Moduleとして整理した方がコードが分かりやすくなる段階で移します。

基本ルール:

```text
最初に必要になった      → そのGame / Template内で実装
同じ利用が繰り返された  → modules配下へ整理
複数Templateで共通利用   → Shared Package / Repository化を検討
```

現時点ではModule専用Repositoryは作りません。
