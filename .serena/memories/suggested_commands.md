# 推奨シェルコマンド（2025年8月2日更新）

## プロジェクト管理

### インストール・設定
```bash
# 環境検出と設定ファイル生成
./scripts/setup_config.sh

# 自動インストール（launchd登録）
./scripts/install.sh

# アンインストール
./scripts/uninstall.sh
```

### 実行・テスト
```bash
# 単発実行
./scripts/mac.sh

# デバッグモード実行
DEBUG=true ./scripts/mac.sh

# 構文チェック
zsh -n scripts/mac.sh

# 詳細トレース
zsh -x scripts/mac.sh
```

## ログ監視・分析

### リアルタイム監視
```bash
# 最新ログをリアルタイム表示
tail -f network_monitor_log.csv

# 最新10エントリ表示
tail -10 network_monitor_log.csv

# CSVフォーマット確認
head -5 network_monitor_log.csv | column -t -s,
```

### データ分析
```bash
# TransmitRate統計
cut -d, -f15 network_monitor_log.csv | tail -n +2 | sort -n

# 信号強度推移
cut -d, -f12 network_monitor_log.csv | tail -n +2 | sed 's/"//g'

# パケットロス確認
cut -d, -f6,9 network_monitor_log.csv | grep -v "0.0"
```

## システム管理

### launchd管理
```bash
# サービス状態確認
launchctl list | grep networkmonitor

# 手動でサービス開始
launchctl load ~/Library/LaunchAgents/com.user.networkmonitor.plist

# サービス停止
launchctl unload ~/Library/LaunchAgents/com.user.networkmonitor.plist
```

### ネットワーク診断
```bash
# デフォルトゲートウェイ確認
route -n get default | grep gateway

# Wi-Fi詳細情報（参考）
system_profiler SPAirPortDataType

# ネットワークインターフェース確認
networksetup -listallhardwareports
```

## 開発・デバッグ

### 設定確認
```bash
# 現在の設定表示
cat config/network_monitor.conf

# 設定ファイル再生成
rm config/network_monitor.conf && ./scripts/setup_config.sh
```

### トラブルシューティング
```bash
# 実行権限確認
ls -la scripts/mac.sh

# ディスク容量確認
df -h .

# プロセス確認
ps aux | grep mac.sh
```