document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.isAdmin) return;
    
    // Simulare date recolte pentru utilizatorul curent
    const userCrops = [
        { 
            id: 1, 
            code: 'POR001', 
            name: 'Porumb', 
            variety: 'Soi Dulce', 
            plantingDate: '2023-03-15',
            image: 'images/corn.jpg',
            status: 'Bună',
            temperature: { value: 24, optimal: '20-28°C', status: 'good' },
            humidity: { value: 35, optimal: '40-60%', status: 'warning', alert: 'Umiditatea solului este prea mică. Recomandăm irigare suplimentară.' },
            ph: { value: 6.5, optimal: '6.0-7.0', status: 'good' },
            light: { value: 8500, optimal: '8000-10000 lux', status: 'good' }
        },
        { 
            id: 2, 
            code: 'GR001', 
            name: 'Grâu', 
            variety: 'Soi Toamnă', 
            plantingDate: '2023-10-01',
            image: 'images/wheat.jpg',
            status: 'Excelentă',
            temperature: { value: 18, optimal: '15-22°C', status: 'good' },
            humidity: { value: 45, optimal: '40-50%', status: 'good' },
            ph: { value: 6.8, optimal: '6.5-7.5', status: 'good' },
            light: { value: 9200, optimal: '9000-11000 lux', status: 'good' }
        }
    ];
    
    // Afișează recoltele în grid
    const cropsView = document.getElementById('cropsView');
    const cropDetails = document.getElementById('cropDetails');
    
    function renderCrops() {
        cropsView.innerHTML = '';
        
        userCrops.forEach(crop => {
            const cropCard = document.createElement('div');
            cropCard.className = 'crop-card hover-grow hover-shadow';
            cropCard.innerHTML = `
                <div class="crop-image">
                    <img src="${crop.image}" alt="${crop.name}">
                    <span class="crop-status">${crop.status}</span>
                </div>
                <div class="crop-info">
                    <div class="crop-name">${crop.name}</div>
                    <div class="crop-variety">${crop.variety}</div>
                    <div class="crop-params">
                        <span class="param-badge ${crop.temperature.status}">
                            <i class="fas fa-thermometer-half"></i> ${crop.temperature.value}°C
                        </span>
                        <span class="param-badge ${crop.humidity.status}">
                            <i class="fas fa-tint"></i> ${crop.humidity.value}%
                        </span>
                    </div>
                </div>
            `;
            
            cropCard.addEventListener('click', () => showCropDetails(crop));
            cropsView.appendChild(cropCard);
        });
    }
    
    // Afișează detaliile recoltei
    function showCropDetails(crop) {
        cropsView.style.display = 'none';
        cropDetails.style.display = 'block';
        
        document.getElementById('cropDetailName').textContent = `${crop.name} - ${crop.variety}`;
        
        // Actualizează parametrii
        const paramsContainer = document.querySelector('#parametersTab .parameter-cards');
        paramsContainer.innerHTML = '';
        
        // Temperatură
        const tempCard = createParameterCard('Temperatură', 'fa-thermometer-half', 
                                           crop.temperature.value, '°C', crop.temperature.optimal, 
                                           crop.temperature.status, crop.temperature.alert);
        paramsContainer.appendChild(tempCard);
        
        // Umiditate
        const humCard = createParameterCard('Umiditate Sol', 'fa-tint', 
                                          crop.humidity.value, '%', crop.humidity.optimal, 
                                          crop.humidity.status, crop.humidity.alert);
        paramsContainer.appendChild(humCard);
        
        // pH
        const phCard = createParameterCard('pH Sol', 'fa-flask', 
                                         crop.ph.value, '', crop.ph.optimal, 
                                         crop.ph.status, crop.ph.alert);
        paramsContainer.appendChild(phCard);
        
        // Lumină
        const lightCard = createParameterCard('Nivel Lumină', 'fa-sun', 
                                            crop.light.value, ' lux', crop.light.optimal, 
                                            crop.light.status, crop.light.alert);
        paramsContainer.appendChild(lightCard);
        
        // Actualizează graficul (va fi gestionat de chart.js)
        updateChart(crop);
    }
    
    // Creează un card de parametru
    function createParameterCard(name, icon, value, unit, range, status, alert) {
        const card = document.createElement('div');
        card.className = `parameter-card ${status}`;
        
        let alertHtml = '';
        if (alert) {
            alertHtml = `<div class="parameter-alert"><p>${alert}</p></div>`;
        }
        
        card.innerHTML = `
            <div class="parameter-header">
                <h3>${name}</h3>
                <span class="parameter-status ${status}">
                    <i class="fas ${icon}"></i> 
                    ${status === 'good' ? 'Normal' : status === 'warning' ? 'Atenție' : 'Problemă'}
                </span>
            </div>
            <div class="parameter-value">
                <span class="value">${value}${unit}</span>
                <span class="range">Interval optim: ${range}</span>
            </div>
            ${alertHtml}
        `;
        
        return card;
    }
    
    // Buton pentru revenire la lista de recolte
    document.querySelector('.details-header h2').addEventListener('click', function() {
        cropsView.style.display = 'grid';
        cropDetails.style.display = 'none';
    });
    
    // Tab-uri
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Modale
    const addCropModal = document.getElementById('addCropModal');
    const confirmModal = document.getElementById('confirmModal');
    const aiChatModal = document.getElementById('aiChatModal');
    
    // Buton adăugare recoltă
    document.getElementById('addCropBtn').addEventListener('click', () => {
        addCropModal.style.display = 'flex';
    });
    
    // Formular adăugare recoltă
    document.getElementById('addCropForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const cropCode = document.getElementById('cropCodeInput').value;
        
        // Aici ar fi verificarea codului și adăugarea recoltei
        alert(`Recolta cu codul ${cropCode} a fost adăugată!`);
        this.reset();
        addCropModal.style.display = 'none';
        
        // Simulăm adăugarea unei noi recolte
        if (cropCode === 'SO001') {
            userCrops.push({
                id: 3, 
                code: 'SO001', 
                name: 'Soia', 
                variety: 'Soi Rezistent', 
                plantingDate: '2023-04-20',
                image: 'images/soy.jpg',
                status: 'Bună',
                temperature: { value: 22, optimal: '20-26°C', status: 'good' },
                humidity: { value: 42, optimal: '40-50%', status: 'good' },
                ph: { value: 6.2, optimal: '6.0-7.0', status: 'good' },
                light: { value: 8800, optimal: '8000-10000 lux', status: 'good' }
            });
            
            renderCrops();
        }
    });
    
    // Buton ștergere recoltă
    document.getElementById('removeCropBtn').addEventListener('click', function() {
        confirmModal.style.display = 'flex';
        
        document.getElementById('confirmDelete').onclick = function() {
            alert('Recolta a fost eliminată!');
            confirmModal.style.display = 'none';
            cropsView.style.display = 'grid';
            cropDetails.style.display = 'none';
            // Aici ar trebui să fie logica de ștergere
        };
    });
    
    // Buton camera live
    document.getElementById('viewLiveBtn').addEventListener('click', function() {
        alert('Se deschide camera live...');
    });
    
    // Buton chat AI
    document.getElementById('askAIBtn').addEventListener('click', function() {
        aiChatModal.style.display = 'flex';
    });
    
    // Funcționalitate chat AI
    document.getElementById('sendAiMessage').addEventListener('click', function() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (message) {
            // Adaugă mesajul utilizatorului
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message';
            userMessage.innerHTML = `<p>${message}</p>`;
            document.getElementById('aiChatContainer').appendChild(userMessage);
            
            // Simulează răspuns AI
            setTimeout(() => {
                const aiMessage = document.createElement('div');
                aiMessage.className = 'ai-message';
                
                let response = "Îmi pare rău, nu pot înțelege întrebarea. Puteți reformula?";
                
                if (message.toLowerCase().includes('temperatur')) {
                    response = "Temperatura optimă pentru majoritatea plantelor agricole este între 20-28°C. Dacă temperatura este prea mare, recomand umbrire și irigare suplimentară.";
                } else if (message.toLowerCase().includes('umiditat')) {
                    response = "Umiditatea solului ar trebui să fie între 40-60%. Dacă solul este prea uscat, creșteți frecvența irigațiilor.";
                } else if (message.toLowerCase().includes('fertilizare')) {
                    response = "Recomand fertilizarea o dată la 2 săptămâni în perioada de creștere activă. Utilizați un fertilizant echilibrat NPK.";
                }
                
                aiMessage.innerHTML = `<p>${response}</p>`;
                document.getElementById('aiChatContainer').appendChild(aiMessage);
                
                // Derulează la ultimul mesaj
                aiChatModal.querySelector('.chat-container').scrollTop = aiChatModal.querySelector('.chat-container').scrollHeight;
            }, 1000);
            
            input.value = '';
        }
    });
    
    // Închidere modal la apăsare Enter în chat
    document.getElementById('aiChatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('sendAiMessage').click();
        }
    });
    
    // Închidere modale
    const closeButtons = document.querySelectorAll('.close-modal, #confirmCancel');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            addCropModal.style.display = 'none';
            confirmModal.style.display = 'none';
            aiChatModal.style.display = 'none';
        });
    });
    
    // Închidere modal la click în afara conținutului
    window.addEventListener('click', (e) => {
        if (e.target === addCropModal) addCropModal.style.display = 'none';
        if (e.target === confirmModal) confirmModal.style.display = 'none';
        if (e.target === aiChatModal) aiChatModal.style.display = 'none';
    });
    
    // Schimbare view (grid/list)
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            if (this.getAttribute('data-view') === 'list') {
                cropsView.classList.add('list-view');
            } else {
                cropsView.classList.remove('list-view');
            }
        });
    });
    
    // Inițializare
    renderCrops();
});
