#!/bin/zsh

# =============================================================================
# ネットワーク状態監視スクリプト for macOS (Zsh/Bash)
# 機能: 5分ごとにネットワーク品質を測定し、CSVファイルに追記する
# =============================================================================

# PATHを設定（launchdからの実行でもコマンドが使用可能になる）
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# --- 設定項目 ---
# スクリプトディレクトリとプロジェクトルート
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 設定ファイルの読み込み
CONFIG_FILE="$PROJECT_ROOT/config/network_monitor.conf"
if [[ -f "$CONFIG_FILE" ]]; then
    source "$CONFIG_FILE"
fi

# デフォルト設定（設定ファイルで上書き可能）
LOGFILE="${LOGFILE:-$PROJECT_ROOT/../../logs/network_monitor_log.csv}"
# 環境変数対応DNSサーバー設定
PRIMARY_DNS="${PRIMARY_DNS:-8.8.8.8}"
SECONDARY_DNS="${SECONDARY_DNS:-1.1.1.1}"
TERTIARY_DNS="${TERTIARY_DNS:-208.67.222.222}"
EXTERNAL_TARGETS=("${EXTERNAL_TARGETS[@]:-$PRIMARY_DNS $SECONDARY_DNS $TERTIARY_DNS}")
ROUTER_ADDRESS="${ROUTER_ADDRESS:-}"
PING_COUNT="${PING_COUNT:-4}"
PING_TIMEOUT="${PING_TIMEOUT_MS:-${PING_TIMEOUT:-3000}}"
DEBUG="${DEBUG:-false}"

# デバッグ出力関数
debug_log() {
    if [[ "$DEBUG" == "true" ]]; then
        echo "[DEBUG $(/bin/date +"%H:%M:%S")] $1" >&2
    fi
}

# ルーターアドレスの自動検出
if [[ -z "$ROUTER_ADDRESS" ]]; then
    debug_log "ルーターアドレスを自動検出中..."
    ROUTER_ADDRESS=$(route -n get default 2>/dev/null | grep 'gateway:' | awk '{print $2}')
    if [[ -z "$ROUTER_ADDRESS" ]]; then
        # 代替方法でゲートウェイを取得
        ROUTER_ADDRESS=$(netstat -rn | grep '^default' | awk '{print $2}' | head -n1)
    fi
    debug_log "検出されたルーターアドレス: ${ROUTER_ADDRESS:-N/A}"
fi

# 外部ターゲットの選択（到達可能なものを使用）
EXTERNAL_TARGET=""
for target in "${EXTERNAL_TARGETS[@]}"; do
    if ping -c 1 -W 1000 "$target" >/dev/null 2>&1; then
        EXTERNAL_TARGET="$target"
        debug_log "外部ターゲットに選択: $EXTERNAL_TARGET"
        break
    fi
done

# どの外部ターゲットも到達できない場合のフォールバック
if [[ -z "$EXTERNAL_TARGET" ]]; then
    EXTERNAL_TARGET="${EXTERNAL_TARGETS[0]}"
    debug_log "フォールバックで外部ターゲットに設定: $EXTERNAL_TARGET"
fi

# --- スクリプト本体 ---

# ログファイルが存在しない場合、ヘッダー行を書き込む
if [[ ! -f "$LOGFILE" ]]; then
    echo "Timestamp,ConnectionType,InterfaceName,RouterPingAvg(ms),RouterPingMax(ms),RouterLoss(%),ExternalPingAvg(ms),ExternalPingMax(ms),ExternalLoss(%),SSID,BSSID,Signal(dBm),Noise(dBm),Channel,TransmitRate(Mbps)" > "$LOGFILE"
fi

# --- Pingとパケットロスの測定関数 ---
get_ping_stats() {
    local target=$1
    local count=$2
    local output
    local loss
    local avg_latency
    local max_latency

    debug_log "Ping測定開始: $target (count=$count, timeout=${PING_TIMEOUT}ms)"

    # -W オプションでタイムアウトを設定
    output=$(ping -c "$count" -W "$PING_TIMEOUT" "$target" 2>/dev/null)

    if [ $? -eq 0 ]; then
        loss=$(echo "$output" | grep 'packet loss' | awk '{for(i=1;i<=NF;i++) if($i ~ /%/) print $i}' | sed 's/%//')
        stats_line=$(echo "$output" | grep 'round-trip min/avg/max/stddev')

        if [ -n "$stats_line" ]; then
            avg_latency=$(echo "$stats_line" | awk -F'/' '{print $5}')
            max_latency=$(echo "$stats_line" | awk -F'/' '{print $6}')
            debug_log "Ping成功: $target avg=${avg_latency}ms max=${max_latency}ms loss=${loss}%"
        else
            avg_latency="N/A"
            max_latency="N/A"
            debug_log "Ping統計取得失敗: $target"
        fi
    else
        loss=100
        avg_latency="N/A"
        max_latency="N/A"
        debug_log "Ping失敗: $target (100% loss)"
    fi

    echo "$avg_latency,$max_latency,$loss"
}

# --- メイン処理 ---
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# アクティブなネットワークインターフェースを特定
ACTIVE_INTERFACE=$(route -n get default | grep 'interface:' | awk '{print $2}')
if [[ -z "$ACTIVE_INTERFACE" ]]; then
    CONNECTION_TYPE="Disconnected"
    INTERFACE_NAME="N/A"
