#!/bin/zsh

# =============================================================================
# ネットワーク状態監視スクリプト for macOS (Zsh/Bash)
# 機能: 5分ごとにネットワーク品質を測定し、CSVファイルに追記する
# =============================================================================

# --- 設定項目 ---
# ログファイルの保存先パス
LOGFILE=./network_monitor_log.csv
# 外部監視ターゲット
EXTERNAL_TARGET="8.8.8.8"
# ローカルルーターのIPアドレス (各自の環境に合わせて変更)
ROUTER_ADDRESS="192.168.1.1"
# Pingの試行回数
PING_COUNT=4

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

    # -W 1000: タイムアウトを1000msに設定
    output=$(ping -c "$count" -W 1000 "$target" 2>/dev/null)

    if [ $? -eq 0 ]; then
        loss=$(echo "$output" | grep 'packet loss' | awk -F' ' '{print $6}' | sed 's/%//')
        stats_line=$(echo "$output" | grep 'round-trip min/avg/max/stddev')

        if [ -n "$stats_line" ]; then
            avg_latency=$(echo "$stats_line" | awk -F'/' '{print $5}')
            max_latency=$(echo "$stats_line" | awk -F'/' '{print $6}')
        else
            avg_latency="N/A"
            max_latency="N/A"
        fi
    else
        loss=100
        avg_latency="N/A"
        max_latency="N/A"
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
ROUTER_STATS=$(get_ping_stats "$ROUTER_ADDRESS" "$PING_COUNT")
EXTERNAL_STATS=$(get_ping_stats "$EXTERNAL_TARGET" "$PING_COUNT")

# Wi-Fi情報の初期化
SSID="N/A"
BSSID="N/A"
SIGNAL="N/A"
NOISE="N/A"
CHANNEL="N/A"
TX_RATE="N/A"

# 無線接続の場合、詳細情報を取得
if [[ "$CONNECTION_TYPE" == "Wireless" ]]; then
    # airportコマンドのパス
    AIRPORT_PATH="/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport"
    if [[ -x "$AIRPORT_PATH" ]]; then
        WLAN_INFO=$("$AIRPORT_PATH" -I)
        SSID=$(echo "$WLAN_INFO" | grep ' SSID:' | awk -F': ' '{print $2}')
        BSSID=$(echo "$WLAN_INFO" | grep ' BSSID:' | awk -F': ' '{print $2}')
        SIGNAL=$(echo "$WLAN_INFO" | grep ' agrCtlRSSI:' | awk -F': ' '{print $2}')
        NOISE=$(echo "$WLAN_INFO" | grep ' agrCtlNoise:' | awk -F': ' '{print $2}')
        CHANNEL=$(echo "$WLAN_INFO" | grep ' channel:' | awk -F': ' '{print $2}')
        TX_RATE=$(echo "$WLAN_INFO" | grep ' lastTxRate:' | awk -F': ' '{print $2}')
    fi
fi

# CSV形式で一行のデータを作成し、ファイルに追記
echo "\"$TIMESTAMP\",\"$CONNECTION_TYPE\",\"$INTERFACE_NAME\",$ROUTER_STATS,$EXTERNAL_STATS,\"$SSID\",\"$BSSID\",\"$SIGNAL\",\"$NOISE\",\"$CHANNEL\",\"$TX_RATE\"" >> "$LOGFILE"

exit 0