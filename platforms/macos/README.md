# Network Monitor for macOS

macOS専用のネットワーク品質監視ツールです。

## 特徴

- **技術スタック**: Zsh, system_profiler, launchd
- **権限要件**: 通常ユーザー（sudo不要）
- **自動実行**: launchd UserAgent
- **Wi-Fi情報取得**: system_profiler SPAirPortDataType

## システム要件

- macOS 10.15 以降
- Zsh shell（macOS標準）
- 通常ユーザー権限

## 基本的な使用方法

```bash
# 設定ファイル初期化
./scripts/setup_config.sh

# 単発実行
./scripts/network_monitor.sh

# 自動インストール
./scripts/install.sh
```

## macOS固有の機能

### Wi-Fi情報取得
- SSID、信号強度、チャンネル、転送レートを取得
- BSSIDはmacOSセキュリティ制限により取得困難

### launchd統合
- UserAgentとして実行
- システム起動時に自動開始
- ユーザーログイン時に実行

## 取得可能なWi-Fi情報

| 項目 | 説明 | 例 |
|------|------|-----|
| SSID | ネットワーク名 | "MyWiFi-5G" |
| Signal | 信号強度 | -56 dBm |
| Noise | ノイズレベル | -90 dBm |
| Channel | チャンネル | 64 |
| TransmitRate | 送信レート | 720 Mbps |

## 制限事項

- BSSIDの取得はmacOSのセキュリティ制限により困難
- 一部のWi-Fi情報は接続状態でのみ取得可能