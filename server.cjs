const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const csv = require("csv-parser");
const { createReadStream } = require("fs");

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static("dist"));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Get configuration for a platform
app.get("/api/config/:platform", async (req, res) => {
  const { platform } = req.params;
  const configPath = path.join(__dirname, "platforms", platform, "config", "network_monitor.conf");

  try {
    const configContent = await fs.readFile(configPath, "utf8");
    const config = parseConfig(configContent);
    res.json(config);
  } catch (error) {
    // Return default config if file doesn't exist
    res.json(getDefaultConfig(platform));
  }
});

// Save configuration for a platform
app.post("/api/config/:platform", async (req, res) => {
  const { platform } = req.params;
  const config = req.body;
  const configPath = path.join(__dirname, "platforms", platform, "config", "network_monitor.conf");

  try {
    const configContent = generateConfigFile(config);
    await fs.writeFile(configPath, configContent, "utf8");
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving config:", error);
    res.status(500).json({ error: "Failed to save configuration" });
  }
});

// Get log data
app.get("/api/logs", (req, res) => {
  const { range = "24h" } = req.query;
  const logPath = path.join(__dirname, "logs", "network_monitor_log.csv");

  const results = [];
  const now = new Date();
  const timeLimit = getTimeLimit(range, now);

  // Check if log file exists
  fs.access(logPath)
    .then(() => {
      createReadStream(logPath)
        .pipe(csv())
        .on("data", (data) => {
          const timestamp = new Date(data.Timestamp);
          if (timestamp >= timeLimit) {
            // Convert string values to numbers where appropriate
            const processedData = {
              ...data,
              timestamp: data.Timestamp,
              fullTime: timestamp.toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              time:
                range === "24h"
                  ? timestamp.toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : timestamp.toLocaleDateString("ja-JP", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
              routerPingAvg: parseFloat(data["RouterPingAvg(ms)"]) || null,
              routerPingMax: parseFloat(data["RouterPingMax(ms)"]) || null,
              routerLoss: parseFloat(data["RouterLoss(%)"]) || 0,
              externalPingAvg: parseFloat(data["ExternalPingAvg(ms)"]) || null,
              externalPingMax: parseFloat(data["ExternalPingMax(ms)"]) || null,
              externalLoss: parseFloat(data["ExternalLoss(%)"]) || 0,
              signal: parseFloat(data["Signal(dBm)"]) || null,
              noise: parseFloat(data["Noise(dBm)"]) || null,
              transmitRate: parseFloat(data["TransmitRate(Mbps)"]) || null,
              connectionType: data.ConnectionType,
              interfaceName: data.InterfaceName,
              ssid: data.SSID,
              channel: data.Channel,
            };
            results.push(processedData);
          }
        })
        .on("end", () => {
          // 時系列順（左から右：古い→新しい）にソート
          results.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          res.json(results);
        })
        .on("error", (error) => {
          console.error("Error reading log file:", error);
          res.status(500).json({ error: "Failed to read log file" });
        });
    })
    .catch(() => {
      // If log file doesn't exist, return empty data with message
      console.log("Log file not found, returning empty data");
      res.json({
        data: [],
        message: "ログファイルが見つかりません。ネットワーク監視を開始してください。",
        logPath: logPath,
      });
    });
});

function parseConfig(content) {
  const config = {};
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        let value = valueParts.join("=").trim();

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Parse arrays
        if (value.startsWith("(") && value.endsWith(")")) {
          value = value
            .slice(1, -1)
            .split(" ")
            .map((v) => v.trim().replace(/"/g, ""));
        }

        // Parse booleans
        if (value === "true") value = true;
        if (value === "false") value = false;

        // Parse numbers
        if (!isNaN(value) && value !== "") {
          value = Number(value);
        }

        config[key.trim()] = value;
      }
    }
  }

  return config;
}

function generateConfigFile(config) {
  let content = "# Network Monitor Configuration\n";
  content += `# Generated on ${new Date().toISOString()}\n\n`;

  for (const [key, value] of Object.entries(config)) {
    if (Array.isArray(value)) {
      content += `${key}=(${value.map((v) => `"${v}"`).join(" ")})\n`;
    } else if (typeof value === "string") {
      content += `${key}="${value}"\n`;
    } else {
      content += `${key}=${value}\n`;
    }
  }

  return content;
}

function getDefaultConfig(platform) {
  const baseConfig = {
    LOGFILE_PATH: "./logs/network_monitor_log.csv",
    EXTERNAL_TARGETS: ["8.8.8.8", "1.1.1.1", "208.67.222.222"],
    ROUTER_ADDRESS: "auto",
    PING_COUNT: 3,
    PING_TIMEOUT: 5,
    DEBUG: false,
  };

  switch (platform) {
    case "macos":
      return {
        ...baseConfig,
        INTERFACE_DETECTION: "system_profiler SPAirPortDataType",
        WIFI_INFO_COMMAND: "system_profiler SPAirPortDataType",
        SCHEDULER: "launchd",
      };
    case "windows":
      return {
        ...baseConfig,
        INTERFACE_DETECTION: "netsh interface show interface",
        WIFI_INFO_COMMAND: "netsh wlan show interfaces",
        SCHEDULER: "Task Scheduler",
      };
    case "ubuntu":
      return {
        ...baseConfig,
        INTERFACE_DETECTION: "ip route | grep default",
        WIFI_INFO_COMMAND: "iwconfig",
        SCHEDULER: "systemd",
      };
    default:
      return baseConfig;
  }
}

function getTimeLimit(range, now) {
  switch (range) {
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
