# Network Monitoring & Visualization

React Router を使用した Web ベースのネットワーク監視・可視化ツールです。ネットワーク品質の監視、設定管理、データ可視化を統合したソリューションを提供します。

## 🌟 主要機能

### 📊 リアルタイム監視

- **Ping 応答時間**: ルーター・外部サーバーへの応答時間測定
- **パケットロス率**: ネットワーク品質の監視
- **Wi-Fi 信号強度**: 信号品質・転送レートの可視化
- **時系列グラフ**: Recharts を使用した美しいデータ可視化

### 🔍 異常値分析機能

- **統計的異常検出**: IQR 法による外れ値検出システム
- **インタラクティブ UI**: アイコン・ツールチップ付きの直感的なインターフェース
- **多角的分析**: 接続エラー、高レイテンシ、パケットロス、信号異常の包括分析
- **詳細レポート**: JSON 形式での分析結果エクスポート機能

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
│   │   ├── Monitoring.jsx      # 監視・可視化
│   │   └── AnomalyAnalysis.jsx # 異常値分析
│   ├── utils/                   # ユーティリティ関数
│   │   └── anomalyDetection.js  # 異常検出アルゴリズム
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
- **異常値分析ボタン**: 統計的異常検出・分析画面

### 2. 設定管理

```
設定 → プラットフォーム選択 → 設定確認・変更
```

- 監視間隔の調整
- 外部サーバーターゲットの設定
- デバッグオプションの切り替え

### 3. 監視・可視化

#### 📊 リアルタイムダッシュボード

- **時間範囲選択**: 24 時間 / 7 日間 / 30 日間
- **リアルタイム更新**: 30 秒間隔での自動更新
- **状態インジケーター**: 接続状態・ルーター応答・外部接続・Wi-Fi 信号の視覚的表示

#### 🖱️ インタラクティブヘルプシステム

- **InfoTooltip**: 各監視項目にアイコン・詳細説明・計算方法を含むツールチップ
- **HelpCircle アイコン**: マウスオーバーで技術的詳細を表示
- **測定基準解説**: 判定基準・閾値・技術的意味の包括的説明

#### 📈 時系列データ可視化

- **Ping 応答時間**: ルーター・外部サーバーの応答時間推移
- **パケットロス率**: ネットワーク品質の時系列変化
- **Wi-Fi 信号強度**: 信号強度・転送レートのデュアル軸表示
- **カスタム Tooltip**: 詳細データ・単位・時刻の統合表示

### 4. 異常値分析（完成済み）

#### 🔍 統計的異常検出

- **IQR 法**: 四分位範囲による科学的な外れ値検出
- **異常度スコア**: 0-100 の総合的なネットワーク品質評価
- **多角的分析**: 接続エラー・高レイテンシ・パケットロス・信号異常

#### 🎯 カテゴリ別詳細分析

- 🔴 **接続エラー** (WifiOff): ネットワーク切断の検出
- 🟠 **高レイテンシ** (Clock): 応答遅延の統計的検出
- 🟡 **パケットロス** (Zap): データ損失の監視
- 🟣 **信号異常** (Signal): Wi-Fi 信号強度の異常検出

#### 📊 可視化・レポート機能

- **散布図分析**: Ping 応答時間 vs Wi-Fi 信号強度の相関表示
- **統計情報**: 平均・中央値・四分位数・異常範囲の詳細表示
- **インタラクティブ UI**: アイコン・ツールチップによる直感的操作
- **詳細レポート**: JSON 形式での分析結果エクスポート

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

### 異常検出アルゴリズム

本システムでは以下の統計的手法を使用して異常値を検出します：

#### IQR 法（四分位範囲法）

- **計算式**: Q1 - 1.5×IQR ＜ 正常値 ＜ Q3 + 1.5×IQR
- **適用項目**: Ping 応答時間、Wi-Fi 信号強度

#### カテゴリ別検出条件

