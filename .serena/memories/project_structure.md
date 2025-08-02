# プロジェクト構造（更新版）

## ディレクトリ構成
```
Wi-Fi-Monitoring/
├── README.md                          # プロジェクト説明書
├── scripts/
│   └── mac.sh                         # メイン監視スクリプト
├── launchd/
│   └── com.user.networkmonitor.plist  # macOS自動実行設定
├── network_monitor_log.csv            # ログファイル（実行時生成）
├── .gitignore                         # Git除外設定
├── .vscode/
│   └── settings.json                  # VS Code設定（スペルチェック辞書）
└── .serena/
    ├── project.yml                    # Serena設定
    └── memories/                      # Serenaメモリファイル
```

## ファイル詳細

### scripts/mac.sh
- **機能**: ネットワーク品質測定とログ記録
- **実行方法**: `./scripts/mac.sh`
- **権限**: 実行可能 (755)
- **ログパス**: スクリプトから相対的に `../network_monitor_log.csv`

### launchd/com.user.networkmonitor.plist
- **機能**: macOS launchdによる自動実行設定
- **実行間隔**: 300秒（5分）
- **ログ出力**: `/tmp/networkmonitor.*.log`
- **設定**: 絶対パス `/Users/tksm/workspace/tools/Wi-Fi-Monitoring/scripts/mac.sh`

### README.md
- **内容**: インストール手順、使用方法、設定説明
- **対象**: 新規ユーザー向けドキュメント