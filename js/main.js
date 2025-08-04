// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load current user info
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('currentUsername').textContent = currentUser.username;
        document.getElementById('currentUserRole').textContent = currentUser.role === 'admin' ? 'Administrator' : 'Viticultor';
    }
    
    // Set current date
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ro-RO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
    
    // Load dashboard data
    loadDashboardData();
});

function loadDashboardData() {
    // In a real app, this would fetch from an API
    const alerts = [
        {
            type: 'warning',
            icon: 'fa-tint',
            title: 'Umiditate scăzută',
            message: 'Parcela B2 - 35% (minim recomandat: 45%)',
            time: 'Acum 2 ore'
        },
        {
            type: 'danger',
            icon: 'fa-temperature-high',
            title: 'Temperatură ridicată',
            message: '32°C prevăzuți mâine - risc de stres termic',
            time: 'Acum 5 ore'
        }
    ];
    
    const weatherData = {
        current: {
            temp: 23,
            condition: '🌤️',
            humidity: 65,
            wind: '10 km/h NE'
        },
        forecast: [
            { day: 'Mar', icon: '☀️', temp: 26 },
            { day: 'Mie', icon: '⛅', temp: 24 },
            { day: 'Joi', icon: '🌧️', temp: 19 },
            { day: 'Vin', icon: '🌦️', temp: 22 }
        ]
    };
    
    const kpis = [
        { title: 'Calitate Struguri', value: 8.7, trend: 'up', change: 0.2 },
        { title: 'Tonaj Mediu', value: 245, trend: 'down', change: '5%' },
        { title: 'pH Sol', value: 6.2, trend: 'stable', status: 'Optim' },
        { title: 'Zile Recoltă', value: 42, trend: 'countdown' }
    ];
    
    const measurements = [
        { parcel: "A1 - Merlot", date: "2024-08-05", quantity: 245, quality: 8.7, humidity: 68, status: "excelent" },
        { parcel: "B2 - Cabernet", date: "2024-08-04", quantity: 180, quality: 7.9, humidity: 35, status: "probleme" },
        { parcel: "C3 - Fetească", date: "2024-08-03", quantity: 310, quality: 8.5, humidity: 72, status: "bun" }
    ];
    
    // Render alerts
    const alertsContainer = document.getElementById('alertsContainer');
    alerts.forEach(alert => {
        const alertEl = document.createElement('div');
        alertEl.className = `alert ${alert.type}`;
        alertEl.innerHTML = `
            <i class="fas ${alert.icon}"></i>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
                <span class="alert-time">${alert.time}</span>
            </div>
        `;
        alertsContainer.appendChild(alertEl);
    });
    
    // Render weather
    const weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.innerHTML = `
        <div class="current-weather">
            <div class="weather-icon">${weatherData.current.condition}</div>
            <div class="weather-details">
                <h4>${weatherData.current.temp}°C</h4>
                <p>Umiditate: ${weatherData.current.humidity}%</p>
                <p>Vânt: ${weatherData.current.wind}</p>
            </div>
        </div>
        <div class="weather-forecast">
            ${weatherData.forecast.map(day => `
                <div class="forecast-day">
                    <span>${day.day}</span>
                    <span class="forecast-icon">${day.icon}</span>
                    <span>${day.temp}°C</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Render KPIs
    const kpiContainer = document.getElementById('kpiContainer');
    kpiContainer.innerHTML = `
        <div class="kpi-grid">
            ${kpis.map(kpi => `
                <div class="kpi-card">
                    <h4>${kpi.title}</h4>
                    <p class="value">${kpi.value}</p>
                    ${kpi.trend === 'up' ? `
                        <p class="trend up"><i class="fas fa-arrow-up"></i> ${kpi.change}</p>
                    ` : kpi.trend === 'down' ? `
                        <p class="trend down"><i class="fas fa-arrow-down"></i> ${kpi.change}</p>
                    ` : kpi.trend === 'stable' ? `
                        <p class="trend stable"><i class="fas fa-check"></i> ${kpi.status}</p>
                    ` : `
                        <p class="trend countdown"><i class="fas fa-calendar-alt"></i> Prognoză</p>
                    `}
                </div>
            `).join('')}
        </div>
    `;
    
    // Render measurements table
    const measurementsTable = document.getElementById('measurementsTable');
    measurementsTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Parcela</th>
                    <th>Dată</th>
                    <th>Tonaj (kg)</th>
                    <th>Calitate</th>
                    <th>Umiditate</th>
                    <th>Stare</th>
                </tr>
            </thead>
            <tbody>
                ${measurements.map(measurement => `
                    <tr>
                        <td>${measurement.parcel}</td>
                        <td>${new Date(measurement.date).toLocaleDateString('ro-RO')}</td>
                        <td>${measurement.quantity}</td>
                        <td>${measurement.quality}</td>
                        <td>${measurement.humidity}%</td>
                        <td>
                            ${measurement.status === 'excelent' ? `
                                <span class="status-badge good"><i class="fas fa-check-circle"></i> Excelent</span>
                            ` : measurement.status === 'probleme' ? `
                                <span class="status-badge danger"><i class="fas fa-exclamation-triangle"></i> Problema</span>
                            ` : `
                                <span class="status-badge warning"><i class="fas fa-info-circle"></i> Bun</span>
                            `}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Initialize map and chart
    initMap();
    initHarvestChart();
}
