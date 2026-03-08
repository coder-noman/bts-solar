// declare all data start
let powerMetricsData = [19.4, 87.92, 1265, 1684];
let batteryVoltage = 49;
let batteryTemp = 28;
let batteryRemaining = 8.9;
let powerGenerationData = [
  0, 0, 0.2, 2.5, 6.8, 10.2, 12.4, 11.8, 9.5, 4.2, 1.1, 0.3,
];
let energyDistributionData = [85, 25, 10];
let monthlyEnergyData = [
  28050, 2450, 2780, 2620, 2850, 2410, 2310, 2680, 2740, 2590, 2420, 2380,
];
let monthlyRevenueData = [
  45000, 49000, 55600, 52400, 57000, 48200, 46200, 53600, 54800, 51800, 48400,
  45600,
];
let monthlyCarbonData = [
  1780, 1930, 2190, 2060, 2240, 1890, 1820, 2110, 2160, 2040, 1900, 1790,
];
let dailyEnergyData = [
  65.2, 72.8, 68.4, 71.5, 69.3, 74.1, 70.6, 68.9, 73.2, 71.8, 67.5, 70.2, 72.4,
  69.8, 71.1, 68.5, 70.9, 73.5, 71.3, 69.7, 72.1, 70.4, 68.2, 71.9, 73.8, 70.5,
  69.1, 72.6, 0, 0, 0,
];
const dayLabels = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);

const today = new Date();
const todayDay = today.getDate();
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentMonth = monthNames[today.getMonth()];
const currentYear = today.getFullYear();

let powerChart, energyChart, dailyLineChart, monthlyBarChart;
// declare all data end

// ---------------- WebSocket ----------------
var socket = new WebSocket("ws://27.147.170.162:81");
socket.onmessage = function (event) {
  const [data_catagory, msg] = event.data.split(":");
  if (data_catagory != "bts_solar") return;

   const d = msg.split(",").map((v) => {
    const n = Number(v);
    return isNaN(n) ? v.trim() : n;
  });
  console.log(d);

  // Update all arrays and values directly
  powerMetricsData = [d[0], d[1], d[2], d[3]];
  batteryVoltage = d[4];
  batteryTemp = d[5];
  batteryRemaining = d[6];
  powerGenerationData = d.slice(7, 19);
  energyDistributionData = d.slice(19, 22);
  monthlyEnergyData = d.slice(22, 34);
  monthlyRevenueData = d.slice(34, 46);
  monthlyCarbonData = d.slice(46, 58);
  dailyEnergyData = d.slice(58, 89);

  // Update components
  updatePowerMetrics();
  updateBatteryData();
  updateCharts(
    powerGenerationData,
    energyDistributionData,
    dailyEnergyData,
    monthlyEnergyData,
    monthlyRevenueData,
    monthlyCarbonData,
  );
  deviceInformation(
      d[89],
      d[90],
      d[91],
      d[92],
      d[93],
      d[94],
      d[95]
    );
};
// ---------------- WebSocket end ----------------

// ---------------- Update Functions ----------------
function updatePowerMetrics() {
  document.getElementById("current-power").textContent =
    `${powerMetricsData[0].toFixed(1)} kW`;
  document.getElementById("today-energy").textContent =
    `${powerMetricsData[1].toFixed(1)} kWh`;
  document.getElementById("carbon-reduction").textContent =
    `${powerMetricsData[2].toLocaleString()} kg`;
  document.getElementById("today-revenue").textContent =
    `${powerMetricsData[3].toLocaleString()} ৳`;
}

function getBatteryPercentage(voltage) {
  let percentage = ((4.5 - (49.5 - voltage)) / 4.5) * 100;
  percentage = Math.max(0, Math.min(100, percentage));
  return percentage.toFixed(0);
}