else
    INTERFACE_NAME=$ACTIVE_INTERFACE
    # サービス名（Wi-Fi or Ethernet）を取得
    SERVICE_NAME=$(networksetup -listallhardwareports | grep -B1 "Device: $ACTIVE_INTERFACE" | head -n 1 | awk -F': ' '{print $2}')
    if [[ "$SERVICE_NAME" == *"Wi-Fi"* ]]; then
        CONNECTION_TYPE="Wireless"
    else
        CONNECTION_TYPE="Wired"
    fi
fi

# Ping統計の取得
debug_log "ネットワーク測定開始"
if [[ -n "$ROUTER_ADDRESS" ]]; then
    ROUTER_STATS=$(get_ping_stats "$ROUTER_ADDRESS" "$PING_COUNT")
    debug_log "ルーターPing完了: $ROUTER_ADDRESS"
else
    ROUTER_STATS="N/A,N/A,100"
    debug_log "ルーターアドレス未設定: ping をスキップ"
fi

EXTERNAL_STATS=$(get_ping_stats "$EXTERNAL_TARGET" "$PING_COUNT")
debug_log "外部Ping完了: $EXTERNAL_TARGET"

# Wi-Fi情報の初期化
SSID="N/A"
BSSID="N/A"
SIGNAL="N/A"
NOISE="N/A"
CHANNEL="N/A"
TX_RATE="N/A"

# 無線接続の場合、詳細情報を取得
if [[ "$CONNECTION_TYPE" == "Wireless" ]]; then
    debug_log "Wi-Fi詳細情報取得開始"

    # system_profilerを使用してWi-Fi情報を取得
    WIFI_INFO=$(system_profiler SPAirPortDataType 2>/dev/null)
    if [[ $? -eq 0 && -n "$WIFI_INFO" ]]; then
        # 現在のネットワーク情報セクションから詳細を抽出
        CURRENT_SECTION=$(echo "$WIFI_INFO" | awk '/Current Network Information:/,/Other Local Wi-Fi Networks:/')

        if [[ -n "$CURRENT_SECTION" ]]; then
            # SSID取得（Current Network Information:の次の行のSSID名）
            SSID=$(echo "$CURRENT_SECTION" | sed -n '2p' | sed -e 's/^[[:space:]]*//' -e 's/:$//')

            # チャンネル情報を取得
            CHANNEL=$(echo "$CURRENT_SECTION" | grep "Channel:" | sed 's/.*Channel: \([0-9]*\).*/\1/')

            # 信号強度とノイズを取得
            SIGNAL_LINE=$(echo "$CURRENT_SECTION" | grep "Signal / Noise:")
            if [[ -n "$SIGNAL_LINE" ]]; then
                SIGNAL=$(echo "$SIGNAL_LINE" | sed 's/.*Signal \/ Noise: \(-[0-9]*\) dBm.*/\1/')
                NOISE=$(echo "$SIGNAL_LINE" | sed 's/.*\/ \(-[0-9]*\) dBm.*/\1/')
            fi

            # 転送レートを取得
            TX_RATE=$(echo "$CURRENT_SECTION" | grep "Transmit Rate:" | sed 's/.*Transmit Rate: \([0-9]*\).*/\1/')

            # BSSIDは現在のmacOSでは制限されているため取得困難
            BSSID="N/A"

            debug_log "Wi-Fi情報取得完了: SSID='$SSID', Signal=$SIGNAL dBm, Noise=$NOISE dBm, Channel=$CHANNEL, TX_Rate=$TX_RATE Mbps"
        else
            debug_log "Wi-Fi情報取得失敗: 現在のネットワーク情報が見つからない"
        fi
    else
        debug_log "Wi-Fi情報取得失敗: system_profilerエラー"
    fi

    # 空の値をN/Aに設定
    SSID=${SSID:-"N/A"}
    BSSID=${BSSID:-"N/A"}
    SIGNAL=${SIGNAL:-"N/A"}
    NOISE=${NOISE:-"N/A"}
    CHANNEL=${CHANNEL:-"N/A"}
    TX_RATE=${TX_RATE:-"N/A"}
fi

# CSV形式で一行のデータを作成し、ファイルに追記
CSV_LINE="\"$TIMESTAMP\",\"$CONNECTION_TYPE\",\"$INTERFACE_NAME\",$ROUTER_STATS,$EXTERNAL_STATS,\"$SSID\",\"$BSSID\",\"$SIGNAL\",\"$NOISE\",\"$CHANNEL\",\"$TX_RATE\""

# ログファイルのディレクトリが存在しない場合は作成
LOG_DIR=$(/usr/bin/dirname "$LOGFILE")
/bin/mkdir -p "$LOG_DIR"

# ファイルに書き込み
if echo "$CSV_LINE" >> "$LOGFILE"; then
    debug_log "ログ書き込み成功: $LOGFILE"
else
    debug_log "ログ書き込み失敗: $LOGFILE"
    exit 1
fi

debug_log "測定完了: $CONNECTION_TYPE接続 ($INTERFACE_NAME)"

exit 0