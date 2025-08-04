function initMap() {
    const map = L.map('parcelsMap').setView([44.4268, 26.1025], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Custom icons
    const greenIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="%234CAF50"><path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 21c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    
    const orangeIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="%23FFA000"><path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 21c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    
    const redIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="%23E53935"><path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 21c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    
    // Sample parcels data
    const parcels = [
        { 
            name: "Parcela A1 - Merlot", 
            lat: 44.43, 
            lng: 26.10, 
            area: "2.5 ha", 
            status: "excelent", 
            variety: "Merlot",
            plantingYear: 2015,
            lastHarvest: "2023-09-15",
            avgQuality: 8.7
        },
        { 
            name: "Parcela B2 - Cabernet", 
            lat: 44.425, 
            lng: 26.095, 
            area: "1.8 ha", 
            status: "probleme umiditate", 
            variety: "Cabernet Sauvignon",
            plantingYear: 2018,
            lastHarvest: "2023-09-20",
            avgQuality: 7.9
        },
        { 
            name: "Parcela C3 - Fetească", 
            lat: 44.422, 
            lng: 26.105, 
            area: "3.2 ha", 
            status: "normal", 
            variety: "Fetească Neagră",
            plantingYear: 2012,
            lastHarvest: "2023-09-10",
            avgQuality: 8.5
        }
    ];
    
    // Add markers to map
    parcels.forEach(parcel => {
        let icon;
        if (parcel.status.includes("excelent")) icon = greenIcon;
        else if (parcel.status.includes("probleme")) icon = redIcon;
        else icon = orangeIcon;
        
        const marker = L.marker([parcel.lat, parcel.lng], { icon }).addTo(map)
            .bindPopup(`
                <b>${parcel.name}</b><br>
                <hr style="margin: 5px 0; border-color: #eee;">
                <table style="font-size: 0.9rem; width: 100%;">
                    <tr><td>Suprafață:</td><td><b>${parcel.area}</b></td></tr>
                    <tr><td>Soi:</td><td><b>${parcel.variety}</b></td></tr>
                    <tr><td>An plantare:</td><td><b>${parcel.plantingYear}</b></td></tr>
                    <tr><td>Ultima recoltă:</td><td><b>${parcel.lastHarvest}</b></td></tr>
                    <tr><td>Calitate medie:</td><td><b>${parcel.avgQuality}/10</b></td></tr>
                    <tr><td>Stare:</td><td><b style="color: ${
                        parcel.status.includes("excelent") ? "#4CAF50" : 
                        parcel.status.includes("probleme") ? "#E53935" : "#FFA000"
                    };">${parcel.status}</b></td></tr>
                </table>
                <button onclick="window.location.href='parcel-detail.html?id=${parcel.name.replace(' ', '-')}'" 
                    style="margin-top: 8px; width: 100%; padding: 6px; background-color: #6A1B9A; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Vezi detalii complete
                </button>
            `);
    });
}
