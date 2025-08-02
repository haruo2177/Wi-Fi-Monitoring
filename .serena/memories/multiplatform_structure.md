# マルチプラットフォーム対応構造設計

## 新しいディレクトリ構造

```
Wi-Fi-Monitoring/
├── README.md                          # 全体概要とプラットフォーム対応説明
├── docs/                              # ドキュメント
│   ├── INSTALL.md                     # インストールガイド
│   ├── CONFIG.md                      # 設定ガイド
│   └── TROUBLESHOOTING.md             # トラブルシューティング
├── platforms/                        # プラットフォーム別実装
│   ├── macos/                         # macOS専用
│   │   ├── README.md                  # macOS固有の説明
│   │   ├── scripts/
│   │   │   ├── network_monitor.sh     # メイン監視スクリプト
│   │   │   ├── install.sh             # インストールスクリプト
│   │   │   ├── uninstall.sh           # アンインストールスクリプト
│   │   │   └── setup_config.sh        # 設定ファイル初期化
│   │   ├── config/
│   │   │   └── network_monitor.conf   # macOS設定テンプレート
│   │   └── launchd/
│   │       └── com.user.networkmonitor.plist
│   ├── windows/                       # Windows専用
│   │   ├── README.md                  # Windows固有の説明
│   │   ├── scripts/
│   │   │   ├── network_monitor.ps1    # PowerShellスクリプト
│   │   │   ├── network_monitor.bat    # バッチファイル
│   │   │   ├── install.ps1            # インストールスクリプト
│   │   │   └── setup_config.ps1       # 設定初期化
│   │   ├── config/
│   │   │   └── network_monitor.conf   # Windows設定テンプレート
│   │   └── scheduled_tasks/
│   │       └── NetworkMonitorTask.xml # Windows タスクスケジューラ
│   └── ubuntu/                        # Ubuntu/Linux専用
│       ├── README.md                  # Ubuntu固有の説明
│       ├── scripts/
│       │   ├── network_monitor.sh     # Bashスクリプト
│       │   ├── install.sh             # インストールスクリプト
│       │   ├── uninstall.sh           # アンインストールスクリプト
│       │   └── setup_config.sh        # 設定初期化
│       ├── config/
│       │   └── network_monitor.conf   # Ubuntu設定テンプレート
│       └── systemd/
│           ├── network-monitor.service # systemdサービス
│           └── network-monitor.timer   # systemdタイマー
├── shared/                            # 共通リソース
│   ├── templates/                     # 設定テンプレート
│   │   └── base_config.conf           # 基本設定テンプレート
│   └── docs/                          # 共通ドキュメント
│       ├── CSV_FORMAT.md              # CSV出力形式
│       └── NETWORK_CONCEPTS.md        # ネットワーク監視概念
├── logs/                              # ログディレクトリ（実行時作成）
│   ├── .gitkeep                       # Git用
│   └── README.md                      # ログディレクトリ説明
├── .gitignore                         # Git除外設定（更新）
├── .vscode/                           # VS Code設定
│   └── settings.json                  # 全プラットフォーム対応
└── .serena/                           # Serena設定
    ├── project.yml                    # マルチプラットフォーム対応
    └── memories/                      # 更新されたメモリ
```

## プラットフォーム別特徴

### macOS (platforms/macos/)
- **技術**: Zsh, system_profiler, launchd
- **権限**: 通常ユーザー
- **自動実行**: launchd UserAgent
- **Wi-Fi情報**: system_profiler SPAirPortDataType

### Windows (platforms/windows/)
- **技術**: PowerShell, netsh, Get-WmiObject
- **権限**: 通常ユーザー（一部Wi-Fi情報は管理者権限推奨）
- **自動実行**: Windows タスクスケジューラ
- **Wi-Fi情報**: netsh wlan show profiles/interfaces

### Ubuntu (platforms/ubuntu/)
- **技術**: Bash, iwconfig/iwlist, NetworkManager
- **権限**: 通常ユーザー（一部コマンドはsudo推奨）
- **自動実行**: systemd service + timer
- **Wi-Fi情報**: iwconfig, nmcli

## 共通インターフェース

### 設定項目統一
- LOGFILE_PATH
- EXTERNAL_TARGETS[]
- ROUTER_ADDRESS
- PING_COUNT
- PING_TIMEOUT
- DEBUG

### CSV出力形式統一
全プラットフォームで同一のCSVヘッダーと形式を使用