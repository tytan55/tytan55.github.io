function initHarvestChart() {
    const ctx = document.getElementById('harvestChart').getContext('2d');
    
    // Chart configuration with sensor selection
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Date senzori'
                }
            }
        }
    });
    
    // Add sensor control UI
    const sensorControls = `
        <div class="chart-controls">
            <div class="sensor-selection">
                <h4>Selectează senzorii:</h4>
                <label><input type="checkbox" name="sensor" value="temp" checked> Temperatură</label>
                <label><input type="checkbox" name="sensor" value="humidity" checked> Umiditate</label>
                <label><input type="checkbox" name="sensor" value="ph"> pH Sol</label>
            </div>
            <div class="time-range">
                <h4>Interval temporal:</h4>
                <select id="timeRange">
                    <option value="7">Ultimele 7 zile</option>
                    <option value="30">Ultimele 30 zile</option>
                    <option value="90">Ultimele 90 zile</option>
                </select>
            </div>
        </div>
    `;
    
    document.getElementById('chartContainer').insertAdjacentHTML('beforeend', sensorControls);
    
    // Load initial data
    updateChartData(chart, ['temp', 'humidity'], 7);
    
    // Add event listeners
    document.querySelectorAll('input[name="sensor"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedSensors = getSelectedSensors();
            const timeRange = document.getElementById('timeRange').value;
            updateChartData(chart, selectedSensors, timeRange);
        });
    });
    
    document.getElementById('timeRange').addEventListener('change', () => {
        const selectedSensors = getSelectedSensors();
        const timeRange = document.getElementById('timeRange').value;
        updateChartData(chart, selectedSensors, timeRange);
    });
}

function getSelectedSensors() {
    return Array.from(document.querySelectorAll('input[name="sensor"]:checked'))
        .map(checkbox => checkbox.value);
}

async function updateChartData(chart, sensors, days) {
    // In a real app, this would fetch from API
    const response = await fetch(`data/sensor-data.json?days=${days}`);
    const data = await response.json();
    
    chart.data.datasets = sensors.map(sensor => ({
        label: getSensorLabel(sensor),
        data: data.map(item => ({
            x: new Date(item.date),
            y: item[sensor]
        })),
        borderColor: getSensorColor(sensor),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        tension: 0.3
    }));
    
    chart.update();
}

function getSensorLabel(sensor) {
    const labels = {
        temp: 'Temperatură (°C)',
        humidity: 'Umiditate (%)',
        ph: 'pH Sol'
    };
    return labels[sensor] || sensor;
}

function getSensorColor(sensor) {
    const colors = {
        temp: '#FF6384',
        humidity: '#36A2EB',
        ph: '#4BC0C0'
    };
    return colors[sensor] || '#CCCCCC';
}
