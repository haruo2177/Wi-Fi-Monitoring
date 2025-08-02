# コードスタイル・規約（2025年8月2日更新）

## Zsh/Bashスクリプト規約

### 基本構造
```bash
#!/bin/zsh

# ファイルヘッダー（機能説明）
# =============================================================================
# 機能説明
# =============================================================================

# PATH設定（launchd対応）
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# 設定セクション
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
```

### 変数命名規則
- **大文字**: 環境変数・設定値（LOGFILE, DEBUG）
- **小文字**: 一時変数・ローカル変数（output, target）
- **説明的名前**: EXTERNAL_TARGETS, ROUTER_ADDRESS

### 関数設計
```bash
# 関数コメント
function_name() {
    local param1=$1
    local param2=$2
    
    # 処理内容
    echo "result"
}
```

## エラーハンドリング

### 基本パターン
```bash
if [[ $? -eq 0 ]]; then
    # 成功処理
    debug_log "処理成功: $target"
else
    # 失敗処理
    debug_log "処理失敗: $target"
fi
```

### 値の検証
```bash
# 空値チェック
VARIABLE=${VARIABLE:-"デフォルト値"}

# 必須パラメータ
if [[ -z "$REQUIRED_VAR" ]]; then
    echo "エラー: 必須変数が未設定" >&2
    exit 1
fi
```

## デバッグ・ログ

### デバッグ関数
```bash
debug_log() {
    if [[ "$DEBUG" == "true" ]]; then
        echo "[DEBUG $(date +"%H:%M:%S")] $1" >&2
    fi
}
```

### ログレベル
- **INFO**: 通常処理（標準出力）
- **DEBUG**: 詳細情報（デバッグモード時）
- **ERROR**: エラー情報（標準エラー出力）

## ファイル・ディレクトリ操作

### パス処理
```bash
# 絶対パス取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

# 相対パス使用（ポータビリティ）
LOGFILE="$PROJECT_ROOT/network_monitor_log.csv"
```

### ファイル存在確認
```bash
if [[ -f "$CONFIG_FILE" ]]; then
    source "$CONFIG_FILE"
fi

if [[ ! -f "$LOGFILE" ]]; then
    # ヘッダー作成
    echo "header" > "$LOGFILE"
fi
```

## CSV出力フォーマット

### 標準形式
```bash
# ダブルクォート必須（カンマ・スペース対応）
CSV_LINE="\"$TIMESTAMP\",\"$CONNECTION_TYPE\",\"$INTERFACE_NAME\",$VALUES"

# 数値は引用符なし
CSV_LINE="$CSV_LINE,$NUMERIC_VALUE"
```

## 設定ファイル規約

### 変数定義
```bash
# コメント（日本語OK）
VARIABLE_NAME="値"

# 配列定義
ARRAY_NAME=("value1" "value2" "value3")

# 空値（デフォルト使用）
OPTIONAL_VALUE=""
```