function updateBatteryData() {
  const bar = document.getElementById("battery-level-bar");
  const percEl = document.getElementById("battery-percentage");
  const voltEl = document.getElementById("battery-voltage");
  const tempEl = document.getElementById("battery-temp");
  const timeEl = document.getElementById("battery-time");

  const percentage = getBatteryPercentage(batteryVoltage);
  bar.style.width = `${percentage}%`;
  percEl.textContent = `${percentage}%`;
  voltEl.textContent = `${batteryVoltage.toFixed(1)}V`;
  tempEl.textContent = `${batteryTemp}°C`;
  timeEl.textContent = `${batteryRemaining}h`;
  if (percentage >= 80) bar.style.background = "#4ecdc4";
  else if (percentage > 20) bar.style.background = "#ec9615";
  else bar.style.background = "#fc5c65";
}

// Chart update function (pass arrays only)
function updateCharts(
  powerData,
  energyDistData,
  dailyData,
  monthlyEnergy,
  monthlyRevenue,
  monthlyCarbon,
) {
  if (powerChart) {
    powerChart.data.datasets[0].data = powerData;
    powerChart.update();
  }

  if (energyChart) {
    energyChart.data.datasets[0].data = energyDistData;
    energyChart.update();
  }

  if (dailyLineChart) {
    dailyLineChart.data.datasets[0].data = dailyData;
    dailyLineChart.update();
  }

  if (monthlyBarChart) {
    const activeBtn =
      document.querySelector(".chart-btn.active") ||
      document.querySelector(".chart-btn");
    const type = activeBtn?.innerText.toLowerCase() || "energy";
    let label, data, bg;

    if (type.includes("energy")) {
      label = "Energy (kWh)";
      data = monthlyEnergy;
      bg = "#4ecdc4";
    } else if (type.includes("revenue")) {
      label = "Revenue (Tk)";
      data = monthlyRevenue;
      bg = "#FFC107";
    } else {
      label = "Carbon (kg)";
      data = monthlyCarbon;
      bg = "#2196F3";
    }

    monthlyBarChart.data.datasets[0].label = label;
    monthlyBarChart.data.datasets[0].data = data;
    monthlyBarChart.data.datasets[0].backgroundColor = bg;
    monthlyBarChart.update();

    // --- Update button colors dynamically ---
    const buttons = document.querySelectorAll(".chart-btn");
    buttons.forEach((b) => {
      if (b === activeBtn) {
        b.style.backgroundColor = bg;
        b.style.color = "black";
      } else {
        b.style.backgroundColor = "#1c3a4c";
        b.style.color = "white";
      }
    });
  }
}
// ---------------- Update Functions end ----------------
// ---------------- devive inforemation start ----------------
function deviceInformation(lan, gsmOp, gsmSig, ib, psu1, psu2, ds) {
  console.log(lan, gsmOp, gsmSig, ib, psu1, psu2, ds);
  const lanIp = document.getElementById("device-lan");
  const gsmOperator = document.getElementById("gsm-operator");
  const gsmSignal = document.getElementById("gsm-signal");
  const internalBattery = document.getElementById("internal-battery");
  const devicePsu1 = document.getElementById("device-psu1");
  const devicePsu2 = document.getElementById("device-psu2");
  const dataSource = document.getElementById("data-source");

  lanIp.innerHTML = `: ${lan}`;

  gsmOperator.innerText = `: ${gsmOp}`;

  gsmSignal.innerText = `: ${gsmSig} %`;

  internalBattery.innerText = `: ${ib} V`;

  if (psu1 == 1) {
    devicePsu1.innerText = `: OK`;
  } else {
    devicePsu1.innerText = `: Failed`;
  }

  if (psu2 == 1) {
    devicePsu2.innerText = `: OK`;
  } else {
    devicePsu2.innerText = `: Failed`;
  }

  if (ds == 0) {
    dataSource.innerText = `: LAN`;
  } else if (ds == 1) {
    dataSource.innerText = `: WIFI`;
  } else if (ds == 2) {
    dataSource.innerText = `: GPRS`;
  }
}
// ---------------- devive inforemation end ----------------

