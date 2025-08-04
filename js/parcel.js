document.addEventListener('DOMContentLoaded', function() {
    // Get parcel ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const parcelId = urlParams.get('id');
    
    if (!parcelId) {
        window.location.href = 'parcels.html';
        return;
    }
    
    // Load parcel data
    loadParcelData(parcelId);
    
    // Initialize map
    initParcelMap(parcelId);
    
    // Load sensor data
    loadSensorData(parcelId);
});

async function loadParcelData(parcelId) {
    try {
        const parcels = await fetch('data/parcels.json').then(res => res.json());
        const parcel = parcels.find(p => p.id === parcelId);
        
        if (!parcel) {
            throw new Error('Parcela nu a fost găsită');
        }
        
        // Update UI
        document.getElementById('parcelName').textContent = parcel.name;
        document.getElementById('parcelVariety').textContent = parcel.variety;
        document.getElementById('parcelArea').textContent = parcel.area;
        // Add more fields as needed
        
    } catch (error) {
        console.error('Error loading parcel data:', error);
        alert('Eroare la încărcarea datelor parcelei');
    }
}

async function initParcelMap(parcelId) {
    const parcels = await fetch('data/parcels.json').then(res => res.json());
    const parcel = parcels.find(p => p.id === parcelId);
    
    if (!parcel || !parcel.coordinates) return;
    
    const map = L.map('parcelMap').setView(parcel.coordinates, 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add parcel boundary (simplified for demo)
    L.polygon([
        [parcel.coordinates[0] + 0.002, parcel.coordinates[1] + 0.002],
        [parcel.coordinates[0] + 0.002, parcel.coordinates[1] - 0.002],
        [parcel.coordinates[0] - 0.002, parcel.coordinates[1] - 0.002],
        [parcel.coordinates[0] - 0.002, parcel.coordinates[1] + 0.002]
    ], {
        color: '#6A1B9A',
        fillOpacity: 0.2
    }).addTo(map).bindPopup(parcel.name);
}

async function loadSensorData(parcelId) {
    try {
        const sensors = await fetch('data/sensors.json').then(res => res.json());
        const parcelSensors = sensors.filter(s => s.parcelId === parcelId);
        
        const sensorCards = document.getElementById('sensorCards');
        sensorCards.innerHTML = parcelSensors.map(sensor => `
            <div class="sensor-card">
                <div class="sensor-header">
                    <h4>${sensor.name}</h4>
                    <span class="sensor-status ${sensor.active ? 'active' : 'inactive'}">
                        ${sensor.active ? 'Activ' : 'Inactiv'}
                    </span>
                </div>
                <div class="sensor-value">
                    ${sensor.lastValue} <span class="unit">${sensor.unit}</span>
                </div>
                <div class="sensor-meta">
                    <span><i class="fas fa-clock"></i> ${new Date(sensor.lastUpdate).toLocaleString('ro-RO')}</span>
                    <button class="sensor-details-btn" data-sensor="${sensor.id}">
                        <i class="fas fa-chart-line"></i> Vezi istoric
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to detail buttons
        document.querySelectorAll('.sensor-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sensorId = btn.dataset.sensor;
                window.location.href = `sensor-details.html?id=${sensorId}`;
            });
        });
        
    } catch (error) {
        console.error('Error loading sensor data:', error);
    }
}
