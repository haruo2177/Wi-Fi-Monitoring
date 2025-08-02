# CSV 出力形式仕様

Network Monitor ツールが出力する CSV ファイルの形式仕様です。

## ファイル形式

- **文字エンコーディング**: UTF-8
- **改行文字**: LF (Unix 形式)
- **区切り文字**: カンマ (,)
- **引用符**: ダブルクォート (")

## ヘッダー行

```csv
Timestamp,ConnectionType,InterfaceName,RouterPingAvg(ms),RouterPingMax(ms),RouterLoss(%),ExternalPingAvg(ms),ExternalPingMax(ms),ExternalLoss(%),SSID,BSSID,Signal(dBm),Noise(dBm),Channel,TransmitRate(Mbps)
```

## 各フィールドの詳細

| 順序 | フィールド名        | データ型 | 説明                               | 例                                  |
| ---- | ------------------- | -------- | ---------------------------------- | ----------------------------------- |
| 1    | Timestamp           | 文字列   | 測定日時 (YYYY-MM-DD HH:MM:SS)     | "2025-08-02 12:36:28"               |
| 2    | ConnectionType      | 文字列   | 接続種別                           | "Wireless", "Wired", "Disconnected" |
| 3    | InterfaceName       | 文字列   | ネットワークインターフェース名     | "en1", "eth0", "wlan0"              |
| 4    | RouterPingAvg(ms)   | 数値     | ルーターへの平均 Ping 応答時間     | 3.942                               |
| 5    | RouterPingMax(ms)   | 数値     | ルーターへの最大 Ping 応答時間     | 6.966                               |
| 6    | RouterLoss(%)       | 数値     | ルーターへのパケットロス率         | 0.0                                 |
| 7    | ExternalPingAvg(ms) | 数値     | 外部サーバーへの平均 Ping 応答時間 | 8.655                               |
| 8    | ExternalPingMax(ms) | 数値     | 外部サーバーへの最大 Ping 応答時間 | 15.890                              |
| 9    | ExternalLoss(%)     | 数値     | 外部サーバーへのパケットロス率     | 0.0                                 |
| 10   | SSID                | 文字列   | Wi-Fi SSID（無線時のみ）           | "some-ssid"                         |
| 11   | BSSID               | 文字列   | Wi-Fi BSSID（取得可能時のみ）      | "aa:bb:cc:dd:ee:ff" または "N/A"    |
| 12   | Signal(dBm)         | 文字列   | Wi-Fi 信号強度                     | "-56"                               |
| 13   | Noise(dBm)          | 文字列   | Wi-Fi ノイズレベル                 | "-90"                               |
| 14   | Channel             | 文字列   | Wi-Fi チャンネル                   | "64"                                |
| 15   | TransmitRate(Mbps)  | 文字列   | Wi-Fi 送信レート                   | "680"                               |

## データ値の規則

### NULL 値・取得失敗時

- 数値フィールド: `N/A`
- 文字列フィールド: `"N/A"` または `""`

### 引用符の使用

- **文字列フィールド**: 常にダブルクォートで囲む
- **数値フィールド**: 引用符なし（N/A 時は除く）

## プラットフォーム別の実装差異

### macOS

- **BSSID**: セキュリティ制限により通常は "N/A"
- **Signal/Noise**: system_profiler から取得
- **TransmitRate**: 実測値（648-720 Mbps 範囲）

### Windows

- **BSSID**: netsh コマンドで取得可能
- **インターフェース名**: "Wi-Fi", "Ethernet"形式
- **TransmitRate**: WMI 経由で取得

### Ubuntu/Linux

- **BSSID**: iwconfig/iw で取得
- **インターフェース名**: "wlan0", "eth0"形式
- **TransmitRate**: iwconfig 経由で取得

## サンプルデータ

```csv
Timestamp,ConnectionType,InterfaceName,RouterPingAvg(ms),RouterPingMax(ms),RouterLoss(%),ExternalPingAvg(ms),ExternalPingMax(ms),ExternalLoss(%),SSID,BSSID,Signal(dBm),Noise(dBm),Channel,TransmitRate(Mbps)
"2025-08-02 12:36:28","Wireless","en1",3.942,6.966,0.0,8.655,15.890,0.0,"some-wifi-5G","N/A","-56","-90","64","680"
"2025-08-02 12:37:23","Wireless","en1",5.867,6.853,0.0,6.699,11.007,0.0,"some-wifi-5G","N/A","-58","-90","64","720"
"2025-08-02 12:42:33","Disconnected","N/A",N/A,N/A,100,N/A,N/A,100,"","","","","",""
```

## データ分析での注意点

- 数値フィールドの "N/A" 値の処理
- タイムスタンプの文字列解析
- プラットフォーム間での命名差異の考慮
