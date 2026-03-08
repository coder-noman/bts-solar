// Power metrics: [current power, today's energy, carbon reduction, today's revenue]
const powerMetricsData = [12.4, 84.2, 1265, 1684];

// Battery data: [percentage, voltage, temperature, remaining time]
const batteryData = [80, 51.2, 28, 8.5];

// Hourly power generation data for last 24 hours
const powerGenerationData = [0, 0, 0.2, 2.5, 6.8, 10.2, 12.4, 11.8, 9.5, 4.2, 1.1, 0.3];

// Energy distribution percentages: [self consumption, grid feed-in, battery storage]
const energyDistributionData = [65, 25, 10];

// Monthly energy data for the year
const monthlyEnergyData = [2250, 2450, 2780, 2620, 2850, 2410, 2310, 2680, 2740, 2590, 2420, 2280];

// Monthly revenue data for the year
const monthlyRevenueData = [45000, 49000, 55600, 52400, 57000, 48200, 46200, 53600, 54800, 51800, 48400, 45600];

// Monthly carbon reduction data for the year
const monthlyCarbonData = [1780, 1930, 2190, 2060, 2240, 1890, 1820, 2110, 2160, 2040, 1900, 1790];

// Chart variables
let powerChart, energyChart, monthlyBarChart;
let currentChartType = 'energy';

// Function to update power metrics display
function updatePowerMetrics() {
    document.getElementById('current-power').textContent = `${powerMetricsData[0].toFixed(1)} kW`;
    document.getElementById('today-energy').textContent = `${powerMetricsData[1].toFixed(1)} kWh`;
    document.getElementById('carbon-reduction').textContent = `${powerMetricsData[2].toLocaleString()} kg`;
    document.getElementById('today-revenue').textContent = `${powerMetricsData[3].toLocaleString()} ৳`;
}

// Function to update battery data
function updateBatteryData() {
    const batteryLevelBar = document.getElementById('battery-level-bar');
    const batteryPercentageEl = document.getElementById('battery-percentage');
    const batteryVoltageEl = document.getElementById('battery-voltage');
    const batteryTempEl = document.getElementById('battery-temp');
    const batteryTimeEl = document.getElementById('battery-time');
    const batteryStatusEl = document.getElementById('battery-status');
    const batteryStatusText = document.getElementById('battery-status-text');

    const [percentage, voltage, temperature, remainingTime] = batteryData;

    batteryLevelBar.style.width = `${percentage}%`;
    batteryPercentageEl.textContent = `${percentage}%`;
    batteryVoltageEl.textContent = `${voltage.toFixed(1)}V`;
    batteryTempEl.textContent = `${temperature}°C`;
    batteryTimeEl.textContent = `${remainingTime}h`;

    batteryStatusEl.className = 'battery-status';

    if (percentage >= 80) {
        batteryLevelBar.style.background = '#4ecdc4';
        batteryStatusEl.classList.add('battery-high');
        batteryStatusText.textContent = "Optimal";
        batteryStatusText.style.color = '#4ecdc4';
    } else if (percentage > 20 && percentage < 80) {
        batteryLevelBar.style.background = '#ec9615';
        batteryStatusEl.classList.add('battery-medium');
        batteryStatusText.textContent = "Normal";
        batteryStatusText.style.color = '#ec9615';
    } else {
        batteryLevelBar.style.background = '#fc5c65';
        batteryStatusEl.classList.add('battery-low');
        batteryStatusText.textContent = "Low";
        batteryStatusText.style.color = '#fc5c65';
    }

    if (percentage > 90) {
        batteryStatusText.textContent = "Full";
    } else if (percentage > 50) {
        batteryStatusText.textContent = "Charging";
    }
}

// Function to initialize all charts
function initializeCharts() {
    const powerCtx = document.getElementById('powerChart').getContext('2d');
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    const monthlyBarCtx = document.getElementById('monthlyBarChart').getContext('2d');

    const hourLabels = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Power generation line chart
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

    // Energy distribution doughnut chart
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

    // Monthly bar chart
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
            plugins: { legend: { labels: { color: '#f0f0f0' } } },
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
}

// Function to change chart type for monthly data
function changeChartType(type) {
    currentChartType = type;

    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    let label = '';
    let data = [];
    let backgroundColor = '';

    if (type === 'energy') {
        label = 'Energy (kWh)';
        data = monthlyEnergyData;
        backgroundColor = '#4ecdc4';
    } else if (type === 'revenue') {
        label = 'Revenue (৳)';
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
}

// Function to update date and time display
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

    document.getElementById('last-updated').textContent = `${formattedDate} ${formattedTime}`;
}

// Function to update all dashboard sections
function updateAllSections() {
    updateDateTime();
    updatePowerMetrics();
    updateBatteryData();
}

// Main initialization function
function init() {
    initializeCharts();
    updateAllSections();
    setInterval(updateDateTime, 1000);
    setInterval(updateAllSections, 10000);

    // Removed click event listener for cards since hover effect is removed
}

document.addEventListener('DOMContentLoaded', init);