/**
 * ネットワーク監視データの異常値・外れ値検出ユーティリティ
 */

// 統計的しきい値
const THRESHOLDS = {
  // Ping応答時間 (ms)
  routerPing: {
    warning: 10, // 10ms以上で警告
    critical: 50, // 50ms以上で重大
    outlier: 100, // 100ms以上で異常値
  },
  externalPing: {
    warning: 30, // 30ms以上で警告
    critical: 100, // 100ms以上で重大
    outlier: 500, // 500ms以上で異常値
  },
  // パケットロス (%)
  packetLoss: {
    warning: 1, // 1%以上で警告
    critical: 5, // 5%以上で重大
    outlier: 20, // 20%以上で異常値
  },
  // Wi-Fi信号強度 (dBm - 絶対値)
  signalStrength: {
    warning: 60, // -60dBm以下で警告
    critical: 70, // -70dBm以下で重大
    outlier: 80, // -80dBm以下で異常値
  },
  // 転送レート急激な変化 (%)
  transmitRateChange: {
    warning: 50, // 50%以上の変化で警告
    critical: 80, // 80%以上の変化で重大
    outlier: 95, // 95%以上の変化で異常値
  },
};

/**
 * 統計的異常値検出（Interquartile Range method）
 * @param {number[]} values - 数値配列
 * @param {number} multiplier - IQR倍数（デフォルト: 1.5）
 * @return {Object} 統計情報と異常値
 */
export function detectOutliers(values, multiplier = 1.5) {
  if (!values || values.length === 0) return null;

  // null値を除外してソート
  const sortedValues = values.filter((v) => v !== null && v !== undefined && !isNaN(v)).sort((a, b) => a - b);

  if (sortedValues.length < 4) return null; // データが少なすぎる場合

  const q1Index = Math.floor(sortedValues.length * 0.25);
  const q3Index = Math.floor(sortedValues.length * 0.75);
  const q1 = sortedValues[q1Index];
  const q3 = sortedValues[q3Index];
  const iqr = q3 - q1;

  const lowerBound = q1 - iqr * multiplier;
  const upperBound = q3 + iqr * multiplier;

  const outliers = sortedValues.filter((v) => v < lowerBound || v > upperBound);

  return {
    q1,
    q3,
    iqr,
    lowerBound,
    upperBound,
    outliers,
    mean: sortedValues.reduce((sum, v) => sum + v, 0) / sortedValues.length,
    median: sortedValues[Math.floor(sortedValues.length / 0.5)],
    min: sortedValues[0],
    max: sortedValues[sortedValues.length - 1],
  };
}

/**
 * 移動平均を計算
 * @param {number[]} values - 数値配列
 * @param {number} windowSize - ウィンドウサイズ
 * @return {number[]} 移動平均配列
 */
export function calculateMovingAverage(values, windowSize = 5) {
  if (!values || values.length < windowSize) return values;

  const result = [];
  for (let i = windowSize - 1; i < values.length; i++) {
    const window = values.slice(i - windowSize + 1, i + 1);
    const validValues = window.filter((v) => v !== null && v !== undefined && !isNaN(v));

    if (validValues.length > 0) {
      result.push(validValues.reduce((sum, v) => sum + v, 0) / validValues.length);
    } else {
      result.push(null);
    }
  }
  return result;
}

/**
 * 異常パターンを分析
 * @param {Array} data - ログデータ配列
 * @return {Object} 異常パターン分析結果
 */
export function analyzeAnomalies(data) {
  if (!data || data.length === 0) return null;

  const analysis = {
    totalRecords: data.length,
    timeRange: {
      start: data[0]?.timestamp || data[0]?.fullTime,
      end: data[data.length - 1]?.timestamp || data[data.length - 1]?.fullTime,
    },
    anomalies: {
      routerPing: [],
      externalPing: [],
      packetLoss: [],
      signalStrength: [],
      connectionErrors: [],
    },
    patterns: {
      frequentDisconnections: 0,
      signalDrops: 0,
      highLatencyPeriods: 0,
      packetLossBursts: 0,
    },
    statistics: {},
  };

  // 各メトリクスの統計的分析
  const routerPings = data.map((d) => d.routerPingAvg).filter((v) => v !== null && v !== undefined);
  const externalPings = data.map((d) => d.externalPingAvg).filter((v) => v !== null && v !== undefined);
  const routerLoss = data.map((d) => d.routerLoss).filter((v) => v !== null && v !== undefined);
  const externalLoss = data.map((d) => d.externalLoss).filter((v) => v !== null && v !== undefined);
  const signals = data.map((d) => d.signal).filter((v) => v !== null && v !== undefined);

  analysis.statistics.routerPing = detectOutliers(routerPings);
  analysis.statistics.externalPing = detectOutliers(externalPings);
  analysis.statistics.routerLoss = detectOutliers(routerLoss);
  analysis.statistics.externalLoss = detectOutliers(externalLoss);
  analysis.statistics.signal = detectOutliers(signals.map((s) => Math.abs(s))); // 絶対値で分析

  // 異常値の特定
  data.forEach((record, index) => {
    const timestamp = record.timestamp || record.fullTime;

    // ルーターPing異常
    if (record.routerPingAvg > THRESHOLDS.routerPing.outlier) {
      analysis.anomalies.routerPing.push({
        timestamp,
        value: record.routerPingAvg,
        severity: "critical",
        type: "high_latency",
      });
    }

    // 外部Ping異常
    if (record.externalPingAvg > THRESHOLDS.externalPing.outlier) {
      analysis.anomalies.externalPing.push({
        timestamp,
        value: record.externalPingAvg,
        severity: "critical",
        type: "high_latency",
      });
    }

    // パケットロス異常
    if (record.routerLoss > THRESHOLDS.packetLoss.outlier || record.externalLoss > THRESHOLDS.packetLoss.outlier) {
      analysis.anomalies.packetLoss.push({
        timestamp,
        routerLoss: record.routerLoss,
        externalLoss: record.externalLoss,
        severity: "critical",
        type: "packet_loss",
      });
    }

    // 信号強度異常
    if (Math.abs(record.signal) > THRESHOLDS.signalStrength.outlier) {
      analysis.anomalies.signalStrength.push({
        timestamp,
        value: record.signal,
        severity: "critical",
        type: "weak_signal",
      });
    }

    // 接続エラー
    if (record.connectionType === "Disconnected" || !record.ssid || record.ssid === "N/A") {
      analysis.anomalies.connectionErrors.push({
        timestamp,
        connectionType: record.connectionType,
        ssid: record.ssid,
        severity: "critical",
        type: "disconnection",
      });
    }

    // パターン分析
    if (record.routerLoss > THRESHOLDS.packetLoss.critical && record.externalLoss > THRESHOLDS.packetLoss.critical) {
      analysis.patterns.packetLossBursts++;
    }

    if (
      record.routerPingAvg > THRESHOLDS.routerPing.critical ||
      record.externalPingAvg > THRESHOLDS.externalPing.critical
    ) {
      analysis.patterns.highLatencyPeriods++;
    }

    if (Math.abs(record.signal) > THRESHOLDS.signalStrength.critical) {
      analysis.patterns.signalDrops++;
    }

    if (record.connectionType === "Disconnected") {
      analysis.patterns.frequentDisconnections++;
    }
  });

  return analysis;
}

/**
 * 異常度スコアを計算（0-100）
 * @param {Object} analysisResult - analyzeAnomalies()の結果
 * @return {number} 異常度スコア
 */
export function calculateAnomalyScore(analysisResult) {
  if (!analysisResult) return 0;

  const { anomalies, patterns, totalRecords } = analysisResult;

  let score = 0;

  // 異常値の数に基づくスコア
  const totalAnomalies =
    anomalies.routerPing.length +
    anomalies.externalPing.length +
    anomalies.packetLoss.length +
    anomalies.signalStrength.length +
    anomalies.connectionErrors.length;

  // 異常値の割合（最大50点）
  score += Math.min(50, (totalAnomalies / totalRecords) * 100 * 5);

  // パターンベースのスコア（最大50点）
  score += Math.min(10, patterns.frequentDisconnections * 2);
  score += Math.min(10, patterns.signalDrops * 0.5);
  score += Math.min(15, patterns.highLatencyPeriods * 0.3);
  score += Math.min(15, patterns.packetLossBursts * 1);

  return Math.min(100, Math.round(score));
}

/**
 * 異常度レベルを取得
 * @param {number} score - 異常度スコア
 * @return {Object} レベル情報
 */
export function getAnomalyLevel(score) {
  if (score >= 80) {
    return { level: "critical", label: "重大", color: "#F44336" };
  } else if (score >= 60) {
    return { level: "high", label: "高", color: "#FF9800" };
  } else if (score >= 40) {
    return { level: "medium", label: "中", color: "#FFC107" };
  } else if (score >= 20) {
    return { level: "low", label: "低", color: "#4CAF50" };
  } else {
    return { level: "normal", label: "正常", color: "#2196F3" };
  }
}
