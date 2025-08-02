# Network Monitoring & Visualization

React Router を使用した Web ベースのネットワーク監視・可視化ツールです。ネットワーク品質の監視、設定管理、データ可視化を統合したソリューションを提供します。

## 🌟 主要機能

### 📊 リアルタイム監視

- **Ping 応答時間**: ルーター・外部サーバーへの応答時間測定
- **パケットロス率**: ネットワーク品質の監視
- **Wi-Fi 信号強度**: 信号品質・転送レートの可視化
- **時系列グラフ**: Recharts を使用した美しいデータ可視化

### ⚙️ プラットフォーム設定管理

- **macOS**: launchd, system_profiler 完全対応
- **Windows**: Task Scheduler, netsh (開発予定)
- **Ubuntu/Linux**: systemd, iwconfig (開発予定)

### 🎨 モダン UI

- **React Router v6**: SPA ナビゲーション
- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **ダークテーマ**: 目に優しいインターフェース

## 🏗️ プロジェクト構造

```
Network-Monitoring/
├── src/                         # React アプリケーション
│   ├── components/              # 共通コンポーネント
│   ├── pages/                   # ページコンポーネント
│   │   ├── Home.jsx            # ホームページ
│   │   ├── Settings.jsx        # 設定一覧
│   │   ├── SettingsPlatform.jsx # プラットフォーム別設定
│   │   └── Monitoring.jsx      # 監視・可視化
│   └── main.jsx                # アプリエントリーポイント
├── server.cjs                   # Express API サーバー
├── platforms/                   # プラットフォーム別実装
│   ├── macos/                   # macOS (完成)
│   ├── windows/                 # Windows (開発予定)
│   └── ubuntu/                  # Ubuntu (開発予定)
├── logs/                        # ログファイル
│   └── network_monitor_log.csv  # 監視データ
└── shared/                      # 共通リソース
    └── docs/                    # 技術ドキュメント
```

## 🚀 セットアップ・起動

### 前提条件

- Node.js (v16 以上)
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd Network-Monitoring

# 依存関係をインストール
npm install
```

## 🚀 開発環境での起動

### 一括起動（推奨）

フロントエンドとバックエンドを同時に起動:

```bash
# NPMスクリプトで起動
npm run dev:full

# またはシェルスクリプトで起動
./start-full.sh

# バックエンド起動完了を待ってからフロントエンド起動
npm run dev:full-wait
```

### 個別起動

必要に応じて個別に起動することも可能:

```bash
# バックエンドサーバー (ポート 3002)
npm run server

# フロントエンド開発サーバー (ポート 3000) - 別ターミナルで実行
npm run dev
```

### アクセス

- **Web UI**: http://localhost:3000
- **API**: http://localhost:3002/api/

## 🔧 環境変数設定

プロジェクトは環境変数による設定カスタマイズに対応しています。

### 設定方法

```bash
# .env.example をコピーして環境変数ファイルを作成
cp .env.example .env

# .env ファイルを編集して設定をカスタマイズ
nano .env
```

### 主要な環境変数

| 環境変数               | デフォルト | 説明                         |
| ---------------------- | ---------- | ---------------------------- |
| `SERVER_PORT`          | 3002       | バックエンドサーバーポート   |
| `FRONTEND_PORT`        | 3000       | フロントエンドサーバーポート |
| `PRIMARY_DNS`          | 8.8.8.8    | プライマリ DNS サーバー      |
| `SECONDARY_DNS`        | 1.1.1.1    | セカンダリ DNS サーバー      |
| `PING_TIMEOUT_MS`      | 3000       | Ping タイムアウト（ミリ秒）  |
| `MONITOR_INTERVAL_SEC` | 300        | 監視間隔（秒）               |
| `LOG_DIR`              | /tmp       | ログディレクトリ             |

### 使用例

```bash
# 開発環境（高頻度監視）
export MONITOR_INTERVAL_SEC=60
export PING_TIMEOUT_MS=2000