// ---------------- Chart Initialization ----------------
function initializeCharts() {
  const hourLabels = [
    "12 AM",
    "2 AM",
    "4 AM",
    "6 AM",
    "8 AM",
    "10 AM",
    "12 PM",
    "2 PM",
    "4 PM",
    "6 PM",
    "8 PM",
    "10 PM",
  ];
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  powerChart = new Chart(document.getElementById("powerChart"), {
    type: "line",
    data: {
      labels: hourLabels,
      datasets: [
        {
          label: "Power Generation (kW)",
          data: powerGenerationData,
          borderColor: "#FFC107",
          backgroundColor: "rgba(255,193,7,0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#f0f0f0" } } },
      scales: {
        x: { grid: { color: "#2d4b63" }, ticks: { color: "#b0d0e8" } },
        y: {
          grid: { color: "#2d4b63" },
          ticks: { color: "#b0d0e8" },
          beginAtZero: true,
          max: 15,
        },
      },
    },
  });

  energyChart = new Chart(document.getElementById("energyChart"), {
    type: "doughnut",
    data: {
      labels: ["Self Consumption", "Grid Feed-in", "Battery Storage"],
      datasets: [
        {
          data: energyDistributionData,
          backgroundColor: ["#4ecdc4", "#2196F3", "#FF9800"],
          borderColor: "#1e2b38",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#e0f0fa", padding: 20 },
        },
      },
    },
  });

  const pointBg = Array(31).fill("#4ecdc4");
  const pointBorder = Array(31).fill("#4ecdc4");
  const pointR = Array(31).fill(4);
  if (todayDay >= 1 && todayDay <= 31) {
    pointBg[todayDay - 1] = "#FFC107";
    pointBorder[todayDay - 1] = "#FFC107";
    pointR[todayDay - 1] = 10;
  }

  dailyLineChart = new Chart(document.getElementById("dailyLineChart"), {
    type: "line",
    data: {
      labels: dayLabels,
      datasets: [
        {
          label: "Daily Energy (kWh)",
          data: dailyEnergyData,
          borderColor: "#4ecdc4",
          backgroundColor: "rgba(78,205,196,0.1)",
          borderWidth: 3,
          fill: true,
          pointBackgroundColor: pointBg,
          pointBorderColor: pointBorder,
          pointRadius: pointR,
          pointHoverRadius: 9,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#f0f0f0" } },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ctx.parsed.y.toFixed(1) +
              " kWh" +
              (ctx.dataIndex === todayDay - 1 ? " (Today)" : ""),
          },
        },
      },
      scales: {
        x: {
          grid: { color: "#2d4b63" },
          ticks: {
            color: (ctx) =>
              ctx.index === todayDay - 1 ? "#FFC107" : "#b0d0e8",
          },
        },
        y: { grid: { color: "#2d4b63" }, ticks: { color: "#b0d0e8" } },
      },
    },
  });

  monthlyBarChart = new Chart(document.getElementById("monthlyBarChart"), {
    type: "bar",
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: "Energy (kWh)",
          data: monthlyEnergyData,
          backgroundColor: "#4ecdc4",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#f0f0f0" } } },
      scales: {
        x: { grid: { color: "#2d4b63" }, ticks: { color: "#b0d0e8" } },
        y: { grid: { color: "#2d4b63" }, ticks: { color: "#b0d0e8" } },
      },
    },
  });
}
// ---------------- Chart Initialization end ----------------

// ---------------- Other Functions ----------------
function updateTodayDateDisplay() {
  const el = document.getElementById("todayDateDisplay");
  if (el)
    el.innerHTML = `<i class="fas fa-calendar-alt"></i> ${currentMonth} ${todayDay}, ${currentYear} (Today)`;
}

window.changeChartType = function (type) {
  document
    .querySelectorAll(".chart-btn")
    .forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".chart-btn").forEach((b) => {
    if (b.innerText.toLowerCase().includes(type)) b.classList.add("active");
  });
  updateCharts(
    powerGenerationData,
    energyDistributionData,
    dailyEnergyData,
    monthlyEnergyData,
    monthlyRevenueData,
    monthlyCarbonData,
  );
};

function updateDateTime() {
  const now = new Date();
  document.getElementById("lastUpdateTime").textContent =
    now.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  document.getElementById("lastUpdateDate").textContent =
    now.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
}

// ----- SIDEBAR TOGGLE FIX (menu button) -----
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // close sidebar on window resize above 768px
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 769) {
      sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }
  });

  // rest of init
  initializeCharts();
  updateTodayDateDisplay();
  updateDateTime();
  updatePowerMetrics();
  updateBatteryData();
  setInterval(updateDateTime, 1000);
});
// // Power metrics: [current power, today's energy, carbon reduction, today's revenue]
// const powerMetricsData = [12.4, 84.2, 1265, 1684];

// // Battery data: [percentage, voltage, temperature, remaining time]
// const batteryData = [80, 51.2, 28, 8.5];

// // Hourly power generation data for last 24 hours
// const powerGenerationData = [0, 0, 0.2, 2.5, 6.8, 10.2, 12.4, 11.8, 9.5, 4.2, 1.1, 0.3];

// // Energy distribution percentages: [self consumption, grid feed-in, battery storage]
// const energyDistributionData = [65, 25, 10];

// // Monthly energy data for the year
// const monthlyEnergyData = [2250, 2450, 2780, 2620, 2850, 2410, 2310, 2680, 2740, 2590, 2420, 2280];

// // Monthly revenue data for the year
// const monthlyRevenueData = [45000, 49000, 55600, 52400, 57000, 48200, 46200, 53600, 54800, 51800, 48400, 45600];

// // Monthly carbon reduction data for the year
// const monthlyCarbonData = [1780, 1930, 2190, 2060, 2240, 1890, 1820, 2110, 2160, 2040, 1900, 1790];

// // Chart variables
// let powerChart, energyChart, monthlyBarChart;
// let currentChartType = 'energy';

// // Function to update power metrics display
// function updatePowerMetrics() {
//     document.getElementById('current-power').textContent = `${powerMetricsData[0].toFixed(1)} kW`;
//     document.getElementById('today-energy').textContent = `${powerMetricsData[1].toFixed(1)} kWh`;
//     document.getElementById('carbon-reduction').textContent = `${powerMetricsData[2].toLocaleString()} kg`;
//     document.getElementById('today-revenue').textContent = `${powerMetricsData[3].toLocaleString()} ৳`;
// }

// // Function to update battery data
// function updateBatteryData() {
//     const batteryLevelBar = document.getElementById('battery-level-bar');
//     const batteryPercentageEl = document.getElementById('battery-percentage');
//     const batteryVoltageEl = document.getElementById('battery-voltage');
//     const batteryTempEl = document.getElementById('battery-temp');
//     const batteryTimeEl = document.getElementById('battery-time');
//     const batteryStatusEl = document.getElementById('battery-status');
//     const batteryStatusText = document.getElementById('battery-status-text');

//     const [percentage, voltage, temperature, remainingTime] = batteryData;

//     batteryLevelBar.style.width = `${percentage}%`;
//     batteryPercentageEl.textContent = `${percentage}%`;
//     batteryVoltageEl.textContent = `${voltage.toFixed(1)}V`;
//     batteryTempEl.textContent = `${temperature}°C`;
//     batteryTimeEl.textContent = `${remainingTime}h`;

//     batteryStatusEl.className = 'battery-status';

//     if (percentage >= 80) {
//         batteryLevelBar.style.background = '#4ecdc4';
//         batteryStatusEl.classList.add('battery-high');
//         batteryStatusText.textContent = "Optimal";
//         batteryStatusText.style.color = '#4ecdc4';
//     } else if (percentage > 20 && percentage < 80) {
//         batteryLevelBar.style.background = '#ec9615';
//         batteryStatusEl.classList.add('battery-medium');
//         batteryStatusText.textContent = "Normal";
//         batteryStatusText.style.color = '#ec9615';
//     } else {
//         batteryLevelBar.style.background = '#fc5c65';
//         batteryStatusEl.classList.add('battery-low');
//         batteryStatusText.textContent = "Low";
//         batteryStatusText.style.color = '#fc5c65';
//     }

//     if (percentage > 90) {
//         batteryStatusText.textContent = "Full";
//     } else if (percentage > 50) {
//         batteryStatusText.textContent = "Charging";
//     }
// }

// // Function to initialize all charts
// function initializeCharts() {
//     const powerCtx = document.getElementById('powerChart').getContext('2d');
//     const energyCtx = document.getElementById('energyChart').getContext('2d');
//     const monthlyBarCtx = document.getElementById('monthlyBarChart').getContext('2d');

