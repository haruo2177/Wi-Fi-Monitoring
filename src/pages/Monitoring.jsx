import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Wifi, Globe, Router, Clock, Signal, AlertCircle } from 'lucide-react'

// カスタムTooltipコンポーネント
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        backgroundColor: '#333',
        border: '1px solid #555',
        borderRadius: '4px',
        padding: '10px',
        color: '#fff'
      }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
          {data.fullTime || data.time}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '2px 0', color: entry.color }}>
            {`${entry.name}: ${entry.value !== null ? entry.value.toFixed(2) : 'N/A'}${
              entry.dataKey.includes('Ping') ? 'ms' :
              entry.dataKey.includes('Loss') ? '%' :
              entry.dataKey === 'signal' ? 'dBm' :
              entry.dataKey === 'transmitRate' ? 'Mbps' : ''
            }`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Monitoring() {
  const [logData, setLogData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentStatus, setCurrentStatus] = useState({})
  const [timeRange, setTimeRange] = useState('24h') // 24h, 7d, 30d

  useEffect(() => {
    loadLogData()
    const interval = setInterval(loadLogData, 30000) // 30秒ごとに更新
    return () => clearInterval(interval)
  }, [timeRange])

  const loadLogData = async () => {
    try {
      console.log('Fetching log data from API:', `/api/logs?range=${timeRange}`)
      const response = await fetch(`/api/logs?range=${timeRange}`)
      console.log('API Response status:', response.status)

      if (response.ok) {
        const data = await response.json()

        // サーバーからのレスポンスが配列の場合（実データ）
        if (Array.isArray(data)) {
          console.log('API Data received:', data.length, 'records')
          console.log('Latest data point:', data[data.length - 1])
          setLogData(data)
          if (data.length > 0) {
            setCurrentStatus(data[data.length - 1])
          }
        } else {
          // サーバーからのレスポンスがオブジェクトの場合（エラーメッセージ）
          console.log('No log data available:', data.message)
          setLogData([])
          setCurrentStatus({})
        }
      } else {
        console.error('API Response not ok:', response.status, response.statusText)
        setLogData([])
        setCurrentStatus({})
      }
    } catch (error) {
      console.error('ログデータの読み込みに失敗しました:', error)
      setLogData([])
      setCurrentStatus({})
    }
    setLoading(false)
  }

  const getStatusIndicator = (value, thresholds) => {
    if (value === null || value === undefined) return 'status-error'
    if (value <= thresholds.good) return 'status-good'
    if (value <= thresholds.warning) return 'status-warning'
    return 'status-error'
  }

  const getConnectionStatus = () => {
    if (!currentStatus.connectionType || currentStatus.connectionType === 'Disconnected') {
      return { status: 'status-error', text: '切断' }
    }
    if (currentStatus.routerLoss > 5 || currentStatus.externalLoss > 10) {
      return { status: 'status-warning', text: '不安定' }
    }
    return { status: 'status-good', text: '正常' }
  }

  const connectionStatus = getConnectionStatus()

  if (loading) {
    return (
      <div className="monitoring-container">
        <h2>データを読み込み中...</h2>
      </div>
    )
  }

  // データが存在しない場合の表示
  if (logData.length === 0) {
    return (
      <div className="monitoring-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <AlertCircle size={48} style={{ color: '#FF9800', marginBottom: '1rem' }} />
          <h2>ネットワーク監視データがありません</h2>
          <p style={{ color: '#888', marginBottom: '1rem' }}>
            ログファイルが見つかりません。<br/>
            ネットワーク監視を開始してデータを収集してください。
          </p>
          <button
            className="button primary"
            onClick={loadLogData}
            style={{ marginTop: '1rem' }}
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="monitoring-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>ネットワーク監視 <span style={{ fontSize: '0.8rem', color: '#888' }}>（左から右へ時間が進行）</span></h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`button ${timeRange === '24h' ? 'primary' : ''}`}
            onClick={() => setTimeRange('24h')}
          >
            24時間
          </button>
          <button
            className={`button ${timeRange === '7d' ? 'primary' : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            7日間
          </button>
          <button
            className={`button ${timeRange === '30d' ? 'primary' : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            30日間
          </button>
        </div>
      </div>

      {/* デバッグ情報 */}
      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
        データ件数: {logData.length} | 最新データ時刻: {currentStatus.fullTime || currentStatus.timestamp || 'N/A'}
      </div>      {/* 現在のステータス */}
      <div className="monitoring-grid">
        <div className="monitoring-card">
          <h3><Globe size={20} style={{ marginRight: '0.5rem' }} />接続状態</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-indicator ${connectionStatus.status}`}></span>
            <span className="metric-value">{connectionStatus.text}</span>
          </div>
          <div className="metric-label">
            {currentStatus.connectionType || 'Unknown'} ({currentStatus.interfaceName || 'N/A'})
          </div>
        </div>

        <div className="monitoring-card">
          <h3><Router size={20} style={{ marginRight: '0.5rem' }} />ルーター応答</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-indicator ${getStatusIndicator(currentStatus.routerPingAvg, { good: 5, warning: 20 })}`}></span>
            <span className="metric-value">
              {currentStatus.routerPingAvg ? `${currentStatus.routerPingAvg.toFixed(1)}ms` : 'N/A'}
            </span>
          </div>
          <div className="metric-label">
            パケットロス: {currentStatus.routerLoss ? `${currentStatus.routerLoss.toFixed(1)}%` : 'N/A'}
          </div>
        </div>

        <div className="monitoring-card">
          <h3><Globe size={20} style={{ marginRight: '0.5rem' }} />外部接続</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-indicator ${getStatusIndicator(currentStatus.externalPingAvg, { good: 20, warning: 50 })}`}></span>
            <span className="metric-value">
              {currentStatus.externalPingAvg ? `${currentStatus.externalPingAvg.toFixed(1)}ms` : 'N/A'}
            </span>
          </div>
          <div className="metric-label">
            パケットロス: {currentStatus.externalLoss ? `${currentStatus.externalLoss.toFixed(1)}%` : 'N/A'}
          </div>
        </div>

        <div className="monitoring-card">
          <h3><Wifi size={20} style={{ marginRight: '0.5rem' }} />Wi-Fi信号</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-indicator ${getStatusIndicator(Math.abs(currentStatus.signal), { good: 50, warning: 70 })}`}></span>
            <span className="metric-value">
              {currentStatus.signal ? `${currentStatus.signal.toFixed(0)}dBm` : 'N/A'}
            </span>
          </div>
          <div className="metric-label">
            {currentStatus.ssid || 'N/A'} - Ch.{currentStatus.channel || 'N/A'}
          </div>
        </div>
      </div>

      {/* Ping応答時間のグラフ */}
      <div className="chart-container">
        <h3>Ping応答時間の推移 <span style={{ fontSize: '0.8rem', color: '#888' }}>（左：過去 → 右：現在）</span></h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="time"
              stroke="#ccc"
              fontSize={11}
              angle={timeRange === '24h' ? 0 : -45}
              textAnchor={timeRange === '24h' ? 'middle' : 'end'}
              height={timeRange === '24h' ? 50 : 80}
              interval={timeRange === '24h' ? 'preserveStartEnd' : 'preserveStart'}
            />
            <YAxis
              stroke="#ccc"
              fontSize={12}
              label={{ value: '応答時間 (ms)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="routerPingAvg"
              stroke="#4CAF50"
              name="ルーター"
              connectNulls={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="externalPingAvg"
              stroke="#2196F3"
              name="外部サーバー"
              connectNulls={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* パケットロス率のグラフ */}
      <div className="chart-container">
        <h3>パケットロス率の推移 <span style={{ fontSize: '0.8rem', color: '#888' }}>（左：過去 → 右：現在）</span></h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="time"
              stroke="#ccc"
              fontSize={11}
              angle={timeRange === '24h' ? 0 : -45}
              textAnchor={timeRange === '24h' ? 'middle' : 'end'}
              height={timeRange === '24h' ? 50 : 80}
              interval={timeRange === '24h' ? 'preserveStartEnd' : 'preserveStart'}
            />
            <YAxis
              stroke="#ccc"
              fontSize={12}
              label={{ value: 'パケットロス (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="routerLoss"
              stroke="#FF9800"
              name="ルーター"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="externalLoss"
              stroke="#F44336"
              name="外部サーバー"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Wi-Fi信号強度のグラフ */}
      <div className="chart-container">
        <h3>Wi-Fi信号強度と転送レート <span style={{ fontSize: '0.8rem', color: '#888' }}>（左：過去 → 右：現在）</span></h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="time"
              stroke="#ccc"
              fontSize={11}
              angle={timeRange === '24h' ? 0 : -45}
              textAnchor={timeRange === '24h' ? 'middle' : 'end'}
              height={timeRange === '24h' ? 50 : 80}
              interval={timeRange === '24h' ? 'preserveStartEnd' : 'preserveStart'}
            />
            <YAxis
              yAxisId="signal"
              stroke="#ccc"
              fontSize={12}
              label={{ value: '信号強度 (dBm)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="rate"
              orientation="right"
              stroke="#ccc"
              fontSize={12}
              label={{ value: '転送レート (Mbps)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="signal"
              type="monotone"
              dataKey="signal"
              stroke="#9C27B0"
              name="信号強度 (dBm)"
              strokeWidth={2}
            />
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="transmitRate"
              stroke="#00BCD4"
              name="転送レート (Mbps)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}