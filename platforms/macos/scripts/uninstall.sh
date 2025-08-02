#!/bin/zsh

# =============================================================================
# ネットワーク監視ツール アンインストールスクリプト
# 機能: launchdサービスの停止・削除
# =============================================================================

set -e  # エラーで終了

# 色付きメッセージ用の関数
print_info() {
    echo "\033[34m[INFO]\033[0m $1"
}

print_success() {
    echo "\033[32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo "\033[31m[ERROR]\033[0m $1"
}

print_warning() {
    echo "\033[33m[WARNING]\033[0m $1"
}

PLIST_DESTINATION="$HOME/Library/LaunchAgents/com.user.networkmonitor.plist"

print_info "ネットワーク監視ツールのアンインストールを開始します..."

# サービスが存在するか確認
if ! launchctl list | grep -q "com.user.networkmonitor"; then
    print_warning "ネットワーク監視サービスは登録されていません"
else
    print_info "サービスを停止・削除しています..."
    launchctl unload "$PLIST_DESTINATION" 2>/dev/null || true
    print_success "サービスを停止しました"
fi

# plistファイルを削除
if [[ -f "$PLIST_DESTINATION" ]]; then
    rm "$PLIST_DESTINATION"
    print_success "plistファイルを削除しました: $PLIST_DESTINATION"
else
    print_warning "plistファイルは存在しませんでした"
fi

# 一時ログファイルを削除（オプション）
print_info "一時ログファイルを削除しますか？ [y/N]"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    rm -f /tmp/networkmonitor.stdout.log /tmp/networkmonitor.stderr.log
    print_success "一時ログファイルを削除しました"
fi

print_success "アンインストールが完了しました！"
print_info "注意: ネットワーク監視ログファイル (network_monitor_log.csv) は残されています"
