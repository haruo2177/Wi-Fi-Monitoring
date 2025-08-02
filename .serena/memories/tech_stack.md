# 技術スタック

## 言語・環境
- **Shell Script**: Zsh (macOS標準)
- **対象OS**: macOS (Darwin kernel)
- **アーキテクチャ**: ARM64 (Apple Silicon対応)

## 使用コマンド・ツール
- `ping`: ネットワーク遅延・パケットロス測定
- `route`: デフォルトゲートウェイ・インターフェース情報取得
- `networksetup`: ネットワーク設定情報取得
- `airport`: Wi-Fi詳細情報取得（Apple80211フレームワーク）
- `date`: タイムスタンプ生成
- `awk`, `grep`, `sed`: テキスト処理

## データ形式
- **出力**: CSV形式
- **ログファイル**: `network_monitor_log.csv`
- **文字エンコーディング**: UTF-8