# 本番環境（異なるポート）
export SERVER_PORT=8080
export FRONTEND_PORT=80
export LOG_DIR=/var/log/network-monitor
```

## 📦 本格運用での起動

### 本番環境での起動

```bash
# ビルド & 本番サーバー起動
npm run start
```

## 📱 使用方法

### 1. ホーム画面

- **設定ボタン**: プラットフォーム別設定管理
- **モニタリングボタン**: データ可視化画面

### 2. 設定管理

```
設定 → プラットフォーム選択 → 設定確認・変更
```

- 監視間隔の調整
- 外部サーバーターゲットの設定
- デバッグオプションの切り替え

### 3. 監視・可視化

- **時間範囲選択**: 24 時間 / 7 日間 / 30 日間
- **リアルタイム更新**: 30 秒間隔での自動更新
- **インタラクティブグラフ**: マウスオーバーで詳細表示

## 📊 データ形式

### CSV ログ形式

```csv
Timestamp,ConnectionType,InterfaceName,RouterPingAvg(ms),RouterPingMax(ms),RouterLoss(%),ExternalPingAvg(ms),ExternalPingMax(ms),ExternalLoss(%),SSID,BSSID,Signal(dBm),Noise(dBm),Channel,TransmitRate(Mbps)
```

### API エンドポイント

| エンドポイント          | メソッド | 説明           |
| ----------------------- | -------- | -------------- |
| `/api/logs?range=24h`   | GET      | ログデータ取得 |
| `/api/config/:platform` | GET      | 設定取得       |
| `/api/config/:platform` | POST     | 設定保存       |

## 🛠️ 技術スタック

### フロントエンド

- **React 18**: UI フレームワーク
- **React Router DOM v6**: SPA ナビゲーション
- **Recharts 2.12**: データ可視化
- **Lucide React**: アイコンライブラリ
- **Vite**: ビルドツール & 開発サーバー

### バックエンド

- **Express.js**: Web フレームワーク
- **csv-parser**: CSV データ処理
- **Node.js**: ランタイム環境

### プラットフォーム統合

- **macOS**: Zsh, system_profiler, launchd
- **Windows**: PowerShell, netsh, Task Scheduler
- **Ubuntu**: Bash, iwconfig, systemd

## 📋 NPM Scripts

```bash
npm run dev      # 開発サーバー起動 (Vite)
npm run build    # 本番ビルド
npm run preview  # ビルド結果プレビュー
npm run server   # Express APIサーバー起動
npm run start    # ビルド & 本番サーバー起動
npm run lint     # ESLint 実行
```

## 🔧 設定ファイル

### プラットフォーム別設定例 (macOS)

```bash
# platforms/macos/config/network_monitor.conf
LOGFILE_PATH="./logs/network_monitor_log.csv"
EXTERNAL_TARGETS=("8.8.8.8" "1.1.1.1" "208.67.222.222")
ROUTER_ADDRESS="auto"
PING_COUNT=3
PING_TIMEOUT=5
DEBUG=false
```

## 🐛 トラブルシューティング

### よくある問題

1. **ポート競合エラー**

   ```bash
   # 別のポートを使用
   export PORT=3003 && npm run server
   ```

2. **CSV ファイルが見つからない**

   ```bash
   # ログディレクトリ作成
   mkdir -p logs
   ```

3. **権限エラー (macOS)**
   ```bash
   # スクリプトに実行権限付与
   chmod +x platforms/macos/scripts/*.sh
   ```

## 📈 今後の開発予定

- [ ] Windows プラットフォーム対応
- [ ] Ubuntu/Linux プラットフォーム対応
- [ ] アラート機能
- [ ] データエクスポート機能
- [ ] 詳細統計レポート

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

# 自動インストール

./scripts/install.sh

````

### Windows（開発予定）

```powershell
# Windowsディレクトリに移動
cd platforms\windows\

# 設定初期化
.\scripts\setup_config.ps1

# 実行
.\scripts\network_monitor.ps1
````

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
