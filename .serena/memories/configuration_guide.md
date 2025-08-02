# 設定・カスタマイズ情報（2025年8月2日更新）

## 設定ファイル: config/network_monitor.conf

### 最新設定項目
```bash
# ログファイルの保存先（空=プロジェクトルート）
LOGFILE=""

# 外部監視ターゲット（優先順位順、自動選択）
EXTERNAL_TARGETS=("8.8.8.8" "1.1.1.1" "208.67.222.222")

# ローカルルーター（自動検出結果: 192.168.2.1）
ROUTER_ADDRESS="192.168.2.1"

# Ping設定
PING_COUNT=4                    # 試行回数
PING_TIMEOUT=3000              # タイムアウト(ms)

# デバッグモード
DEBUG=false                    # true で詳細ログ
```

## 環境固有の設定

### 自動検出機能
- **ルーターIP**: `route -n get default` で自動検出
- **外部DNS**: 接続テストで最適選択
- **ネットワークIF**: アクティブインターフェース自動判定

### Wi-Fi情報取得設定
- **技術**: system_profiler SPAirPortDataType
- **権限**: 通常ユーザー（sudo不要）
- **取得項目**: SSID, Signal, Noise, Channel, TransmitRate
- **制限**: BSSID取得困難（macOSセキュリティ）

## カスタマイズ可能項目

### パフォーマンス調整
- **PING_COUNT**: 1-10（精度 vs 実行時間）
- **PING_TIMEOUT**: 1000-5000ms（ネットワーク環境次第）
- **実行間隔**: launchd設定で300秒（5分）

### ログ設定
- **パス**: 相対パス推奨（ポータビリティ）
- **フォーマット**: CSV固定（互換性）
- **ローテーション**: 外部ツール使用推奨

## 設定初期化
```bash
# 環境自動検出で設定ファイル生成
./scripts/setup_config.sh

# 手動設定確認
cat config/network_monitor.conf

# 設定テスト
DEBUG=true ./scripts/mac.sh
```