- **接続エラー**: TransmitRate = 0 AND ExternalLoss = 100%
- **高レイテンシ**: Ping 値が IQR 上限を超過
- **パケットロス**: Loss% > 0
- **信号異常**: Signal < -70dBm OR Signal > -30dBm

## 🛠️ 技術スタック

### フロントエンド

- **React 18**: UI フレームワーク
- **React Router DOM v6**: SPA ナビゲーション
- **Recharts 2.12**: データ可視化（LineChart, ScatterChart, BarChart 対応）
- **Lucide React**: アイコンライブラリ（HelpCircle, WifiOff, Clock, Zap, Signal 等）
- **Vite**: ビルドツール & 開発サーバー

### UI・インタラクション

- **InfoTooltip コンポーネント**: カスタムツールチップシステム
- **状態インジケーター**: 4 段階品質表示（正常・注意・警告・エラー）
- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **ダークテーマ**: 目に優しいインターフェース

### 分析・統計処理

- **IQR 法異常検出**: 四分位範囲による科学的外れ値検出
- **統計計算**: 平均・中央値・四分位数・標準偏差
- **時系列データ処理**: CSV 解析・時間範囲フィルタリング
- **相関分析**: 散布図による Ping 応答時間 vs Wi-Fi 信号強度

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

## 🔬 異常値分析機能詳細

### 🎯 検出カテゴリとアイコン

| カテゴリ     | アイコン | 色       | 検出条件                              | 意味                   |
| ------------ | -------- | -------- | ------------------------------------- | ---------------------- |
| 接続エラー   | 📶❌     | 赤       | TransmitRate=0 かつ ExternalLoss=100% | 完全なネットワーク切断 |
| 高レイテンシ | ⏰       | オレンジ | Ping > Q3+1.5×IQR                     | 応答遅延の異常         |
| パケットロス | ⚡       | 黄       | Loss% > 0                             | データ送信の失敗       |
| 信号異常     | 📡       | 紫       | Signal < -70dBm または > -30dBm       | Wi-Fi 信号強度の異常   |

### 🖱️ インタラクティブ機能

- **ツールチップ表示**: 各項目にマウスオーバーで詳細説明
- **統計情報表示**: 平均値・中央値・異常範囲の可視化
- **異常度スコア**: 0-100 の総合評価指標
- **レポートエクスポート**: JSON 形式での分析結果保存

### 📊 分析アルゴリズム

#### IQR 法（Interquartile Range Method）

```
下限 = Q1 - 1.5 × IQR
上限 = Q3 + 1.5 × IQR
IQR = Q3 - Q1（第3四分位数 - 第1四分位数）
```

#### 異常度スコア計算

```
スコア = (異常値件数 ÷ 総データ件数) × 100
- 0-20: 正常
- 21-50: 注意
- 51-80: 警告
- 81-100: 重大
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

## 📈 開発状況

### 機能一覧

- ✅ **InfoTooltip システム完成**: HelpCircle アイコン・詳細説明・測定方法の統合表示
- ✅ **異常値分析システム完成**: IQR 法による統計的異常検出
- ✅ **インタラクティブ UI**: アイコン・ツールチップによる直感的な操作
- ✅ **散布図分析**: Ping 応答時間 vs Wi-Fi 信号強度の相関可視化
- ✅ **統計情報表示**: 平均・中央値・四分位数・異常範囲の詳細可視化
- ✅ **詳細分析レポート**: JSON 形式でのエクスポート機能
- ✅ **リアルタイム異常度スコア**: 総合的なネットワーク品質評価

### 今後の開発予定

- [ ] Windows プラットフォーム対応
- [ ] Ubuntu/Linux プラットフォーム対応
- [ ] リアルタイムアラート機能
- [ ] 機械学習による予測分析
- [ ] カスタム異常検出ルール設定
- [ ] モバイルアプリ対応

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
- ✅ **異常値分析システム**: IQR 法による統計的検出
- ✅ **インタラクティブ UI**: アイコン・ツールチップ完備
- ✅ **詳細分析機能**: 散布図・統計情報・異常値リスト表示

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