//     const hourLabels = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];
//     const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//     // Power generation line chart
//     powerChart = new Chart(powerCtx, {
//         type: 'line',
//         data: {
//             labels: hourLabels,
//             datasets: [{
//                 label: 'Power Generation (kW)',
//                 data: powerGenerationData,
//                 borderColor: '#FFC107',
//                 backgroundColor: 'rgba(255, 193, 7, 0.1)',
//                 borderWidth: 3,
//                 fill: true,
//                 tension: 0.4
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: { labels: { color: '#f0f0f0' } }
//             },
//             scales: {
//                 x: {
//                     grid: { color: 'rgba(255, 255, 255, 0.1)' },
//                     ticks: { color: '#b0b0b0' }
//                 },
//                 y: {
//                     grid: { color: 'rgba(255, 255, 255, 0.1)' },
//                     ticks: { color: '#b0b0b0' },
//                     beginAtZero: true,
//                     max: 15
//                 }
//             }
//         }
//     });

//     // Energy distribution doughnut chart
//     energyChart = new Chart(energyCtx, {
//         type: 'doughnut',
//         data: {
//             labels: ['Self Consumption', 'Grid Feed-in', 'Battery Storage'],
//             datasets: [{
//                 data: energyDistributionData,
//                 backgroundColor: ['#4ecdc4', '#2196F3', '#FF9800'],
//                 borderColor: '#1e2b38',
//                 borderWidth: 2
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     position: 'bottom',
//                     labels: { color: '#f0f0f0', padding: 20 }
//                 }
//             }
//         }
//     });

//     // Monthly bar chart
//     monthlyBarChart = new Chart(monthlyBarCtx, {
//         type: 'bar',
//         data: {
//             labels: monthLabels,
//             datasets: [{
//                 label: 'Energy (kWh)',
//                 data: monthlyEnergyData,
//                 backgroundColor: '#4ecdc4',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { labels: { color: '#f0f0f0' } } },
//             scales: {
//                 x: {
//                     grid: { color: 'rgba(255, 255, 255, 0.1)' },
//                     ticks: { color: '#b0b0b0' }
//                 },
//                 y: {
//                     grid: { color: 'rgba(255, 255, 255, 0.1)' },
//                     ticks: { color: '#b0b0b0' },
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

// // Function to change chart type for monthly data
// function changeChartType(type) {
//     currentChartType = type;

//     document.querySelectorAll('.chart-btn').forEach(btn => {
//         btn.classList.remove('active');
//     });
//     event.target.classList.add('active');

//     let label = '';
//     let data = [];
//     let backgroundColor = '';

//     if (type === 'energy') {
//         label = 'Energy (kWh)';
//         data = monthlyEnergyData;
//         backgroundColor = '#4ecdc4';
//     } else if (type === 'revenue') {
//         label = 'Revenue (৳)';
//         data = monthlyRevenueData;
//         backgroundColor = 'rgba(255, 193, 7, 0.7)';
//     } else {
//         label = 'Carbon Reduction (kg)';
//         data = monthlyCarbonData;
//         backgroundColor = 'rgba(33, 150, 243, 0.7)';
//     }

//     monthlyBarChart.data.datasets[0].label = label;
//     monthlyBarChart.data.datasets[0].data = data;
//     monthlyBarChart.data.datasets[0].backgroundColor = backgroundColor;
//     monthlyBarChart.update();
// }

// // Function to update date and time display
// function updateDateTime() {
//     const now = new Date();
//     const formattedTime = now.toLocaleTimeString('en-US', {
//         hour12: true,
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     });
//     const formattedDate = now.toLocaleDateString('en-US', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });

//     document.getElementById('last-updated').textContent = `${formattedDate} ${formattedTime}`;
// }

// // Function to update all dashboard sections
// function updateAllSections() {
//     updateDateTime();
//     updatePowerMetrics();
//     updateBatteryData();
// }

// // Main initialization function
// function init() {
//     initializeCharts();
//     updateAllSections();
//     setInterval(updateDateTime, 1000);
//     setInterval(updateAllSections, 10000);

//     // Removed click event listener for cards since hover effect is removed
// }

// document.addEventListener('DOMContentLoaded', init);