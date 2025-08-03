import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, Cell } from 'recharts'
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Activity, Download } from 'lucide-react'
import { analyzeAnomalies, calculateAnomalyScore, getAnomalyLevel, detectOutliers } from '../utils/anomalyDetection'

const AnomalyAnalysisPage = () => {
  const [logData, setLogData] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [anomalyScore, setAnomalyScore] = useState(0)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  useEffect(() => {
    loadLogData()
  }, [selectedTimeRange])

  useEffect(() => {
    if (logData.length > 0) {
      const analysis = analyzeAnomalies(logData)
      setAnalysisResult(analysis)
      setAnomalyScore(calculateAnomalyScore(analysis))
    }
  }, [logData])

  const loadLogData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/logs?range=${selectedTimeRange}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setLogData(data)
        } else {
          setLogData([])
        }
      } else {
        setLogData([])
      }
    } catch (error) {
      console.error('ログデータの読み込みに失敗しました:', error)
      setLogData([])
    }
    setLoading(false)
  }



  const exportAnalysisReport = () => {
    if (!analysisResult) return

    const report = {
      generatedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
      anomalyScore: anomalyScore,
      anomalyLevel: getAnomalyLevel(anomalyScore),
      summary: {
        totalRecords: analysisResult.totalRecords,
        timeRange: analysisResult.timeRange,
        totalAnomalies: Object.values(analysisResult.anomalies).reduce((sum, arr) => sum + arr.length, 0)
      },
      details: analysisResult
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `network-anomaly-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="monitoring-container">
        <h2>異常値分析中...</h2>
      </div>
    )
  }

  if (logData.length === 0) {
    return (
      <div className="monitoring-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <XCircle size={48} style={{ color: '#F44336', marginBottom: '1rem' }} />
          <h2>分析対象データがありません</h2>
          <p>ネットワーク監視データを収集してから分析を実行してください。</p>
        </div>
      </div>
    )
  }

  const anomalyLevel = getAnomalyLevel(anomalyScore)

  // 異常値散布図用のデータ準備
  const scatterData = logData.map((record, index) => ({
    index,
    routerPing: record.routerPingAvg,
    externalPing: record.externalPingAvg,
    routerLoss: record.routerLoss,
    externalLoss: record.externalLoss,
    signal: Math.abs(record.signal),
    timestamp: record.fullTime || record.timestamp
  }))

  return (
    <div className="monitoring-container">
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>ネットワーク異常値分析</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #555',
              backgroundColor: '#333',
              color: '#fff'
            }}
          >
            <option value="24h">24時間</option>
            <option value="7d">7日間</option>
            <option value="30d">30日間</option>
          </select>

          <button
            className="button"
            onClick={exportAnalysisReport}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={16} />
            レポート出力
          </button>
        </div>
      </div>

      {/* 異常度スコア表示 */}
      <div className="monitoring-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Activity size={24} />
          総合異常度スコア
        </h3>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: anomalyLevel.color, margin: '1rem 0' }}>
          {anomalyScore}
        </div>
        <div style={{ fontSize: '1.2rem', color: anomalyLevel.color }}>
          {anomalyLevel.label}レベル ({anomalyLevel.level})
        </div>
        {analysisResult && (
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
            分析期間: {analysisResult.timeRange.start} ～ {analysisResult.timeRange.end}
            <br />
            データ件数: {analysisResult.totalRecords}件
          </div>
        )}
      </div>

      {/* 異常値サマリー */}
      {analysisResult && (
        <div className="monitoring-grid" style={{ marginBottom: '2rem' }}>
          <div className="monitoring-card">
            <h4 style={{ color: '#F44336' }}>接続エラー</h4>
            <div className="metric-value">{analysisResult.anomalies.connectionErrors.length}</div>
            <div className="metric-label">件</div>
          </div>
          <div className="monitoring-card">
            <h4 style={{ color: '#FF9800' }}>高レイテンシ</h4>
            <div className="metric-value">
              {analysisResult.anomalies.routerPing.length + analysisResult.anomalies.externalPing.length}
            </div>
            <div className="metric-label">件</div>
          </div>
          <div className="monitoring-card">
            <h4 style={{ color: '#FFC107' }}>パケットロス</h4>
            <div className="metric-value">{analysisResult.anomalies.packetLoss.length}</div>
            <div className="metric-label">件</div>
          </div>
          <div className="monitoring-card">
            <h4 style={{ color: '#9C27B0' }}>信号異常</h4>
            <div className="metric-value">{analysisResult.anomalies.signalStrength.length}</div>
            <div className="metric-label">件</div>
          </div>
        </div>
      )}

      {/* 異常パターン分析 */}
      {analysisResult && (
        <div className="chart-container">
          <h3>異常パターン分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: '頻繁な切断', value: analysisResult.patterns.frequentDisconnections, color: '#F44336' },
                { name: '信号低下', value: analysisResult.patterns.signalDrops, color: '#FF9800' },
                { name: '高遅延期間', value: analysisResult.patterns.highLatencyPeriods, color: '#FFC107' },
                { name: 'パケットロス', value: analysisResult.patterns.packetLossBursts, color: '#9C27B0' }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" fontSize={12} />
              <YAxis stroke="#ccc" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#333',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value">
                {[
                  { name: '頻繁な切断', value: analysisResult.patterns.frequentDisconnections, color: '#F44336' },
                  { name: '信号低下', value: analysisResult.patterns.signalDrops, color: '#FF9800' },
                  { name: '高遅延期間', value: analysisResult.patterns.highLatencyPeriods, color: '#FFC107' },
                  { name: 'パケットロス', value: analysisResult.patterns.packetLossBursts, color: '#9C27B0' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 異常値散布図 */}
      <div className="chart-container">
        <h3>レイテンシ vs パケットロス散布図</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              type="number"
              dataKey="routerPing"
              name="ルーターPing"
              unit="ms"
              stroke="#ccc"
              fontSize={12}
            />
            <YAxis
              type="number"
              dataKey="routerLoss"
              name="パケットロス"
              unit="%"
              stroke="#ccc"
              fontSize={12}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff'
              }}
              formatter={(value, name) => [
                `${value}${name === 'routerPing' ? 'ms' : '%'}`,
                name === 'routerPing' ? 'ルーターPing' : 'パケットロス'
              ]}
            />
            <Scatter dataKey="routerPing" fill="#4CAF50" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* 統計情報詳細 */}
      {analysisResult && analysisResult.statistics && (
        <div className="chart-container">
          <h3>統計的外れ値分析</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {Object.entries(analysisResult.statistics).map(([key, stats]) => {
              if (!stats) return null
              return (
                <div key={key} className="monitoring-card">
                  <h4>{
                    key === 'routerPing' ? 'ルーターPing' :
                    key === 'externalPing' ? '外部Ping' :
                    key === 'routerLoss' ? 'ルーターパケットロス' :
                    key === 'externalLoss' ? '外部パケットロス' :
                    key === 'signal' ? 'Wi-Fi信号強度' : key
                  }</h4>
                  <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    <div>平均: {stats.mean?.toFixed(2)}</div>
                    <div>中央値: {stats.median?.toFixed(2)}</div>
                    <div>最小-最大: {stats.min?.toFixed(2)} - {stats.max?.toFixed(2)}</div>
                    <div>外れ値: {stats.outliers.length}件</div>
                    <div style={{ color: '#FF9800' }}>
                      異常範囲: {stats.lowerBound?.toFixed(2)} 未満, {stats.upperBound?.toFixed(2)} 超過
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 詳細な異常値リスト */}
      {analysisResult && (
        <div className="chart-container">
          <h3>検出された異常値 (直近10件)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #555' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>時刻</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>種類</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>値</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>重要度</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analysisResult.anomalies)
                  .flatMap(([type, anomalies]) =>
                    anomalies.map(anomaly => ({ ...anomaly, type }))
                  )
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .slice(0, 10)
                  .map((anomaly, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '0.5rem' }}>{anomaly.timestamp}</td>
                      <td style={{ padding: '0.5rem' }}>
                        {
                          anomaly.type === 'routerPing' ? 'ルーターPing' :
                          anomaly.type === 'externalPing' ? '外部Ping' :
                          anomaly.type === 'packetLoss' ? 'パケットロス' :
                          anomaly.type === 'signalStrength' ? '信号強度' :
                          anomaly.type === 'connectionErrors' ? '接続エラー' : anomaly.type
                        }
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        {anomaly.value ? `${anomaly.value.toFixed(2)}` : 
                         anomaly.routerLoss ? `R:${anomaly.routerLoss}% E:${anomaly.externalLoss}%` : 
                         anomaly.connectionType || 'N/A'}
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <span style={{
                          color: anomaly.severity === 'critical' ? '#F44336' : '#FF9800',
                          fontWeight: 'bold'
                        }}>
                          {anomaly.severity === 'critical' ? '重大' : '警告'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnomalyAnalysisPage