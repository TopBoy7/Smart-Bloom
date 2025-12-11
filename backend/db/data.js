const data =   {
    alert: {
    summary: {
      critical: 1,
      warning: 2,
      info: 1,
      total: 4,
    },
    alerts: [
      {
        id: "1",
        type: "critical",
        title: "Low Soil Moisture",
        message: "Moisture level dropped to 18%. Immediate irrigation recommended.",
        timestamp: "2 minutes ago",
        icon: "moisture",
      },
      {
        id: "2",
        type: "warning",
        title: "High Temperature Detected",
        message: "Temperature reached 35°C. Increased evaporation expected.",
        timestamp: "15 minutes ago",
        icon: "temperature",
      },
      {
        id: "3",
        type: "info",
        title: "Irrigation Completed",
        message: "Scheduled 14:00 irrigation completed successfully (20 min).",
        timestamp: "1 hour ago",
        icon: "success",
      },
      {
        id: "4",
        type: "warning",
        title: "Sensor Communication Delay",
        message: "Sensor #2 response time increased. Check connection.",
        timestamp: "2 hours ago",
        icon: "sensor",
      },
    ] ,
    settings: {
      critical: {
        title: "Critical Alerts",
        description: "Moisture below 20%",
      },
      warning: {
        title: "Warning Alerts",
        description: "Moisture below 40%",
      },
      sensor: {
        title: "Sensor Offline",
        description: "No data for 5 minutes",
      },
    },
  },

  dashboard: {
    moisture: 45,
    temperature: 28,
    humidity: 62,
    windSpeed: 12,
    connected: true,
    lastUpdate: new Date().toLocaleTimeString(),
    isIrrigating: false,

    chartData: (() => {
  const data = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours() + ":00",
      moisture: Math.floor(35 + Math.random() * 20 + Math.sin(i / 4) * 10),
      temperature: Math.floor(22 + Math.random() * 8 + Math.cos(i / 3) * 3),
    });
  }

  return data;
})(),

    aiRecommendations: [
      {
        title: "Optimal Conditions",
        message: "Current moisture levels are ideal. No irrigation needed.",
        color: "success",
      },
      {
        title: "Next Watering",
        message: "Predicted in 6 hours based on current trend.",
        color: "info",
      },
    ],

    waterSavings: {
      week: 22,
      month: 18,
      totalLitersSaved: 450,
    },
  },

  reports: {
    header: {
      title: "Reports & Analytics",
      subtitle: "Water usage and efficiency metrics",
      exportLabel: "Export Report"
    },

    weeklyData: [
      { day: "Mon", water: 45, savings: 12 },
      { day: "Tue", water: 38, savings: 15 },
      { day: "Wed", water: 42, savings: 10 },
      { day: "Thu", water: 35, savings: 18 },
      { day: "Fri", water: 40, savings: 14 },
      { day: "Sat", water: 36, savings: 16 },
      { day: "Sun", water: 39, savings: 13 },
    ],

    topStats: {
      waterUsed: { amount: "275 L", change: "↓ 18% from last week" },
      totalSavings: { percent: "22%", litersSaved: "≈ 62 liters saved" },
      irrigationSessions: { count: "21", frequency: "3 per day average" }
    },

    monthlySummary: {
      totalUsed: "1,240 L",
      totalSaved: "280 L (18%)",
      avgMoisture: "48%",
      irrigationSessions: "92",
      aiOptimizations: "34",
      envImpactTrees: "14"
    },

    efficiencyMetrics: {
      uptime: 99.8,
      aiAccuracy: 94,
      sensorReliability: 97
    }
  },

  schedule: {
    page: {
      title: "Irrigation Schedule",
      subtitle: "AI-optimized watering times",
      addScheduleLabel: "Add Schedule",
    },

    aiForecast: {
      nextIrrigation: {
        time: "6:00 PM",
        inHours: "in 3 hours",
        duration: 15,
        moistureIncrease: "25%",
        confidence: "92%",
        analysis: "Based on 7-day pattern analysis",
      },
      optimalWindow: {
        range: "5:00 AM - 7:00 AM tomorrow",
        savings: "20% water savings",
      },
      model: {
        type: "Linear Regression",
        mae: "2.3%",
        accuracy: "94.7%",
      },
      buttonLabel: "Apply AI Recommendations",
    },

    todaySchedule: [
      { id: "1", time: "06:00", duration: 15, status: "completed", type: "auto" },
      { id: "2", time: "14:00", duration: 20, status: "active", type: "auto" },
      { id: "3", time: "18:00", duration: 15, status: "scheduled", type: "auto" },
    ],

    recurring: [
      { id: 1, name: "Morning Irrigation", time: "06:00", duration: 15, days: ["Mon", "Wed", "Fri"], active: true },
      { id: 2, name: "Evening Watering", time: "18:00", duration: 20, days: ["Tue", "Thu", "Sat"], active: true },
      { id: 3, name: "Weekend Deep Water", time: "07:00", duration: 30, days: ["Sun"], active: false },
    ],

    quickActions: {
      skipToday: "Skip Today",
      waterNow: "Water Now",
    },

    next24hours: {
      scheduled: "3 sessions",
      duration: "50 minutes",
      estimatedUse: "250 L",
    },

    thisWeek: {
      completed: "12 sessions",
      saved: "22%",
      efficiency: "96%",
    },
  },

  settings: {
    irrigation: {
      moistureThreshold: 40,
      defaultDuration: 15,
      autoSchedule: true,
      rainDetection: false,
      flowRate: 5.0,
    },

    notifications: {
      critical: true,
      warnings: true,
      dailySummary: false,
    },

    connection: {
      mqttBroker: "mqtt://localhost:1883",
      farmId: "farm1",
      sensorId: "sensor1",
      topic: "farm/farm1/sensor/sensor1/data",
      realtime: true,
    },

    dataManagement: {
      retentionDays: 30,
      sampleRate: 5,
      batchWrites: true,
    },

    systemInfo: {
      version: "1.0.0",
      lastSync: "2 minutes ago",
      deviceStatus: "Connected",
      backend: "Firestore + MQTT",
    },
  }
}


module.exports = data;