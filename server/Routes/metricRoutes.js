const express = require("express");
const router = express.Router();
const controller = require("../Controllers/metricControllers");

const { getMetrics, cpuAlerts, cpuCriticalAlerts } = controller;

router.get("/metrics", getMetrics);
router.get("/alerts/cpu", cpuAlerts);
router.get("/alerts/cpu/critical", cpuCriticalAlerts);

module.exports = router;
