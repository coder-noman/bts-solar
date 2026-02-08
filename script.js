// Initialize Charts
const powerCtx = document.getElementById('powerChart').getContext('2d');
const energyCtx = document.getElementById('energyChart').getContext('2d');
const monthlyBarCtx = document.getElementById('monthlyBarChart').getContext('2d');

// Monthly Data for Table and Charts
const monthlyData = [
    { month: 'Jan', energy: 2250, carbon: 1780, revenue: 45000, efficiency: '82%' },
    { month: 'Feb', energy: 2450, carbon: 1930, revenue: 49000, efficiency: '85%' },
    { month: 'Mar', energy: 2780, carbon: 2190, revenue: 55600, efficiency: '88%' },
    { month: 'Apr', energy: 2620, carbon: 2060, revenue: 52400, efficiency: '86%' },
    { month: 'May', energy: 2850, carbon: 2240, revenue: 57000, efficiency: '90%' },
    { month: 'Jun', energy: 2410, carbon: 1890, revenue: 48200, efficiency: '84%' },
    { month: 'Jul', energy: 2310, carbon: 1820, revenue: 46200, efficiency: '83%' },
    { month: 'Aug', energy: 2680, carbon: 2110, revenue: 53600, efficiency: '87%' },
    { month: 'Sep', energy: 2740, carbon: 2160, revenue: 54800, efficiency: '89%' },
    { month: 'Oct', energy: 2590, carbon: 2040, revenue: 51800, efficiency: '86%' },
    { month: 'Nov', energy: 2420, carbon: 1900, revenue: 48400, efficiency: '84%' },
    { month: 'Dec', energy: 2280, carbon: 1790, revenue: 45600, efficiency: '82%' }
];

// Battery Data
let batteryPercentage = 85;
let batteryVoltage = 51.2;
let batteryTemperature = 28;
let isCharging = true;
let batteryStatus = "Charging";

// Power Generation Chart (Line Chart)
const powerChart = new Chart(powerCtx, {
    type: 'line',
    data: {
        labels: ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
        datasets: [{
            label: 'Power Generation (kW)',
            data: [0, 0, 0.2, 2.5, 6.8, 10.2, 12.4, 11.8, 9.5, 4.2, 1.1, 0.3],
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
            legend: {
                labels: {
                    color: '#f0f0f0'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#b0b0b0'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#b0b0b0'
                },
                beginAtZero: true,
                max: 15
            }
        }
    }
});

// Energy Distribution Chart (Doughnut Chart)
const energyChart = new Chart(energyCtx, {
    type: 'doughnut',
    data: {
        labels: ['Self Consumption', 'Grid Feed-in', 'Battery Storage'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800'
            ],
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
                labels: {
                    color: '#f0f0f0',
                    padding: 20
                }
            }
        }
    }
});

// Monthly Bar Chart
let currentChartType = 'energy';
const monthlyBarChart = new Chart(monthlyBarCtx, {
    type: 'bar',
    data: {
        labels: monthlyData.map(item => item.month),
        datasets: [{
            label: 'Energy (kWh)',
            data: monthlyData.map(item => item.energy),
            backgroundColor: 'rgba(76, 175, 80, 0.7)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#f0f0f0'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#b0b0b0'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#b0b0b0'
                },
                beginAtZero: true
            }
        }
    }
});

// Function to change the bar chart type
function changeChartType(type) {
    currentChartType = type;

    // Update active button
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update chart data based on selected type
    let label = '';
    let data = [];
    let backgroundColor = '';

    switch (type) {
        case 'energy':
            label = 'Energy (kWh)';
            data = monthlyData.map(item => item.energy);
            backgroundColor = 'rgba(76, 175, 80, 0.7)';
            break;
        case 'revenue':
            label = 'Revenue (৳)';
            data = monthlyData.map(item => item.revenue);
            backgroundColor = 'rgba(255, 193, 7, 0.7)';
            break;
        case 'carbon':
            label = 'Carbon Reduction (kg)';
            data = monthlyData.map(item => item.carbon);
            backgroundColor = 'rgba(33, 150, 243, 0.7)';
            break;
    }

    monthlyBarChart.data.datasets[0].label = label;
    monthlyBarChart.data.datasets[0].data = data;
    monthlyBarChart.data.datasets[0].backgroundColor = backgroundColor;
    monthlyBarChart.update();
}

