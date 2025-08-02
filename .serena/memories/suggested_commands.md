# 推奨コマンド（更新版）

## 自動インストール・管理コマンド
```bash
# 自動インストール（推奨）
./scripts/install.sh

# アンインストール
./scripts/uninstall.sh

# サービス状態確認
launchctl list | grep networkmonitor

# 手動でサービス停止
launchctl unload ~/Library/LaunchAgents/com.user.networkmonitor.plist

# 手動でサービス開始
launchctl load ~/Library/LaunchAgents/com.user.networkmonitor.plist
```

## 実行コマンド
```bash
# スクリプトの手動実行
./scripts/mac.sh

# バックグラウンドで実行
./scripts/mac.sh &

# 定期実行（手動ループ）
while true; do ./scripts/mac.sh; sleep 300; done
```

## 開発・デバッグコマンド
```bash
# スクリプトの構文チェック
zsh -n scripts/mac.sh

# 実行権限の設定
chmod +x scripts/mac.sh scripts/install.sh scripts/uninstall.sh

# ログファイルの確認
tail -f network_monitor_log.csv
head -10 network_monitor_log.csv

# CSVファイルを表形式で表示
column -t -s, network_monitor_log.csv | head -5

# サービスログの確認
tail -f /tmp/networkmonitor.stdout.log
tail -f /tmp/networkmonitor.stderr.log
```

## システム情報・テスト
```bash
# ネットワークインターフェース確認
networksetup -listallhardwareports

# デフォルトルート確認
route -n get default

# Wi-Fi情報確認
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I

# 手動ping テスト
ping -c 4 192.168.1.1  # ルーター
ping -c 4 8.8.8.8      # 外部サーバー
```

## ユーティリティコマンド（macOS Darwin）
```bash
# ファイル・ディレクトリ操作
ls -la          # 詳細リスト表示
find . -name "*.sh"  # ファイル検索
grep -r "pattern" .  # テキスト検索

# プロセス・システム情報
ps aux | grep mac.sh  # プロセス確認
top -o cpu           # CPU使用率順表示
uname -a             # システム情報

# ログ・監視
tail -f file.log     # リアルタイム監視
less +F file.log     # ページャでリアルタイム監視
```