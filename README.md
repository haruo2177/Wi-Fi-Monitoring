# Network Quality Monitor

マルチプラットフォーム対応のネットワーク品質監視ツールです。定期的にネットワーク接続の状態を測定し、結果を CSV ファイルに記録します。

## 対応プラットフォーム

| プラットフォーム | 状態        | ディレクトリ         | 主要技術                          |
| ---------------- | ----------- | -------------------- | --------------------------------- |
| **macOS**        | ✅ 完全対応 | `platforms/macos/`   | Zsh, system_profiler, launchd     |
| **Windows**      | 🚧 開発予定 | `platforms/windows/` | PowerShell, netsh, Task Scheduler |
| **Ubuntu/Linux** | 🚧 開発予定 | `platforms/ubuntu/`  | Bash, iwconfig, systemd           |

## 主要な機能

- **ネットワーク監視**: ローカルルーター・外部サーバーへの Ping 測定
- **Wi-Fi 詳細情報**: SSID、信号強度、チャンネル、転送レート取得
- **自動実行**: プラットフォーム固有のスケジューラー統合
- **CSV 記録**: 統一されたデータ形式での記録
- **設定自動検出**: 環境に応じた最適設定の自動生成

## プロジェクト構造

```
Wi-Fi-Monitoring/
├── README.md                    # このファイル
├── platforms/                  # プラットフォーム別実装
│   ├── macos/                   # macOS専用（完成）
│   ├── windows/                 # Windows専用（開発予定）
│   └── ubuntu/                  # Ubuntu専用（開発予定）
├── shared/                      # 共通リソース
│   ├── templates/               # 設定テンプレート
│   └── docs/                    # 技術ドキュメント
├── logs/                        # ログファイル（実行時作成）
└── docs/                        # プロジェクトドキュメント
```

## 使用方法

### macOS

```bash
# macOSディレクトリに移動
cd platforms/macos/

# 設定ファイル初期化
./scripts/setup_config.sh

# 単発実行
./scripts/network_monitor.sh

# 自動インストール
./scripts/install.sh
```

### Windows（開発予定）

```powershell
# Windowsディレクトリに移動
cd platforms\windows\

# 設定初期化
.\scripts\setup_config.ps1

# 実行
.\scripts\network_monitor.ps1
```

### Ubuntu/Linux（開発予定）

```bash
# Ubuntuディレクトリに移動
cd platforms/ubuntu/

# 設定初期化
./scripts/setup_config.sh

# 実行
./scripts/network_monitor.sh
```

## 出力データ形式

全プラットフォームで統一された CSV 形式でデータを記録します：

```csv
Timestamp,ConnectionType,InterfaceName,RouterPingAvg(ms),RouterPingMax(ms),RouterLoss(%),ExternalPingAvg(ms),ExternalPingMax(ms),ExternalLoss(%),SSID,BSSID,Signal(dBm),Noise(dBm),Channel,TransmitRate(Mbps)
```

詳細な形式仕様は [`shared/docs/CSV_FORMAT.md`](shared/docs/CSV_FORMAT.md) を参照してください。

## 技術的な詳細

### ネットワーク監視概念

測定項目の技術的意味については [`shared/docs/NETWORK_CONCEPTS.md`](shared/docs/NETWORK_CONCEPTS.md) を参照してください。

### プラットフォーム固有の実装

各プラットフォームの詳細な実装情報は、対応するディレクトリの README.md を参照してください：

- [macOS 実装詳細](platforms/macos/README.md)
- [Windows 実装詳細](platforms/windows/README.md)
- [Ubuntu 実装詳細](platforms/ubuntu/README.md)

## 開発状況

### 完了済み

- ✅ macOS 版の完全実装
- ✅ system_profiler ベースの Wi-Fi 情報取得
- ✅ launchd 統合
- ✅ 自動設定検出機能
- ✅ マルチプラットフォーム構造設計

### 開発予定

- 🚧 Windows 版の実装
- 🚧 Ubuntu/Linux 版の実装
- 🚧 統一された設定管理ツール
- 🚧 クロスプラットフォーム分析ツール

## 貢献とサポート

このプロジェクトはオープンソースです。バグ報告や機能改善の提案は、GitHub の Issue までお願いします。

### 開発に参加したい場合

1. プラットフォーム固有の実装
2. 共通ツールの開発
3. ドキュメントの改善
4. テストケースの作成

## ライセンス

このプロジェクトはオープンソースライセンスの下で提供されています。
