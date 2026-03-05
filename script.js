(function () {
  // ---------- SIDEBAR TOGGLE FIX (mobile) ----------
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  let overlay;

  function closeSidebar() {
    sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      sidebar.classList.toggle('active');

      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);  // append to body for full coverage

        overlay.addEventListener('click', function () {
          closeSidebar();
        });
      }

      overlay.classList.toggle('active');
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 769) {
      closeSidebar();
    }
  });

  //89 data will come
  const powerMetricsData = [19.4, 87.92, 1265, 1684];
  const batteryVoltage = 49;
  const batteryTemp = 28;
  const batteryRemaining = 8.9;
  const powerGenerationData = [0, 0, 0.2, 2.5, 6.8, 10.2, 12.4, 11.8, 9.5, 4.2, 1.1, 0.3];
  const energyDistributionData = [85, 25, 10];
  const monthlyEnergyData = [28050, 2450, 2780, 2620, 2850, 2410, 2310, 2680, 2740, 2590, 2420, 2380];
  const monthlyRevenueData = [45000, 49000, 55600, 52400, 57000, 48200, 46200, 53600, 54800, 51800, 48400, 45600];
  const monthlyCarbonData = [1780, 1930, 2190, 2060, 2240, 1890, 1820, 2110, 2160, 2040, 1900, 1790];
  const dailyEnergyData = [65.2, 72.8, 68.4, 71.5, 69.3, 74.1, 70.6, 68.9, 73.2, 71.8, 67.5, 70.2, 72.4, 69.8, 71.1, 68.5, 70.9, 73.5, 71.3, 69.7, 72.1, 70.4, 68.2, 71.9, 73.8, 70.5, 69.1, 72.6, 0, 0, 0];
  
  // Day labels for the month (1-31)
  const dayLabels = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);

  let powerChart, energyChart, monthlyBarChart, dailyLineChart;
  let currentChartType = 'energy';

  // Get today's date and day of month
  const today = new Date();
  const todayDay = today.getDate(); // Returns 1-31
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  // Update the date display in the chart title
  function updateTodayDateDisplay() {
    const dateDisplay = document.getElementById('todayDateDisplay');
    if (dateDisplay) {
      dateDisplay.innerHTML = `<i class="fas fa-calendar-alt" style="margin-right: 5px;"></i>${currentMonth} ${todayDay}, ${currentYear} (Today)`;
    }
  }

  // update functions
  function updatePowerMetrics() {
    document.getElementById('current-power').textContent = `${powerMetricsData[0].toFixed(1)} kW`;
    document.getElementById('today-energy').textContent = `${powerMetricsData[1].toFixed(1)} kWh`;
    document.getElementById('carbon-reduction').textContent = `${powerMetricsData[2].toLocaleString()} kg`;
    document.getElementById('today-revenue').textContent = `${powerMetricsData[3].toLocaleString()} ৳`;
  }

  function getBatteryPercentage(voltage) {
    let percentage = ((4.5-(49.5-voltage)) / 4.5) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    return percentage.toFixed(0); 
  }


  function updateBatteryData() {
    const batteryLevelBar = document.getElementById('battery-level-bar');
    const batteryPercentageEl = document.getElementById('battery-percentage');
    const batteryVoltageEl = document.getElementById('battery-voltage');
    const batteryTempEl = document.getElementById('battery-temp');
    const batteryTimeEl = document.getElementById('battery-time');
    const batteryStatusEl = document.getElementById('battery-status');

    const voltage = batteryVoltage;
    const percentage = getBatteryPercentage(voltage);  
    const displayPercent = percentage;

    batteryLevelBar.style.width = `${displayPercent}%`;
    batteryPercentageEl.textContent = `${displayPercent}%`;
    batteryVoltageEl.textContent = `${voltage.toFixed(1)}V`;
    batteryTempEl.textContent = `${batteryTemp}°C`;
    batteryTimeEl.textContent = `${batteryRemaining}h`;

    // remove old classes, add status based on percentage
    batteryStatusEl.className = 'battery-status';
    if (percentage >= 80) {
      batteryLevelBar.style.background = '#4ecdc4';
      batteryStatusEl.classList.add('battery-high');
    } else if (percentage > 20 && percentage < 80) {
      batteryLevelBar.style.background = '#ec9615';
      batteryStatusEl.classList.add('battery-medium');
    } else {
      batteryLevelBar.style.background = '#fc5c65';
      batteryStatusEl.classList.add('battery-low');
    }
  }

  function initializeCharts() {
    const powerCtx = document.getElementById('powerChart').getContext('2d');
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    const dailyLineCtx = document.getElementById('dailyLineChart').getContext('2d');
    const monthlyBarCtx = document.getElementById('monthlyBarChart').getContext('2d');

    const hourLabels = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    powerChart = new Chart(powerCtx, {
      type: 'line',
      data: {
        labels: hourLabels,
        datasets: [{
          label: 'Power Generation (kW)',
          data: powerGenerationData,
          borderColor: '#FFC107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f0f0f0' } }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#b0b0b0' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#b0b0b0' },
            beginAtZero: true,
            max: 15
          }
        }
      }
    });

    energyChart = new Chart(energyCtx, {
      type: 'doughnut',
      data: {
        labels: ['Self Consumption', 'Grid Feed-in', 'Battery Storage'],
        datasets: [{
          data: energyDistributionData,
          backgroundColor: ['#4ecdc4', '#2196F3', '#FF9800'],
          borderColor: '#1e2b38',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#f0f0f0', padding: 20 }
          }
        }
      }
    });

    // New Daily Line Chart with highlighted current day
    const pointBackgroundColors = Array(31).fill('#4ecdc4');
    const pointBorderColors = Array(31).fill('#4ecdc4');
    const pointRadius = Array(31).fill(3);
    const pointHoverRadius = Array(31).fill(5);
    
    // Highlight today's point (index is todayDay - 1)
    if (todayDay >= 1 && todayDay <= 31) {
      pointBackgroundColors[todayDay - 1] = '#FFC107'; // Yellow color for today
      pointBorderColors[todayDay - 1] = '#FFC107';
      pointRadius[todayDay - 1] = 8; // Larger point for today
      pointHoverRadius[todayDay - 1] = 10;
    }

    dailyLineChart = new Chart(dailyLineCtx, {
      type: 'line',
      data: {
        labels: dayLabels,
        datasets: [{
          label: 'Daily Energy (kWh)',
          data: dailyEnergyData,
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.2,
          pointBackgroundColor: pointBackgroundColors,
          pointBorderColor: pointBorderColors,
          pointRadius: pointRadius,
          pointHoverRadius: pointHoverRadius,
          pointStyle: 'circle'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            labels: { color: '#f0f0f0' },
            onClick: null // Disable legend click
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y.toFixed(1) + ' kWh';
                
                // Add "Today" indicator to tooltip
                if (context.dataIndex === todayDay - 1) {
                  label += ' (Today)';
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { 
              color: function(context) {
                // Highlight today's label in yellow
                if (context.index === todayDay - 1) {
                  return '#FFC107';
                }
                return '#b0b0b0';
              },
              maxRotation: 45, 
              minRotation: 45,
              font: function(context) {
                // Make today's label bold
                if (context.index === todayDay - 1) {
                  return {
                    weight: 'bold',
                    size: 12
                  };
                }
                return {
                  weight: 'normal',
                  size: 11
                };
              }
            }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#b0b0b0' },
            beginAtZero: true,
            title: {
              display: true,
              text: 'Energy (kWh)',
              color: '#b0b0b0'
            }
          }
        }
      }
    });

    monthlyBarChart = new Chart(monthlyBarCtx, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Energy (kWh)',
          data: monthlyEnergyData,
          backgroundColor: '#4ecdc4',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f0f0f0' } }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#b0b0b0' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#b0b0b0' },
            beginAtZero: true
          }
        }
      }
    });

    // Update the date display
    updateTodayDateDisplay();
  }

  window.changeChartType = function (type) {
    currentChartType = type;
    // update active button
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    // find which button called? we can use event, but easier: mark based on type
    const buttons = document.querySelectorAll('.chart-btn');
    buttons.forEach(btn => {
      if (btn.textContent.toLowerCase().includes(type) ||
        (type === 'energy' && btn.textContent.includes('Energy')) ||
        (type === 'revenue' && btn.textContent.includes('Revenue')) ||
        (type === 'carbon' && btn.textContent.includes('Carbon'))) {
        btn.classList.add('active');
      }
    });

    let label = '';
    let data = [];
    let backgroundColor = '';

    if (type === 'energy') {
      label = 'Energy (kWh)';
      data = monthlyEnergyData;
      backgroundColor = '#4ecdc4';
    } else if (type === 'revenue') {
      label = 'Revenue (Tk)';
      data = monthlyRevenueData;
      backgroundColor = 'rgba(255, 193, 7, 0.7)';
    } else {
      label = 'Carbon Reduction (kg)';
      data = monthlyCarbonData;
      backgroundColor = 'rgba(33, 150, 243, 0.7)';
    }

    monthlyBarChart.data.datasets[0].label = label;
    monthlyBarChart.data.datasets[0].data = data;
    monthlyBarChart.data.datasets[0].backgroundColor = backgroundColor;
    monthlyBarChart.update();
  };

  function updateDateTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeEl = document.getElementById('lastUpdateTime');
    const dateEl = document.getElementById('lastUpdateDate');
    if (timeEl) timeEl.textContent = formattedTime;
    if (dateEl) dateEl.textContent = formattedDate;
  }

  function init() {
    initializeCharts();
    updateDateTime();
    updatePowerMetrics();
    updateBatteryData();  
    setInterval(updateDateTime, 1000);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

 // const dailyRevenueData = [1304, 1456, 1368, 1430, 1386, 1482, 1412, 1378, 1464, 1436, 1350, 1404, 1448, 1396, 1422, 1370, 1418, 1470, 1426, 1394, 1442, 1408, 1364, 1438, 1476, 1410, 1382, 1452, 1428, 1416, 1398];
  // const dailyCarbonData = [13.0, 14.6, 13.7, 14.3, 13.9, 14.8, 14.1, 13.8, 14.6, 14.4, 13.5, 14.0, 14.5, 14.0, 14.2, 13.7, 14.2, 14.7, 14.3, 13.9, 14.4, 14.1, 13.6, 14.4, 14.8, 14.1, 13.8, 14.5, 14.3, 14.2, 14.0];