const Metrics = require("../Models/metrics");

//Last 1 hour ago
// “Give me all system metrics from the last 1 hour, ordered from oldest to newest”
exports.getMetrics = async (req, res) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const data = await Metrics.find({
    timestamp: { $gte: oneHourAgo },
  }).sort({ timestamp: 1 });
  res.json(data);
};

exports.cpuAlerts = async (req, res) => {
  const alerts = await Metrics.find({
    cpu: { $gt: 85 },
  })
    .sort({ timestamp: -1 })
    .limit(20);
  res.json(alerts);
};

exports.cpuCriticalAlerts = async (req, res) => {
  const critical = await Metrics.find({
    cpu: { $gt: 99 },
  })
    .sort({ timestamp: -1 })
    .limit(20);
  res.json(critical);
};
