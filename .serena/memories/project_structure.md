# プロジェクト構造（2025年8月2日更新）

## ディレクトリ構成
```
Wi-Fi-Monitoring/
├── README.md                          # プロジェクト説明書（修正済み）
├── scripts/
│   ├── mac.sh                         # メイン監視スクリプト（Wi-Fi情報取得修正済み）
│   ├── install.sh                     # 自動インストールスクリプト
│   ├── uninstall.sh                   # アンインストールスクリプト
│   └── setup_config.sh                # 設定ファイル初期化スクリプト
├── config/
│   └── network_monitor.conf           # 設定ファイル（環境別カスタマイズ）
├── launchd/
│   └── com.user.networkmonitor.plist  # macOS自動実行設定
├── network_monitor_log.csv            # ログファイル（実行時生成、正常動作中）
├── .gitignore                         # Git除外設定
├── .vscode/                           # VS Code設定
│   └── settings.json                  # スペルチェック辞書
└── .serena/                           # Serena設定
    ├── project.yml                    # Serena設定（shell言語に修正）
    └── memories/                      # Serenaメモリファイル
```

## 主要ファイルの状態

### scripts/mac.sh
- **最新修正**: system_profilerベースのWi-Fi情報取得に変更
- **修正内容**: airportコマンドから現代的なアプローチに移行
- **動作状況**: SSID、Signal、Noise、Channel、TransmitRate正常取得
- **BSSID**: macOSセキュリティ制限により取得困難（N/A）

### network_monitor_log.csv
- **最新状況**: 正常にログ記録中
- **Wi-Fi環境**: binky-3d4704-5G (802.11ax)
- **性能**: TransmitRate 648-720 Mbps（優良）
- **信号品質**: -55〜-58 dBm（良好）

### config/network_monitor.conf
- **設定方式**: 独立設定ファイル方式
- **自動検出**: ルーターIP 192.168.2.1
- **外部ターゲット**: 複数DNS配列 ["8.8.8.8", "1.1.1.1", "208.67.222.222"]