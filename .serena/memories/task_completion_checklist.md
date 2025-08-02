# タスク完了チェックリスト（2025年8月2日更新）

## コード変更後の確認手順

### 1. 構文・実行権限チェック
```bash
# Zshスクリプト構文確認
zsh -n scripts/mac.sh

# 実行権限確認・設定
ls -la scripts/mac.sh
chmod +x scripts/*.sh
```

### 2. 設定ファイル整合性
```bash
# 設定ファイル存在確認
ls -la config/network_monitor.conf

# 設定内容確認
cat config/network_monitor.conf

# 設定再生成テスト
./scripts/setup_config.sh
```

### 3. 機能テスト

#### 基本実行テスト
```bash
# 通常実行
./scripts/mac.sh

# デバッグ実行
DEBUG=true ./scripts/mac.sh

# ログファイル確認
tail -1 network_monitor_log.csv
```

#### Wi-Fi情報取得テスト
```bash
# Wi-Fi接続状態での実行
# 期待値: SSID, Signal, Noise, Channel, TransmitRate取得

# 有線接続での実行
# 期待値: Wi-Fi項目がN/A
```

### 4. CSV出力検証
```bash
# ヘッダー行確認
head -1 network_monitor_log.csv

# データ形式確認
head -3 network_monitor_log.csv | column -t -s,

# 必須項目チェック（空値なし）
grep -E ',,|^,|,$' network_monitor_log.csv
```

### 5. エラーハンドリング確認

#### ネットワーク異常時
```bash
# Wi-Fi無効化での実行テスト
# 期待値: Disconnected状態で記録

# 不正ルーターIP設定テスト
# 期待値: タイムアウトでN/A記録
```

### 6. 自動実行（launchd）テスト
```bash
# サービス登録
./scripts/install.sh

# サービス状態確認
launchctl list | grep networkmonitor

# ログ出力確認（数分待機後）
ls -la /tmp/networkmonitor.*.log
tail /tmp/networkmonitor.out.log
```

## リリース前最終チェック

### 必須項目
- [ ] 構文エラーなし
- [ ] 実行権限設定済み
- [ ] Wi-Fi情報正常取得（SSID, Signal, Channel, TransmitRate）
- [ ] CSV形式正常出力
- [ ] 設定ファイル動作確認
- [ ] デバッグモード動作確認
- [ ] README.md内容と実装の整合性

### パフォーマンス・品質
- [ ] 実行時間5秒以内
- [ ] メモリ使用量適正
- [ ] エラー時の適切な処理
- [ ] ログローテーション考慮

### ドキュメント整合性
- [ ] README.mdの設定項目が最新
- [ ] インストール手順の動作確認
- [ ] トラブルシューティング情報の正確性
- [ ] サンプル出力の最新化

## 運用時の注意点
- 定期実行でのフルパス使用
- ディスク容量監視
- ログファイルサイズ管理
- ネットワーク環境変更時の設定見直し