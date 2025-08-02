#!/bin/zsh

# =============================================================================
# ネットワーク監視ツール インストールスクリプト
# 機能: launchdサービスの登録とスクリプトパスの設定
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

# 現在のディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MONITOR_SCRIPT="$SCRIPT_DIR/mac.sh"
PLIST_TEMPLATE="$PROJECT_ROOT/launchd/com.user.networkmonitor.plist"
PLIST_DESTINATION="$HOME/Library/LaunchAgents/com.user.networkmonitor.plist"

print_info "ネットワーク監視ツールのインストールを開始します..."
print_info "スクリプトディレクトリ: $SCRIPT_DIR"
print_info "プロジェクトルート: $PROJECT_ROOT"
print_info "監視スクリプト: $MONITOR_SCRIPT"
print_info "plistテンプレート: $PLIST_TEMPLATE"

# 必要なファイルの存在確認
if [[ ! -f "$MONITOR_SCRIPT" ]]; then
    print_error "監視スクリプトが見つかりません: $MONITOR_SCRIPT"
    exit 1
fi

if [[ ! -f "$PLIST_TEMPLATE" ]]; then
    print_error "plistテンプレートが見つかりません: $PLIST_TEMPLATE"
    exit 1
fi

# 監視スクリプトに実行権限を付与
print_info "監視スクリプトに実行権限を付与しています..."
chmod +x "$MONITOR_SCRIPT"
print_success "実行権限を付与しました"

# LaunchAgentsディレクトリを作成（存在しない場合）
mkdir -p "$HOME/Library/LaunchAgents"

# 既存のサービスがあれば停止・削除
if launchctl list | grep -q "com.user.networkmonitor"; then
    print_warning "既存のサービスを停止・削除しています..."
    launchctl unload "$PLIST_DESTINATION" 2>/dev/null || launchctl bootout gui/$(id -u)/com.user.networkmonitor 2>/dev/null || true
    rm -f "$PLIST_DESTINATION"
fi

# plistファイルを作成（スクリプトパスを置換）
print_info "plistファイルを作成しています..."
sed "s|SCRIPT_PATH_PLACEHOLDER|$MONITOR_SCRIPT|g" "$PLIST_TEMPLATE" > "$PLIST_DESTINATION"

# plistファイルが正しく作成されたか確認
if [[ ! -f "$PLIST_DESTINATION" ]]; then
    print_error "plistファイルの作成に失敗しました"
    exit 1
fi

print_success "plistファイルを作成しました: $PLIST_DESTINATION"

# launchdサービスを登録・開始
print_info "launchdサービスを登録・開始しています..."
if launchctl load "$PLIST_DESTINATION" 2>/dev/null; then
    print_success "サービスを正常に登録しました"
else
    print_warning "launchctl load でエラーが発生しました。bootstrapを試します..."
    if launchctl bootstrap gui/$(id -u) "$PLIST_DESTINATION" 2>/dev/null; then
        print_success "bootstrapでサービスを正常に登録しました"
    else
        print_error "サービスの登録に失敗しました"
        print_info "手動で以下のコマンドを実行してください："
        print_info "launchctl load $PLIST_DESTINATION"
        exit 1
    fi
fi

# サービスが正常に登録されたか確認
sleep 2
if launchctl list | grep -q "com.user.networkmonitor"; then
    print_success "サービスが正常に登録されました"
    print_info "5分間隔でネットワーク監視が実行されます"
    print_info "ログファイル: $PROJECT_ROOT/network_monitor_log.csv"
    print_info "標準出力ログ: /tmp/networkmonitor.stdout.log"
    print_info "エラーログ: /tmp/networkmonitor.stderr.log"
else
    print_error "サービスの登録に失敗しました"
    exit 1
fi

print_info ""
print_info "=== 管理コマンド ==="
print_info "サービス状態確認: launchctl list | grep networkmonitor"
print_info "サービス停止: launchctl unload $PLIST_DESTINATION"
print_info "サービス開始: launchctl load $PLIST_DESTINATION"
print_info "サービス削除: launchctl unload $PLIST_DESTINATION && rm $PLIST_DESTINATION"
print_info ""
print_success "インストールが完了しました！"
