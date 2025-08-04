// Database simulation
const parcels = [
    {
        id: 1,
        name: "Parcela A1 - Merlot",
        area: "2.5 ha",
        lastHarvest: "2023-09-15",
        status: "excellent",
        sensors: [101, 102]
    },
    {
        id: 2,
        name: "Parcela B2 - Cabernet",
        area: "1.8 ha",
        lastHarvest: "2023-09-20",
        status: "warning",
        sensors: [103]
    }
];

// Load parcels
document.addEventListener('DOMContentLoaded', () => {
    renderParcels();
});

function renderParcels() {
    const container = document.getElementById('parcelList');
    container.innerHTML = parcels.map(parcel => `
        <div class="parcel-card ${parcel.status}">
            <h3>${parcel.name}</h3>
            <p>Suprafață: ${parcel.area}</p>
            <p>Ultima recoltă: ${parcel.lastHarvest}</p>
            <div class="parcel-actions">
                <button class="btn-detail" data-id="${parcel.id}">
                    Detalii <i class="icon-arrow"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            const parcelId = btn.dataset.id;
            window.location.href = `detail.html?id=${parcelId}`;
        });
    });
}
