import React from 'react'
import { useRouteError, Link } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="error-page">
      <AlertCircle size={64} color="#ff6b6b" />
      <h1>エラーが発生しました</h1>
      <p>申し訳ありませんが、予期しないエラーが発生しました。</p>
      <p style={{ fontStyle: 'italic', color: '#999' }}>
        {error?.statusText || error?.message || '不明なエラー'}
      </p>
      <Link to="/" className="back-link">
        <Home size={16} style={{ marginRight: '0.5rem' }} />
        ホームに戻る
      </Link>
    </div>
  )
}