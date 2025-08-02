import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, RefreshCw } from 'lucide-react'

export default function SettingsPlatform() {
  const { platform } = useParams()
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const platformNames = {
    macos: 'macOS',
    windows: 'Windows',
    ubuntu: 'Ubuntu/Linux'
  }

  useEffect(() => {
    loadConfig()
  }, [platform])

  const loadConfig = async () => {
    setLoading(true)
    try {
      // 実際の実装では、設定ファイルを読み込む
      const response = await fetch(`/api/config/${platform}`)
      if (response.ok) {
        const configData = await response.json()
        setConfig(configData)
      } else {
        // デフォルト設定を読み込む
        setConfig(getDefaultConfig(platform))
      }
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error)
      setConfig(getDefaultConfig(platform))
    }
    setLoading(false)
  }

  const getDefaultConfig = (platform) => {
    const baseConfig = {
      LOGFILE_PATH: './logs/network_monitor_log.csv',
      EXTERNAL_TARGETS: ['8.8.8.8', '1.1.1.1', '208.67.222.222'],
      ROUTER_ADDRESS: 'auto',
      PING_COUNT: 3,
      PING_TIMEOUT: 5,
      DEBUG: false
    }

    switch (platform) {
      case 'macos':
        return {
          ...baseConfig,
          INTERFACE_DETECTION: 'system_profiler SPAirPortDataType',
          WIFI_INFO_COMMAND: 'system_profiler SPAirPortDataType',
          SCHEDULER: 'launchd'
        }
      case 'windows':
        return {
          ...baseConfig,
          INTERFACE_DETECTION: 'netsh interface show interface',
          WIFI_INFO_COMMAND: 'netsh wlan show interfaces',
          SCHEDULER: 'Task Scheduler'
        }
      case 'ubuntu':
        return {
          ...baseConfig,
          INTERFACE_DETECTION: 'ip route | grep default',
          WIFI_INFO_COMMAND: 'iwconfig',
          SCHEDULER: 'systemd'
        }
      default:
        return baseConfig
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/config/${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        alert('設定が保存されました')
      } else {
        alert('設定の保存に失敗しました')
      }
    } catch (error) {
      console.error('設定の保存に失敗しました:', error)
      alert('設定の保存に失敗しました')
    }
    setSaving(false)
  }

  const handleInputChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleArrayChange = (key, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setConfig(prev => ({
      ...prev,
      [key]: array
    }))
  }

  if (loading) {
    return (
      <div className="settings-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/settings" className="back-link">
            <ArrowLeft size={16} />
          </Link>
          <h2>設定を読み込み中...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/settings" className="back-link">
          <ArrowLeft size={16} />
        </Link>
        <h2>{platformNames[platform]} 設定</h2>
      </div>

      <div className="config-section">
        <h3>基本設定</h3>
        <div className="config-form">
          <div className="config-field">
            <label>ログファイルパス</label>
            <input
              type="text"
              value={config.LOGFILE_PATH || ''}
              onChange={(e) => handleInputChange('LOGFILE_PATH', e.target.value)}
            />
          </div>

          <div className="config-field">
            <label>外部監視対象 (カンマ区切り)</label>
            <input
              type="text"
              value={config.EXTERNAL_TARGETS?.join(', ') || ''}
              onChange={(e) => handleArrayChange('EXTERNAL_TARGETS', e.target.value)}
            />
          </div>

          <div className="config-field">
            <label>ルーターアドレス</label>
            <input
              type="text"
              value={config.ROUTER_ADDRESS || ''}
              onChange={(e) => handleInputChange('ROUTER_ADDRESS', e.target.value)}
            />
          </div>

          <div className="config-field">
            <label>Ping回数</label>
            <input
              type="number"
              value={config.PING_COUNT || ''}
              onChange={(e) => handleInputChange('PING_COUNT', parseInt(e.target.value))}
            />
          </div>

          <div className="config-field">
            <label>Pingタイムアウト (秒)</label>
            <input
              type="number"
              value={config.PING_TIMEOUT || ''}
              onChange={(e) => handleInputChange('PING_TIMEOUT', parseInt(e.target.value))}
            />
          </div>

          <div className="config-field">
            <label>
              <input
                type="checkbox"
                checked={config.DEBUG || false}
                onChange={(e) => handleInputChange('DEBUG', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              デバッグモード
            </label>
          </div>
        </div>
      </div>

      <div className="config-section">
        <h3>プラットフォーム固有設定</h3>
        <div className="config-form">
          <div className="config-field">
            <label>インターフェース検出コマンド</label>
            <input
              type="text"
              value={config.INTERFACE_DETECTION || ''}
              onChange={(e) => handleInputChange('INTERFACE_DETECTION', e.target.value)}
              disabled
            />
          </div>

          <div className="config-field">
            <label>Wi-Fi情報取得コマンド</label>
            <input
              type="text"
              value={config.WIFI_INFO_COMMAND || ''}
              onChange={(e) => handleInputChange('WIFI_INFO_COMMAND', e.target.value)}
              disabled
            />
          </div>

          <div className="config-field">
            <label>スケジューラー</label>
            <input
              type="text"
              value={config.SCHEDULER || ''}
              disabled
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button
          className="button primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <RefreshCw size={16} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
              保存中...
            </>
          ) : (
            <>
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              設定を保存
            </>
          )}
        </button>

        <button
          className="button"
          onClick={loadConfig}
          disabled={loading}
        >
          <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
          再読み込み
        </button>
      </div>
    </div>
  )
}