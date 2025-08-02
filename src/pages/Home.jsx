import React from 'react'
import { Link } from 'react-router-dom'
import { Settings, Activity } from 'lucide-react'

export default function Home() {
  return (
    <div className="home-container">
      <Link to="/settings" className="main-button">
        <Settings className="main-button-icon" />
        <div className="main-button-title">設定</div>
        <div className="main-button-description">
          プラットフォーム別の監視設定を<br />確認・変更できます
        </div>
      </Link>
      
      <Link to="/monitoring" className="main-button">
        <Activity className="main-button-icon" />
        <div className="main-button-title">モニタリング</div>
        <div className="main-button-description">
          ネットワーク状況をリアルタイムで<br />可視化して確認できます
        </div>
      </Link>
    </div>
  )
}