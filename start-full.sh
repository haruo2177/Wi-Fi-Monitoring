#!/bin/bash

# Wi-Fi Monitoring Tool - Full Stack Starter
# フロントエンドとバックエンドを同時起動

echo "🚀 Wi-Fi Monitoring Tool を起動中..."
echo ""
echo "📊 バックエンドサーバー: http://localhost:${SERVER_PORT:-3002}"
echo "🌐 フロントエンドUI: http://localhost:${FRONTEND_PORT:-3000}"
echo ""
echo "⚠️  終了するには Ctrl+C を押してください"
echo ""

# フロントエンドとバックエンドを同時実行
npm run dev:full
