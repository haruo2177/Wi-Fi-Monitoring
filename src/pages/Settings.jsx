import React from 'react'
import { Link } from 'react-router-dom'
import { Monitor, Smartphone, Server } from 'lucide-react'

export default function Settings() {
  const platforms = [
    {
      id: 'macos',
      name: 'macOS',
      icon: Monitor,
      description: 'macOS専用の監視設定。system_profilerとlaunchdを使用'
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: Monitor,
      description: 'Windows用の監視設定。PowerShellとタスクスケジューラを使用'
    },
    {
      id: 'ubuntu',
      name: 'Ubuntu/Linux',
      icon: Server,
      description: 'Ubuntu/Linux用の監視設定。systemdとiwconfigを使用'
    }
  ]

  return (
    <div className="settings-container">
      <h2>プラットフォーム設定</h2>
      <p>各プラットフォームの監視設定を確認・変更できます。</p>
      
      <div className="settings-grid">
        {platforms.map(platform => {
          const IconComponent = platform.icon
          return (
            <Link 
              key={platform.id} 
              to={`/settings/${platform.id}`} 
              className="platform-card"
            >
              <IconComponent size={32} style={{ marginBottom: '0.5rem' }} />
              <h3>{platform.name}</h3>
              <p>{platform.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}