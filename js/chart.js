function initHarvestChart() {
    const ctx = document.getElementById('harvestChart').getContext('2d');
    
    // Sample data - in a real app, this would come from an API
    const harvestData = {
        labels: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'],
        datasets: [{
            label: 'Tonaj (kg)',
            data: [120, 190, 300, 500, 800, 1100, 1400, 1600, 1200, 900, 500, 200],
            backgroundColor: 'rgba(106, 27, 154, 0.1)',
            borderColor: 'rgba(106, 27, 154, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'white',
            pointBorderColor: 'rgba(106, 27, 154, 1)',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: harvestData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 12,
                    cornerRadius: 6
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' kg';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    });
}
