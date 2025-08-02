# Wi-Fi Monitoring Tool

macOS 用のネットワーク品質監視ツールです。定期的にネットワーク接続の状態を測定し、結果を CSV ファイルに記録します。

## 概要

このツールは以下の機能を提供します：

- ローカルルーター（自動検出）への ping 測定
- 外部サーバー（複数のDNSサーバーから自動選択）への ping 測定
- Wi-Fi 接続時の詳細情報収集（SSID, 信号強度, チャンネル, 転送レートなど）
- 有線/無線接続の自動判別
- CSV 形式でのログ記録
- 環境設定の自動検出と最適化

## ディレクトリ構成

```
Wi-Fi-Monitoring/
├── README.md                          # このファイル
├── scripts/
│   ├── mac.sh                         # メイン監視スクリプト
│   ├── install.sh                     # 自動インストールスクリプト
│   ├── uninstall.sh                   # アンインストールスクリプト
│   └── setup_config.sh                # 設定ファイル初期化スクリプト
├── config/
│   └── network_monitor.conf           # 設定ファイル（環境別カスタマイズ）
├── launchd/
│   └── com.user.networkmonitor.plist  # macOS自動実行設定（テンプレート）
├── network_monitor_log.csv            # ログファイル（自動生成）
├── .gitignore                         # Git除外設定
├── .vscode/                           # VS Code設定
└── .serena/                           # Serena設定
```

## システム要件

- macOS (Darwin kernel)
- Zsh shell
- 通常ユーザー権限（管理者権限不要）

## 技術仕様

### Wi-Fi 情報取得方法
- `system_profiler SPAirPortDataType` を使用（現代的なアプローチ）
- 廃止予定の `airport` コマンドは使用しない
- 通常ユーザー権限で動作

### ネットワーク測定
- 複数の外部DNSサーバーから接続可能なものを自動選択
- デフォルトゲートウェイの自動検出
- パケットロス率とレイテンシの同時測定

## インストール・使用方法

### 1. 手動実行

```bash
# スクリプトに実行権限を付与
chmod +x scripts/mac.sh

# 単発実行
./scripts/mac.sh

# バックグラウンドで実行
./scripts/mac.sh &
```

### 2. 定期実行（推奨）

#### 方法 A: 自動インストールスクリプトを使用（推奨）

```bash
# 1. 設定ファイルを初期化（環境を自動検出）
./scripts/setup_config.sh

# 2. 自動インストール実行
./scripts/install.sh

# アンインストール
./scripts/uninstall.sh
```

インストールスクリプトは以下の処理を自動で行います：

- 環境の自動検出（ルーターIP、最適なDNSサーバー）
- 設定ファイルの生成とカスタマイズ
- スクリプトパスの自動設定
- 実行権限の付与
- launchd サービスの登録・開始
- 既存サービスの置き換え

#### 方法 B: 手動で launchd を設定

```bash
# plistファイルをコピー（スクリプトパスは自動で設定されます）
cp launchd/com.user.networkmonitor.plist ~/Library/LaunchAgents/

# スクリプトパスを手動で編集する場合
nano ~/Library/LaunchAgents/com.user.networkmonitor.plist

# launchdに登録
launchctl load ~/Library/LaunchAgents/com.user.networkmonitor.plist

# 実行状況確認
launchctl list | grep networkmonitor

# 停止・削除
launchctl unload ~/Library/LaunchAgents/com.user.networkmonitor.plist
rm ~/Library/LaunchAgents/com.user.networkmonitor.plist
```

#### 方法 C: cron を使用

```bash
# crontabを編集
crontab -e

# 以下を追加（5分間隔で実行）
*/5 * * * * /path/to/Wi-Fi-Monitoring/scripts/mac.sh
```

## 設定

### 設定ファイル（config/network_monitor.conf）

設定は独立した設定ファイルで管理されています：

```bash
# ログファイルの保存先（空の場合はプロジェクトルートに作成）
LOGFILE=""

# 外部監視ターゲット（優先順位順、接続可能なものを自動選択）
EXTERNAL_TARGETS=("8.8.8.8" "1.1.1.1" "208.67.222.222")

# ローカルルーターのIPアドレス（自動検出、手動設定も可能）
ROUTER_ADDRESS="192.168.2.1"

# Ping試行回数
PING_COUNT=4

# Ping タイムアウト時間（ミリ秒）
PING_TIMEOUT=3000

# デバッグモード
DEBUG=false
```

### 設定ファイルの初期化

```bash
# 環境を自動検出して設定ファイルを生成
./scripts/setup_config.sh
```

このスクリプトは以下を自動で行います：
- デフォルトゲートウェイ（ルーター）の検出
- 外部DNSサーバーの接続テスト
- 最適な設定値の生成

### ルーター IP アドレスの確認方法

```bash
# デフォルトゲートウェイを確認
route -n get default | grep gateway
```

## 出力形式

CSV ファイル（`network_monitor_log.csv`）に以下の形式で記録されます：

| 項目                | 説明                                    |
| ------------------- | --------------------------------------- |
| Timestamp           | 測定日時                                |
| ConnectionType      | 接続種別（Wireless/Wired/Disconnected） |
| InterfaceName       | ネットワークインターフェース名          |
| RouterPingAvg(ms)   | ルーター ping 平均応答時間              |
| RouterPingMax(ms)   | ルーター ping 最大応答時間              |
| RouterLoss(%)       | ルーター ping パケットロス率            |
| ExternalPingAvg(ms) | 外部 ping 平均応答時間                  |
| ExternalPingMax(ms) | 外部 ping 最大応答時間                  |
| ExternalLoss(%)     | 外部 ping パケットロス率                |
| SSID                | Wi-Fi の SSID（無線時のみ）             |
| BSSID               | Wi-Fi の BSSID（無線時のみ、制限により取得困難） |
| Signal(dBm)         | Wi-Fi 信号強度（無線時のみ）            |
| Noise(dBm)          | Wi-Fi ノイズレベル（無線時のみ）        |
| Channel             | Wi-Fi チャンネル（無線時のみ）          |
| TransmitRate(Mbps)  | Wi-Fi 送信レート（無線時のみ）          |

## トラブルシューティング

### 権限エラー

```bash
# 実行権限を確認・設定
ls -la scripts/mac.sh
chmod +x scripts/mac.sh
```

### Wi-Fi 情報が取得できない

現在のスクリプトは `system_profiler` コマンドを使用して Wi-Fi 情報を取得します。通常ユーザー権限で動作しますが、一部の情報（BSSIDなど）はmacOSのセキュリティ制限により取得できない場合があります。

```bash
# デバッグモードで実行して詳細を確認
DEBUG=true ./scripts/mac.sh
```

### ログファイルが作成されない

- ディスク容量を確認
- 書き込み権限を確認
- パスが正しいか確認

## 開発

### デバッグ

```bash
# 構文チェック
zsh -n scripts/mac.sh

# デバッグモードで実行
DEBUG=true ./scripts/mac.sh

# 詳細なトレース出力
zsh -x scripts/mac.sh
```

### ログ監視

```bash
# リアルタイム監視
tail -f network_monitor_log.csv

# 最新10行表示
tail -10 network_monitor_log.csv

# CSV形式で表示
column -t -s, network_monitor_log.csv | head -5
```

## ライセンス

このプロジェクトはオープンソースです。自由に使用、改変してください。

## 貢献

バグ報告や機能改善の提案は、GitHub の Issue までお願いします。
