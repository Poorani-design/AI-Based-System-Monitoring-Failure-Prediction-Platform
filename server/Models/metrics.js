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
    machineId: String,
    isAnomaly: Boolean,

    timestamp: {
      type: Date,
      default: Date.now,
      index: { expires: 7200 }, //  1+1 hour
    },
  },
  { versionKey: false },
);
MetricsSchema.index({ timestamp: -1 });
module.exports = mongoose.model("Metrics", MetricsSchema);
