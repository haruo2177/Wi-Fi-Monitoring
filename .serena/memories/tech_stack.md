# 技術スタック（2025年8月3日更新）

## フロントエンド技術

### React エコシステム

- **React 18**: UI フレームワーク
- **React Router DOM v6**: SPA ナビゲーション
- **Recharts 2.12**: データ可視化ライブラリ（LineChart, ScatterChart, BarChart対応）
- **Lucide React**: アイコンライブラリ（HelpCircle, WifiOff, Clock, Zap, Signal等）
- **Vite**: ビルドツール & 開発サーバー

### UI・スタイリング・インタラクション

- **CSS**: カスタムダークテーマ
- **レスポンシブデザイン**: モバイル対応
- **インタラクティブチャート**: マウスオーバーで詳細表示
- **InfoTooltip コンポーネント**: カスタムツールチップシステム
- **アニメーション**: CSS transition・fadeIn効果

### データ可視化・分析

- **時系列グラフ**: Ping応答時間・パケットロス・Wi-Fi信号強度
- **散布図**: Ping応答時間 vs Wi-Fi信号強度の相関分析
- **統計的可視化**: 平均・中央値・四分位数・異常範囲
- **異常検出**: IQR法（四分位範囲法）による外れ値検出

## バックエンド技術

### Node.js エコシステム

- **Express.js**: Web フレームワーク
- **csv-parser**: CSV データ処理
- **Node.js**: ランタイム環境
- **CommonJS**: モジュールシステム

### API 設計

- **RESTful API**: 設定管理・ログデータ取得
- **CORS 対応**: クロスオリジン対応
- **JSON**: データ交換形式
- **時間範囲フィルタリング**: 24h/7d/30d対応

## データ分析・統計処理

### 異常検出アルゴリズム

- **IQR法（Interquartile Range）**: Q1-1.5×IQR ＜ 正常値 ＜ Q3+1.5×IQR
- **統計計算**: 平均・中央値・四分位数・標準偏差
- **カテゴリ別検出**: 接続エラー・高レイテンシ・パケットロス・信号異常
- **異常度スコア**: 0-100の総合評価指標

### データ処理

- **時系列データフィルタリング**: 時間範囲による絞り込み
- **CSV解析**: ヘッダー付きCSVの動的処理
- **欠損値処理**: null/undefined値の適切な処理

## プラットフォーム統合

### macOS（完成）

- **Shell**: Zsh (macOS 標準)
- **system_profiler**: Wi-Fi 情報取得
- **launchd**: バックグラウンド実行管理
- **ping**: ネットワーク測定

### Windows（開発予定）

- **PowerShell**: スクリプト環境
- **netsh**: ネットワーク設定・情報取得
- **Task Scheduler**: 定期実行

### Ubuntu/Linux（開発予定）

- **Bash**: シェル環境
- **iwconfig**: Wi-Fi 設定・情報取得
- **systemd**: サービス管理

## データフォーマット・ファイル

### データ管理

- **ログ**: CSV 形式（汎用性・可読性）
- **設定**: Bash 変数形式（.conf）
- **API**: JSON 形式でデータ交換
- **自動実行**: plist XML（launchd）

### CSV フォーマット

```csv
Timestamp,ConnectionType,InterfaceName,RouterPingAvg(ms),RouterPingMax(ms),RouterLoss(%),ExternalPingAvg(ms),ExternalPingMax(ms),ExternalLoss(%),SSID,BSSID,Signal(dBm),Noise(dBm),Channel,TransmitRate(Mbps)
```

## コンポーネント設計

### 再利用可能コンポーネント

- **InfoTooltip**: アイコン・タイトル・説明・計算方法を統合したツールチップ
- **CustomTooltip**: Rechartsグラフ用カスタムツールチップ
- **StatusIndicator**: 状態表示（正常・注意・警告・エラー）

### 状態管理

- **React Hooks**: useState, useEffect
- **リアルタイム更新**: 30秒間隔での自動データ取得
- **時間範囲切り替え**: 24h/7d/30d の動的フィルタリング

## ネットワーク監視技術

### Wi-Fi 情報取得

- **主要手法**: system_profiler SPAirPortDataType
- **廃止技術**: airport コマンド（非推奨）
- **取得項目**: SSID, Signal, Noise, Channel, TransmitRate
- **制限事項**: BSSID（macOS セキュリティ制限）

### 接続監視

- **ルーター**: ping + 自動ゲートウェイ検出
- **外部接続**: 複数 DNS（8.8.8.8, 1.1.1.1, 208.67.222.222）
- **フォールバック**: 接続失敗時の代替サーバー選択

### 品質判定基準

- **ルーター応答**: 5ms以下（良好）、20ms以下（注意）、それ以上（警告）
- **外部接続**: 20ms以下（良好）、50ms以下（注意）、それ以上（警告）
- **Wi-Fi信号**: -50dBm以上（良好）、-70dBm以上（注意）、それ以下（警告）
- **パケットロス**: 0%（良好）、5%以下（注意）、それ以上（警告）

## 自動化・デプロイメント

### macOS 統合

- **launchd**: システムレベルスケジューリング
- **UserAgent**: ユーザーセッション内実行
- **権限**: 通常ユーザー（sudo 不要）

### インストール自動化

- **環境検出**: ネットワーク設定自動発見
- **設定生成**: テンプレートベース
- **サービス登録**: plist 自動配置・ロード

## 開発・保守性

### コード品質

- **モジュール設計**: 機能別スクリプト分離
- **エラーハンドリング**: 接続失敗・権限エラー対応
- **デバッグサポート**: DEBUG 変数・詳細ログ
- **型安全性**: PropTypes（今後TypeScript移行予定）

### 互換性・ポータビリティ

- **macOS 専用**: Darwin kernel 依存
- **シェル**: Zsh/Bash 互換
- **設定**: 環境別カスタマイズ対応
- **ブラウザ**: モダンブラウザ対応（ES6+）