// Populate Monthly Data Table
const monthlyDataTable = document.getElementById('monthly-data');
monthlyData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
                <td>${item.month}</td>
                <td>${item.energy.toLocaleString()}</td>
                <td>${item.carbon.toLocaleString()}</td>
                <td>${item.revenue.toLocaleString()} ৳</td>
                <td>${item.efficiency}</td>
            `;
    monthlyDataTable.appendChild(row);
});

// Update Battery Display
function updateBatteryDisplay() {
    const batteryLevelBar = document.getElementById('battery-level-bar');
    const batteryPercentageEl = document.getElementById('battery-percentage');
    const batteryVoltageEl = document.getElementById('battery-voltage');
    const batteryTempEl = document.getElementById('battery-temp');
    const batteryTimeEl = document.getElementById('battery-time');
    const batteryStatusEl = document.getElementById('battery-status');
    const batteryStatusText = document.getElementById('battery-status-text');

    // Update battery percentage
    batteryLevelBar.style.width = `${batteryPercentage}%`;
    batteryPercentageEl.textContent = `${batteryPercentage}%`;

    // Update battery voltage (48V LiFePO4 ranges from ~46V to 58.4V)
    batteryVoltageEl.textContent = `${batteryVoltage.toFixed(1)}V`;

    // Update temperature
    batteryTempEl.textContent = `${batteryTemperature}°C`;

    // Calculate remaining time based on percentage and charging status
    let remainingTime = 0;
    if (isCharging) {
        remainingTime = ((100 - batteryPercentage) / 10).toFixed(1); // Simulated charging rate
        batteryTimeEl.textContent = `${remainingTime}h to full`;
    } else {
        remainingTime = (batteryPercentage / 5).toFixed(1); // Simulated discharge rate
        batteryTimeEl.textContent = `${remainingTime}h remaining`;
    }

    // Update battery status and indicator
    batteryStatusText.textContent = batteryStatus;

    // Change battery status indicator color based on percentage
    batteryStatusEl.className = 'battery-status';
    if (batteryPercentage < 20) {
        batteryStatusEl.classList.add('battery-low');
        batteryStatus = "Critical";
    } else if (batteryPercentage < 50) {
        batteryStatusEl.classList.add('battery-medium');
        batteryStatus = "Discharging";
    } else if (isCharging) {
        batteryStatus = "Charging";
    } else {
        batteryStatus = "Full";
    }
}

// Update Time Function
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('last-updated').textContent = now.toLocaleDateString('en-US', options);
}

// Simulate Real-time Data Updates
function updateRealTimeData() {
    // Simulate small fluctuations in power generation
    const currentPower = 12.4 + (Math.random() * 0.8 - 0.4);
    document.getElementById('current-power').textContent = currentPower.toFixed(1) + ' kW';

    // Update today's energy (random slight increase)
    const todayEnergy = 84.2 + (Math.random() * 1.5);
    document.getElementById('today-energy').textContent = todayEnergy.toFixed(1) + ' kWh';

    // Update carbon reduction (based on energy)
    const carbonReduction = 1265 + (Math.random() * 20);
    document.getElementById('carbon-reduction').textContent = Math.round(carbonReduction).toLocaleString() + ' kg';

    // Update revenue (energy * unit cost of 20 taka)
    const todayRevenue = todayEnergy * 20;
    document.getElementById('today-revenue').textContent = Math.round(todayRevenue).toLocaleString() + ' ৳';

    // Update battery data
    // Simulate battery charging/discharging based on time of day
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 17) {
        // Daytime - battery charges
        isCharging = true;
        batteryPercentage = Math.min(100, batteryPercentage + (Math.random() * 0.5));
        batteryVoltage = 50 + (batteryPercentage / 100) * 8.4 + (Math.random() * 0.2 - 0.1);
    } else {
        // Nighttime - battery discharges
        isCharging = false;
        batteryPercentage = Math.max(20, batteryPercentage - (Math.random() * 0.3));
        batteryVoltage = 46 + (batteryPercentage / 100) * 8.4 + (Math.random() * 0.2 - 0.1);
    }

    // Simulate temperature changes
    batteryTemperature = 25 + Math.sin(currentHour / 24 * Math.PI) * 5 + (Math.random() * 0.5 - 0.25);

    // Update battery display
    updateBatteryDisplay();

    // Update the chart with new data point
    if (currentHour >= 6 && currentHour <= 18) {
        // During daylight hours, update the chart
        const hourIndex = Math.floor(currentHour / 2);
        if (hourIndex < powerChart.data.datasets[0].data.length) {
            // Add some randomness to the data
            const newValue = currentPower + (Math.random() * 0.5 - 0.25);
            powerChart.data.datasets[0].data[hourIndex] = Math.max(0, newValue);
            powerChart.update('none');
        }
    }

    updateDateTime();
}

// Initialize and update data every 5 seconds
updateDateTime();
updateBatteryDisplay();
updateRealTimeData();
setInterval(updateRealTimeData, 5000);

// Add some interactivity to the cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function () {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});
