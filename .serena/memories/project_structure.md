# マルチプラットフォーム対応プロジェクト構造（2025年8月2日更新）

## 新しいディレクトリ構成

```
Wi-Fi-Monitoring/
├── README.md                          # マルチプラットフォーム概要
├── platforms/                        # プラットフォーム別実装
│   ├── macos/                         # macOS専用（完成済み）
│   │   ├── README.md                  # macOS固有説明
│   │   ├── scripts/
│   │   │   ├── mac.sh                 # 既存スクリプト（移動済み）
│   │   │   ├── install.sh             # インストールスクリプト
│   │   │   ├── uninstall.sh           # アンインストール
│   │   │   └── setup_config.sh        # 設定初期化
│   │   ├── config/
│   │   │   └── network_monitor.conf   # 設定ファイル（移動済み）
│   │   └── launchd/
│   │       └── com.user.networkmonitor.plist
│   ├── windows/                       # Windows専用（構造のみ）
│   │   ├── README.md                  # Windows固有説明
│   │   ├── scripts/                   # PowerShellスクリプト用
│   │   ├── config/                    # Windows設定用
│   │   └── scheduled_tasks/           # タスクスケジューラ用
│   └── ubuntu/                        # Ubuntu専用（構造のみ）
│       ├── README.md                  # Ubuntu固有説明
│       ├── scripts/                   # Bashスクリプト用
│       ├── config/                    # Ubuntu設定用
│       └── systemd/                   # systemdサービス用
├── shared/                            # 共通リソース
│   ├── templates/
│   │   └── base_config.conf           # 共通設定テンプレート
│   └── docs/
│       ├── CSV_FORMAT.md              # CSV形式仕様
│       └── NETWORK_CONCEPTS.md        # ネットワーク監視概念
├── logs/                              # ログディレクトリ
│   ├── README.md                      # ログディレクトリ説明
│   ├── .gitkeep                       # Git用
│   └── network_monitor_log.csv        # メインログ（移動済み）
├── docs/                              # プロジェクトドキュメント
├── .gitignore                         # マルチプラットフォーム対応更新
├── .vscode/                           # VS Code設定
└── .serena/                           # Serena設定
    ├── project.yml                    # マルチプラットフォーム対応更新
    └── memories/                      # 更新済みメモリ
```

## 実装状況

### 完了済み（macOS）
- ✅ 既存ファイルの適切な移動
- ✅ macOS固有のREADME作成
- ✅ 動作実績あり（system_profiler使用）
- ✅ SSID, Signal, Channel, TransmitRate取得成功

### 構造準備済み（Windows/Ubuntu）
- ✅ ディレクトリ構造作成
- ✅ プラットフォーム固有README作成
- ✅ 技術仕様文書化
- 🚧 実装スクリプトは今後作成予定

### 共通基盤
- ✅ 統一CSV形式仕様
- ✅ 共通設定テンプレート
- ✅ ネットワーク監視概念文書
- ✅ マルチプラットフォーム対応.gitignore

## 技術仕様統一

### CSV出力形式
全プラットフォームで同一のCSVヘッダーと形式を使用

### 設定項目統一
- LOGFILE_PATH, EXTERNAL_TARGETS[], ROUTER_ADDRESS
- PING_COUNT, PING_TIMEOUT, DEBUG
- プラットフォーム固有設定を含む包括的テンプレート

### ディレクトリ命名規則
- platforms/{os}/scripts/ - 実行スクリプト
- platforms/{os}/config/ - 設定ファイル
- platforms/{os}/{scheduler}/ - プラットフォーム固有自動実行