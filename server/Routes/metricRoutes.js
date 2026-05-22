const express = require("express");
const router = express.Router();
const controller = require("../Controllers/metricControllers");

const { getMetrics, cpuAlerts, cpuCriticalAlerts ,anomaly} = controller;

router.get("/metrics", getMetrics);
router.get("/alerts/cpu", cpuAlerts);
router.get("/alerts/cpu/critical", cpuCriticalAlerts);
router.get("/anomaly", anomaly);

module.exports = router;


