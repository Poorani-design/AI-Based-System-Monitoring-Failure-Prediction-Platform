const mongoose = require("mongoose");

const MetricsSchema = new mongoose.Schema(
  {
    cpu: Number,
    totalMemory: Number,
    usedMemory: Number,
    freeMemory: Number,
    usageMemory: Number,
    downloadSpeed: Number,
    uploadSpeed: Number,
    timestamp: {
      type: Date,
      default: Date.now,
      index: { expires: 3600 }, // ⏱ 1 hour
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("Metrics", MetricsSchema);
