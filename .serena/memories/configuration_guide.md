# 設定・カスタマイズ情報

## 設定可能項目

### ファイルパス設定
```bash
# ログファイルの保存先パス
LOGFILE=./network_monitor_log.csv
# 推奨: フルパス使用 例) ~/Documents/network_monitor_log.csv
```

### ネットワーク設定
```bash
# 外部監視ターゲット（デフォルト: Google DNS）
EXTERNAL_TARGET="8.8.8.8"
# 代替案: "1.1.1.1" (Cloudflare), "208.67.222.222" (OpenDNS)

# ローカルルーターのIPアドレス
ROUTER_ADDRESS="192.168.1.1"
# 環境に応じて変更が必要: 192.168.0.1, 10.0.0.1 など

# Pingの試行回数
PING_COUNT=4
# 1-10回程度が適切（回数が多いと実行時間増加）
```

## 環境固有の調整

### ルーターIPアドレスの確認方法
```bash
# デフォルトゲートウェイ確認
route -n get default | grep gateway

# またはnetstatで確認
netstat -rn | grep default
```

### Apple80211フレームワークパス
```bash
# 標準パス（通常変更不要）
AIRPORT_PATH="/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport"
```

## パフォーマンス調整
- `PING_COUNT`: 精度 vs 実行時間のバランス
- タイムアウト値: `-W 1000` (1秒、ネットワーク環境に応じて調整)
- 実行間隔: 5分間隔を推奨（負荷とデータ量のバランス）