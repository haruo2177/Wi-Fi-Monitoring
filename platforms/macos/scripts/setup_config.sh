#!/bin/zsh

# =============================================================================
# ネットワーク監視ツール 設定初期化スクリプト
# 機能: 環境に合わせた設定ファイルを生成
# =============================================================================

set -e

# 色付きメッセージ用の関数
print_info() {
    echo "\033[34m[INFO]\033[0m $1"
}

print_success() {
    echo "\033[32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo "\033[33m[WARNING]\033[0m $1"
}

# プロジェクトルートとファイルパス
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$PROJECT_ROOT/config/network_monitor.conf"

print_info "ネットワーク監視ツールの設定を初期化します..."

# 現在のネットワーク設定を自動検出
print_info "現在のネットワーク設定を検出中..."

# ルーターアドレスの自動検出
AUTO_ROUTER=$(route -n get default 2>/dev/null | grep 'gateway:' | awk '{print $2}')
if [[ -z "$AUTO_ROUTER" ]]; then
    AUTO_ROUTER=$(netstat -rn | grep '^default' | awk '{print $2}' | head -n1)
fi

# アクティブインターフェースの検出
ACTIVE_IF=$(route -n get default 2>/dev/null | grep 'interface:' | awk '{print $2}')

# DNS接続テスト
print_info "外部DNS接続をテスト中..."
AVAILABLE_DNS=()
for dns in "8.8.8.8" "1.1.1.1" "208.67.222.222"; do
    if ping -c 1 -W 1000 "$dns" >/dev/null 2>&1; then
        AVAILABLE_DNS+=("$dns")
        print_success "接続OK: $dns"
    else
        print_warning "接続NG: $dns"
    fi
done

# 設定ファイルのバックアップ
if [[ -f "$CONFIG_FILE" ]]; then
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    print_info "既存の設定ファイルをバックアップしました"
fi

# 設定ファイルを生成
mkdir -p "$(dirname "$CONFIG_FILE")"

cat > "$CONFIG_FILE" << EOF
# ネットワーク監視ツール設定ファイル
# 自動生成日時: $(date)
# このファイルを編集して環境に合わせてカスタマイズしてください

# ログファイルの保存先パス
# 空の場合は、プロジェクトルート/logs/network_monitor_log.csv を作成
LOGFILE=""

# 外部監視ターゲット（優先順位順）
# 接続テスト結果に基づいて設定
EOF

if [[ ${#AVAILABLE_DNS[@]} -gt 0 ]]; then
    echo "EXTERNAL_TARGETS=($(printf '"%s" ' "${AVAILABLE_DNS[@]}"))" >> "$CONFIG_FILE"
else
    echo "EXTERNAL_TARGETS=(\"8.8.8.8\" \"1.1.1.1\" \"208.67.222.222\")" >> "$CONFIG_FILE"
fi

cat >> "$CONFIG_FILE" << EOF

# ローカルルーターのIPアドレス
# 自動検出結果: ${AUTO_ROUTER:-未検出}
ROUTER_ADDRESS="${AUTO_ROUTER:-}"

# Pingの試行回数（1-10の範囲推奨）
PING_COUNT=4

# Ping タイムアウト時間（ミリ秒）
PING_TIMEOUT=3000

# デバッグモード（true/false）
DEBUG=false
EOF

print_success "設定ファイルを生成しました: $CONFIG_FILE"
print_info ""
print_info "=== 検出された設定 ==="
print_info "ルーターアドレス: ${AUTO_ROUTER:-未検出}"
print_info "アクティブIF: ${ACTIVE_IF:-未検出}"
print_info "利用可能DNS: ${AVAILABLE_DNS[*]:-なし}"
print_info ""
print_info "設定ファイル ($CONFIG_FILE) を編集して、必要に応じて調整してください。"
