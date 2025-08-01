// Funcție pentru actualizarea graficului
function updateChart(crop) {
    const ctx = document.getElementById('cropChart').getContext('2d');
    
    // Șterge graficul existent dacă există
    if (window.cropChart) {
        window.cropChart.destroy();
    }
    
    // Simulare date pentru grafic (în practică, acestea ar veni de la API)
    const parameter = document.getElementById('chartParameterSelect').value;
    const days = 7; // Implicit 7 zile
    
    let label, data, borderColor, backgroundColor;
    
    switch (parameter) {
        case 'temperature':
            label = 'Temperatură (°C)';
            data = [22, 23, 24, 25, 24, 23, 22];
            borderColor = 'rgba(255, 99, 132, 1)';
            backgroundColor = 'rgba(255, 99, 132, 0.2)';
            break;
        case 'humidity':
            label = 'Umiditate Sol (%)';
            data = [38, 36, 35, 34, 36, 37, 35];
            borderColor = 'rgba(54, 162, 235, 1)';
            backgroundColor = 'rgba(54, 162, 235, 0.2)';
            break;
        case 'ph':
            label = 'pH Sol';
            data = [6.4, 6.5, 6.5, 6.6, 6.5, 6.5, 6.4];
            borderColor = 'rgba(255, 206, 86, 1)';
            backgroundColor = 'rgba(255, 206, 86, 0.2)';
            break;
        case 'light':
            label = 'Nivel Lumină (lux)';
            data = [8200, 8400, 8500, 8600, 8500, 8300, 8200];
            borderColor = 'rgba(75, 192, 192, 1)';
            backgroundColor = 'rgba(75, 192, 192, 0.2)';
            break;
    }
    
    // Generează etichete pentru ultimele 7 zile
    const labels = [];
    const today = new Date();
    for (let i = days-1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }));
    }
    
    window.cropChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // Ascultător pentru schimbarea parametrului
    document.getElementById('chartParameterSelect').addEventListener('change', function() {
        updateChart(crop);
    });
    
    // Ascultător pentru schimbarea perioadei
    document.querySelectorAll('.period-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // În practică, aici s-ar reîmprospăta datele pentru perioada selectată
            updateChart(crop);
        });
    });
}
