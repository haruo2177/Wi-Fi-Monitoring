#!/bin/bash

# Network Monitoring Tool - Full Stack Starter
# フロントエンドとバックエンドを同時起動

# デフォルトポート設定
SERVER_PORT=${SERVER_PORT:-3002}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

echo "🚀 Network Monitoring Tool を起動中..."
echo ""

# ポート使用状況をチェック
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        echo "⚠️  ポート $port は既に使用されています"
        echo "使用中のプロセス:"
        lsof -i :$port
        echo ""
        echo "既存のプロセスを終了してから再試行してください："
        echo "  kill \$(lsof -t -i:$port)"
        return 1
    fi
    return 0
}

# サーバーポートチェック
if ! check_port $SERVER_PORT; then
    echo "❌ サーバーポート $SERVER_PORT が使用中のため起動できません"
    exit 1
fi

echo "📊 バックエンドサーバー: http://localhost:$SERVER_PORT"
echo "🌐 フロントエンドUI: http://localhost:$FRONTEND_PORT"
echo ""
echo "⚠️  終了するには Ctrl+C を押してください"
echo ""

# フロントエンドとバックエンドを同時実行
npm run dev:full
