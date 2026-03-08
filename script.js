(function () {
  // ---------- SIDEBAR TOGGLE (original functionality) ----------
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  let overlay;

  function closeSidebar() {
    sidebar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      sidebar.classList.toggle("active");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "overlay";
        document.body.appendChild(overlay);
        overlay.addEventListener("click", closeSidebar);
      }
      overlay.classList.toggle("active");
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 769) closeSidebar();
  });

  // bts_solar:19.4, 87.92, 1265, 1684,49,28,8.9,0, 0, 0.2, 2.5, 6.8, 10.2, 12.4, 11.8, 9.5, 4.2, 1.1, 0.3,85, 25, 10,28050, 2450, 2780, 2620, 2850, 2410, 2310, 2680, 2740, 2590, 2420, 2380,45000, 49000, 55600, 52400, 57000, 48200, 46200, 53600, 54800, 51800, 48400,45600,1780, 1930, 2190, 2060, 2240, 1890, 1820, 2110, 2160, 2040, 1900, 1790,65.2, 72.8, 68.4, 71.5, 69.3, 74.1, 70.6, 68.9, 73.2, 71.8, 67.5, 70.2,72.4, 69.8, 71.1, 68.5, 70.9, 73.5, 71.3, 69.7, 72.1, 70.4, 68.2, 71.9,73.8, 70.5, 69.1, 72.6, 0, 0, 0,172.24.19.122,NUL,0,4.27,1,1,1

  // ---------- ALL EXISTING DATA (exactly as provided) ----------
  const powerMetricsData = [19.4, 87.92, 1265, 1684];
  const batteryVoltage = 49;
  const batteryTemp = 28;
  const batteryRemaining = 8.9;
  const powerGenerationData = [0, 0, 0.2, 2.5, 6.8, 10.2, 12.4, 11.8, 9.5, 4.2, 1.1, 0.3,];
  const energyDistributionData = [85, 25, 10];
  const monthlyEnergyData = [28050, 2450, 2780, 2620, 2850, 2410, 2310, 2680, 2740, 2590, 2420, 2380];
  const monthlyRevenueData = [45000, 49000, 55600, 52400, 57000, 48200, 46200, 53600, 54800, 51800, 48400,45600];
  const monthlyCarbonData = [1780, 1930, 2190, 2060, 2240, 1890, 1820, 2110, 2160, 2040, 1900, 1790];
  const dailyEnergyData = [65.2, 72.8, 68.4, 71.5, 69.3, 74.1, 70.6, 68.9, 73.2, 71.8, 67.5, 70.2,72.4, 69.8, 71.1, 68.5, 70.9, 73.5, 71.3, 69.7, 72.1, 70.4, 68.2, 71.9,73.8, 70.5, 69.1, 72.6, 0, 0, 0,];
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

  let powerChart, energyChart, monthlyBarChart, dailyLineChart;
  let currentChartType = "energy";

  function updateTodayDateDisplay() {
    const el = document.getElementById("todayDateDisplay");
    if (el)
      el.innerHTML = `<i class="fas fa-calendar-alt"></i> ${currentMonth} ${todayDay}, ${currentYear} (Today)`;
  }

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
    const statusEl = document.getElementById("battery-status");
    const voltage = batteryVoltage;
    const percentage = getBatteryPercentage(voltage);
    bar.style.width = `${percentage}%`;
    percEl.textContent = `${percentage}%`;
    voltEl.textContent = `${voltage.toFixed(1)}V`;
    tempEl.textContent = `${batteryTemp}°C`;
    timeEl.textContent = `${batteryRemaining}h`;
    if (percentage >= 80) bar.style.background = "#4ecdc4";
    // bar.style.background = "linear-gradient(90deg,#4ecdc4,#a0f0e0)";
    else if (percentage > 20) bar.style.background = "#ec9615";
    else bar.style.background = "#fc5c65";
  }

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
    updateTodayDateDisplay();
  }

  window.changeChartType = function (type) {
    document
      .querySelectorAll(".chart-btn")
      .forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".chart-btn").forEach((b) => {
      if (b.innerText.toLowerCase().includes(type)) b.classList.add("active");
    });
    let label, data, bg;
    if (type === "energy") {
      label = "Energy (kWh)";
      data = monthlyEnergyData;
      bg = "#4ecdc4";
    } else if (type === "revenue") {
      label = "Revenue (Tk)";
      data = monthlyRevenueData;
      bg = "#FFC107";
    } else {
      label = "Carbon (kg)";
      data = monthlyCarbonData;
      bg = "#2196F3";
    }
    monthlyBarChart.data.datasets[0].label = label;
    monthlyBarChart.data.datasets[0].data = data;
    monthlyBarChart.data.datasets[0].backgroundColor = bg;
    monthlyBarChart.update();
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

  function init() {
    // populate device mock & alerts
    document.getElementById("alert-list").innerHTML =
      "<li>High temperature (12:04)</li><li>Grid fluctuation</li><li>Battery reached 98%</li><li>Inverter warning</li>";
    document.getElementById("device-lan").innerText = ": 192.168.10.54";
    document.getElementById("gsm-operator").innerText = ": Banglalink";
    document.getElementById("gsm-signal").innerText = ": -67 dBm";
    document.getElementById("internal-battery").innerText = ": 3.7V";
    document.getElementById("device-psu1").innerText = ": OK";
    document.getElementById("device-psu2").innerText = ": Standby";
    document.getElementById("data-source").innerText = ": 4G Primary";

    initializeCharts();
    updateDateTime();
    updatePowerMetrics();
    updateBatteryData();
    setInterval(updateDateTime, 1000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
