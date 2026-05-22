const Metrics = require("../Models/metrics");

exports.detectAnomaly = (data) => {

  if (!data || data.length < 5) {
    return {
      anomalyDetection: {
        type: "Insufficient Data",
        severity: "Low Risk",
        message:
          "The monitoring engine is waiting for additional system metrics before performing anomaly analysis.",
        timestamp: new Date().toISOString(),
      },

      dataDogInsights: [
        "System monitoring has started successfully.",
        "Waiting for sufficient historical metrics to establish a performance baseline.",
        "Anomaly detection engine will activate automatically once enough system data is collected.",
      ],
    };
  }

  const latest = data[0];

  const finalResult = {
    dataDogInsights: [
      "CPU performance is operating within the expected threshold range.",
      "Memory utilization remains stable based on recent monitoring intervals.",
      "Network activity is currently operating under normal conditions.",
      "No abnormal upload traffic patterns detected.",
      "No unusual download traffic spikes observed.",
    ],

    anomalyDetection: {
      type: "System Stable",
      severity: "Low Risk",
      message:
        "System performance metrics are operating within the expected baseline thresholds.",
      timestamp: latest.timestamp,
    },
  };

  const totalRecords = data.length;

  /* =========================
     AVERAGES
  ========================= */

  const avgCpu =
    data.reduce((sum, item) => sum + Number(item.cpu || 0), 0) /
    totalRecords;

  const avgMemory =
    data.reduce(
      (sum, item) => sum + Number(item.usageMemory || 0),
      0
    ) / totalRecords;

  const avgUpload =
    data.reduce(
      (sum, item) => sum + Number(item.uploadSpeed || 0),
      0
    ) / totalRecords;

  const avgDownload =
    data.reduce(
      (sum, item) => sum + Number(item.downloadSpeed || 0),
      0
    ) / totalRecords;

  /* =========================
     DETECTION RULES
  ========================= */

  const cpuSpike = latest.cpu > avgCpu * 1.5;

  const memorySpike =
    latest.usageMemory > avgMemory * 1.4;

  const uploadSpike =
    latest.uploadSpeed > avgUpload * 2;

  const downloadSpike =
    latest.downloadSpeed > avgDownload * 2;

  /* =========================
     CPU SPIKE
  ========================= */

  if (cpuSpike) {

    finalResult.dataDogInsights[0] =
      `CPU utilization has increased by ${(
        latest.cpu - avgCpu
      ).toFixed(
        2
      )}% compared to the recent baseline average. The server is currently experiencing unusually high processor activity which may affect application response time and system stability.`;

    finalResult.anomalyDetection.type =
      "CPU Spike Detected";

    finalResult.anomalyDetection.severity =
      "High Risk";

    finalResult.anomalyDetection.message =
      `Abnormal CPU activity detected. Processor utilization increased from an average of ${avgCpu.toFixed(
        1
      )}% to ${latest.cpu
      }% within a short monitoring interval. This behavior may indicate resource-intensive background tasks, heavy request loads, or excessive process execution on the server.`;

    finalResult.anomalyDetection.timestamp =
      latest.timestamp;

  }

  /* =========================
     MEMORY SPIKE
  ========================= */

  else if (memorySpike) {
    finalResult.dataDogInsights[1] =
      `Memory consumption has exceeded the expected operating threshold by ${(
        latest.usageMemory - avgMemory
      ).toFixed(
        2
      )}%. Continuous high memory utilization may impact application responsiveness and increase the risk of memory saturation or leaks.`;

    finalResult.anomalyDetection.type =
      "Memory Usage Anomaly";

    finalResult.anomalyDetection.severity =
      "Moderate Risk";

    finalResult.anomalyDetection.message =
      `The monitoring engine detected abnormal memory usage patterns. System memory utilization increased from an average of ${avgMemory.toFixed(
        1
      )}% to ${latest.usageMemory
      }%, indicating possible inefficient resource allocation or elevated workload activity.`;

    finalResult.anomalyDetection.timestamp =
      latest.timestamp;

  }

  /* =========================
     UPLOAD SPIKE
  ========================= */

  else if (uploadSpike) {

    finalResult.dataDogInsights[2] =
      `Outbound network traffic has significantly increased compared to the established baseline average. The server is transmitting unusually large amounts of outgoing data which may indicate backup processes, file transfers, or excessive outbound requests.`;

    finalResult.anomalyDetection.type =
      "Upload Traffic Spike";

    finalResult.anomalyDetection.severity =
      "Medium Risk";

    finalResult.anomalyDetection.message =
      `A sudden increase in upload bandwidth activity has been detected. Current upload traffic reached ${latest.uploadSpeed
      } Mbps compared to the average upload rate of ${avgUpload.toFixed(
        2
      )} Mbps during recent monitoring intervals.`;

    finalResult.anomalyDetection.timestamp =
      latest.timestamp;

  }

  /* =========================
     DOWNLOAD SPIKE
  ========================= */

  else if (downloadSpike) {

    finalResult.dataDogInsights[3] =
      `Inbound network traffic is currently operating above the established baseline threshold. Increased download activity may be caused by high client traffic, bulk data transfers, or unusually large incoming requests.`;

    finalResult.anomalyDetection.type =
      "Download Traffic Spike";

    finalResult.anomalyDetection.severity =
      "Medium Risk";

    finalResult.anomalyDetection.message =
      `Unusual download bandwidth activity detected. Incoming network traffic increased from an average of ${avgDownload.toFixed(
        2
      )} Mbps to ${latest.downloadSpeed
      } Mbps within the active monitoring interval.`;

    finalResult.anomalyDetection.timestamp =
      latest.timestamp;

  }

  return finalResult;
};


/* =====================================
   FETCH DB DATA + RUN ANOMALY
===================================== */

exports.getAnomalyData = async () => {

  const data = await Metrics.find({})
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

  return exports.detectAnomaly(data);

};