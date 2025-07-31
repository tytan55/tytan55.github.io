document.addEventListener('DOMContentLoaded', function() {
    // Toggle dark mode
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Verifică preferința sistemului
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-mode');
        updateThemeIcon(isDark);
    });
    
    function updateThemeIcon(isDark) {
        themeToggle.innerHTML = isDark ? 
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>` :
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>`;
    }
    
    // Inițializare grafic (folosind Chart.js)
    const ctx = document.getElementById('harvest-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
            datasets: [{
                label: 'Zahăr (°Brix)',
                data: [22, 22.5, 23, 23.5, 24, 24.5, 25],
                borderColor: '#5E2B7A',
                backgroundColor: 'rgba(94, 43, 122, 0.1)',
                tension: 0.4
            }, {
                label: 'Aciditate (g/L)',
                data: [6.5, 6.3, 6.2, 6.0, 5.8, 5.7, 5.5],
                borderColor: '#D4A76A',
                backgroundColor: 'rgba(212, 167, 106, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
    
    // Generare parametri recoltă
    function generateParameters() {
        const parametersGrid = document.querySelector('.parameters-grid');
        const parameters = [
            { name: 'Zahăr', value: '24.5', unit: '°Brix', min: 22, max: 25, status: 'good' },
            { name: 'Aciditate', value: '5.7', unit: 'g/L', min: 5.5, max: 7.5, status: 'good' },
            { name: 'pH', value: '3.5', unit: '', min: 3.2, max: 3.8, status: 'good' },
            { name: 'Temperatură', value: '24', unit: '°C', min: 18, max: 30, status: 'good' },
            { name: 'Umiditate', value: '65', unit: '%', min: 40, max: 80, status: 'good' },
            { name: 'Starea solului', value: 'Optimă', unit: '', status: 'good' }
        ];
        
        parametersGrid.innerHTML = parameters.map(param => `
            <div class="parameter-card ${param.status}">
                <div class="parameter-card-header">
                    <div class="parameter-name">
                        ${param.name}
                        <div class="parameter-status ${param.status}"></div>
                    </div>
                </div>
                <div class="parameter-value">${param.value}</div>
                ${param.unit ? `<div class="parameter-unit">${param.unit}</div>` : ''}
                ${param.min ? `<div class="parameter-range">Interval optim: <span>${param.min}-${param.max}</span></div>` : ''}
            </div>
        `).join('');
    }
    
    generateParameters();
});
