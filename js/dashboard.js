document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if(!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // DOM Elements
    const userLogoutBtn = document.getElementById('userLogoutBtn');
    const tabLinks = document.querySelectorAll('nav li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const selectedCrop = document.getElementById('selectedCrop');
    const addCropBtn = document.getElementById('addCropBtn');
    const addNewCropBtn = document.getElementById('addNewCropBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationCount = document.getElementById('notificationCount');
    const cropDashboard = document.getElementById('cropDashboard');
    const myCropsContainer = document.getElementById('myCropsContainer');
    const alertsContainer = document.getElementById('alertsContainer');
    const alertsFilter = document.getElementById('alertsFilter');
    const aiChat = document.getElementById('aiChat');
    const aiMessageInput = document.getElementById('aiMessageInput');
    const sendAiMessage = document.getElementById('sendAiMessage');
    const addCropModal = document.getElementById('addCropModal');
    const cropDetailsModal = document.getElementById('cropDetailsModal');
    const liveViewModal = document.getElementById('liveViewModal');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const addCropForm = document.getElementById('addCropForm');
    const viewLiveBtn = document.getElementById('viewLiveBtn');
    const removeCropBtn = document.getElementById('removeCropBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cropVarietySelect = document.getElementById('cropVarietySelect');
    
    // User data
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    // Test data
    let userCrops = [
        { code: 'CR001', name: 'Grâu', variety: 'Soi A', date: '2023-05-10', selected: true },
        { code: 'CR002', name: 'Porumb', variety: 'Soi B', date: '2023-06-05', selected: false },
        { code: 'CR004', name: 'Rapiță', variety: 'Soi D', date: '2023-07-20', selected: false }
    ];
    
    const allCrops = [
        { code: 'CR001', name: 'Grâu', variety: 'Soi A', date: '2023-05-10', user: 'Ion Popescu' },
        { code: 'CR002', name: 'Porumb', variety: 'Soi B', date: '2023-06-05', user: 'Maria Ionescu' },
        { code: 'CR003', name: 'Floarea soarelui', variety: 'Soi C', date: '2023-07-15', user: 'Andrei Georgescu' },
        { code: 'CR004', name: 'Rapiță', variety: 'Soi D', date: '2023-07-20', user: 'Ion Popescu' },
        { code: 'CR005', name: 'Orz', variety: 'Soi E', date: '2023-08-01', user: 'Maria Ionescu' }
    ];
    
    const alerts = [
        { id: 1, type: 'warning', title: 'Umiditate scăzută', message: 'Umiditatea solului este sub nivelul optim pentru grâu.', time: '2023-08-10 14:30' },
        { id: 2, type: 'danger', title: 'Temperatură ridicată', message: 'Temperatura depășește nivelul optim pentru porumb.', time: '2023-08-09 11:45' },
        { id: 3, type: 'info', title: 'Fertilizare necesară', message: 'Nivelul de azot din sol este sub optim. Recomand fertilizare.', time: '2023-08-08 09:15' },
        { id: 4, type: 'warning', title: 'Aciditate crescută', message: 'pH-ul solului este prea acid pentru rapiță.', time: '2023-08-07 16:20' }
    ];
    
    const cropVarieties = {
        'Grâu': ['Soi A', 'Soi B', 'Soi C'],
        'Porumb': ['Soi X', 'Soi Y', 'Soi Z'],
        'Floarea soarelui': ['Soi 1', 'Soi 2', 'Soi 3'],
        'Rapiță': ['Soi D', 'Soi E', 'Soi F'],
        'Orz': ['Soi G', 'Soi H']
    };
    
    const cropParams = {
        'Grâu': [
            { name: 'Umiditate', value: '65%', optimal: '60-70%', status: 'normal' },
            { name: 'Temperatură', value: '22°C', optimal: '18-25°C', status: 'normal' },
            { name: 'Aciditate', value: '6.2 pH', optimal: '6.0-7.0 pH', status: 'normal' },
            { name: 'Azot', value: '2.1%', optimal: '2.0-2.5%', status: 'normal' },
            { name: 'Fosfor', value: '1.5%', optimal: '1.5-2.0%', status: 'normal' },
            { name: 'Potasiu', value: '1.8%', optimal: '1.5-2.0%', status: 'normal' }
        ],
        'Porumb': [
            { name: 'Umiditate', value: '58%', optimal: '55-65%', status: 'normal' },
            { name: 'Temperatură', value: '28°C', optimal: '20-27°C', status: 'warning' },
            { name: 'Aciditate', value: '6.8 pH', optimal: '6.0-7.0 pH', status: 'normal' },
            { name: 'Azot', value: '1.9%', optimal: '1.8-2.3%', status: 'normal' },
            { name: 'Fosfor', value: '1.2%', optimal: '1.0-1.5%', status: 'normal' },
            { name: 'Potasiu', value: '1.4%', optimal: '1.2-1.7%', status: 'normal' }
        ],
        'Rapiță': [
            { name: 'Umiditate', value: '62%', optimal: '60-70%', status: 'normal' },
            { name: 'Temperatură', value: '20°C', optimal: '18-22°C', status: 'normal' },
            { name: 'Aciditate', value: '5.8 pH', optimal: '6.0-7.0 pH', status: 'warning' },
            { name: 'Azot', value: '2.3%', optimal: '2.0-2.5%', status: 'normal' },
            { name: 'Fosfor', value: '1.7%', optimal: '1.5-2.0%', status: 'normal' },
            { name: 'Potasiu', value: '2.1%', optimal: '1.8-2.3%', status: 'normal' }
        ]
    };
    
    // Current selected crop
    let currentSelectedCrop = userCrops.find(crop => crop.selected) || null;
    let cropToDelete = null;
    
    // Initialize the dashboard
    function initDashboard() {
        // Set user info
        userName.textContent = loggedInUser.username;
        userEmail.textContent = `${loggedInUser.username}@example.com`;
        
        // Set notification count
        notificationCount.textContent = alerts.length;
        
        // Render crop selector
        renderCropSelector();
        
        // Render dashboard based on selected crop
        if(currentSelectedCrop) {
            renderCropDashboard(currentSelectedCrop);
        }
        
        // Render my crops
        renderMyCrops();
        
        // Render alerts
        renderAlerts();
    }
    
    // Render crop selector dropdown
    function renderCropSelector() {
        selectedCrop.innerHTML = '<option value="">Selectează recolta...</option>';
        
        userCrops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop.code;
            option.textContent = `${crop.name} (${crop.variety})`;
            option.selected = crop.selected;
            selectedCrop.appendChild(option);
        });
    }
    
    // Render crop dashboard
    function renderCropDashboard(crop) {
        const cropData = allCrops.find(c => c.code === crop.code);
        if(!cropData) return;
        
        cropDashboard.innerHTML = '';
        
        // Create parameter cards
        const params = cropParams[cropData.name] || [];
        
        params.forEach(param => {
            const card = document.createElement('div');
            card.className = 'param-card';
            
            let statusClass = '';
            let statusText = '';
            
            if(param.status === 'warning') {
                statusClass = 'status-warning';
                statusText = 'Atenție';
            } else if(param.status === 'danger') {
                statusClass = 'status-danger';
                statusText = 'Critic';
            } else {
                statusClass = 'status-normal';
                statusText = 'Normal';
            }
            
            card.innerHTML = `
                <div class="param-header">
                    <h3 class="param-title">
                        <i class="fas fa-${getParamIcon(param.name)}"></i>
                        ${param.name}
                    </h3>
                    <span class="param-status ${statusClass}">${statusText}</span>
                </div>
                <div class="param-value">${param.value}</div>
                <div class="param-range">Interval optim: ${param.optimal}</div>
            `;
            
            cropDashboard.appendChild(card);
        });
    }
    
    // Get parameter icon
    function getParamIcon(paramName) {
        switch(paramName) {
            case 'Umiditate': return 'tint';
            case 'Temperatură': return 'thermometer-half';
            case 'Aciditate': return 'flask';
            case 'Azot': return 'atom';
            case 'Fosfor': return 'fire';
            case 'Potasiu': return 'bolt';
            default: return 'chart-line';
        }
    }
    
    // Render my crops grid
    function renderMyCrops() {
        myCropsContainer.innerHTML = '';
        
        userCrops.forEach(crop => {
            const cropData = allCrops.find(c => c.code === crop.code);
            if(!cropData) return;
            
            const cropCard = document.createElement('div');
            cropCard.className = 'crop-card';
            cropCard.setAttribute('data-code', crop.code);
            
            cropCard.innerHTML = `
                <h3 class="crop-name">${cropData.name}</h3>
                <p class="crop-code">Cod: ${cropData.code}</p>
                <span class="crop-variety">${cropData.variety}</span>
                <p class="crop-date">Adăugat: ${cropData.date}</p>
            `;
            
            cropCard.addEventListener('click', function() {
                showCropDetails(cropData);
            });
            
            myCropsContainer.appendChild(cropCard);
        });
    }
    
    // Render alerts
    function renderAlerts(filter = 'all') {
        alertsContainer.innerHTML = '';
        
        let filteredAlerts = [...alerts];
        
        if(filter === 'today') {
            filteredAlerts = alerts.filter(alert => alert.time.startsWith(new Date().toISOString().split('T')[0]));
        } else if(filter === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            filteredAlerts = alerts.filter(alert => {
                const alertDate = new Date(alert.time.replace(' ', 'T'));
                return alertDate >= oneWeekAgo;
            });
        } else if(filter === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            
            filteredAlerts = alerts.filter(alert => {
                const alertDate = new Date(alert.time.replace(' ', 'T'));
                return alertDate >= oneMonthAgo;
            });
        }
        
        if(filteredAlerts.length === 0) {
            alertsContainer.innerHTML = '<p class="text-center">Nu există alertă pentru perioada selectată.</p>';
            return;
        }
        
        filteredAlerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item alert-${alert.type}`;
            
            alertItem.innerHTML = `
                <div class="alert-icon">
                    <i class="fas fa-${getAlertIcon(alert.type)}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                    <p class="alert-time">${formatAlertTime(alert.time)}</p>
                </div>
            `;
            
            alertsContainer.appendChild(alertItem);
        });
    }
    
    // Get alert icon
    function getAlertIcon(type) {
        switch(type) {
            case 'warning': return 'exclamation-triangle';
            case 'danger': return 'times-circle';
            case 'info': return 'info-circle';
            default: return 'bell';
        }
    }
    
    // Format alert time
    function formatAlertTime(timeStr) {
        const [date, time] = timeStr.split(' ');
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    
    // Show crop details modal
    function showCropDetails(crop) {
        document.getElementById('detailCropName').textContent = crop.name;
        document.getElementById('detailCropCode').textContent = crop.code;
        document.getElementById('detailCropVariety').textContent = crop.variety;
        document.getElementById('detailCropDate').textContent = crop.date;
        document.getElementById('liveCropName').textContent = crop.name;
        
        // Populate variety selector
        cropVarietySelect.innerHTML = '';
        const varieties = cropVarieties[crop.name] || [];
        varieties.forEach(variety => {
            const option = document.createElement('option');
            option.value = variety;
            option.textContent = variety;
            option.selected = variety === crop.variety;
            cropVarietySelect.appendChild(option);
        });
        
        // Render parameters
        const paramsContainer = document.getElementById('paramsContainer');
        paramsContainer.innerHTML = '';
        
        const params = cropParams[crop.name] || [];
        params.forEach(param => {
            const paramItem = document.createElement('div');
            paramItem.className = 'param-item';
            
            let statusClass = '';
            let statusText = '';
            
            if(param.status === 'warning') {
                statusClass = 'status-warning';
                statusText = 'Atenție';
            } else if(param.status === 'danger') {
                statusClass = 'status-danger';
                statusText = 'Critic';
            } else {
                statusClass = 'status-normal';
                statusText = 'Normal';
            }
            
            paramItem.innerHTML = `
                <div class="param-name">
                    <i class="fas fa-${getParamIcon(param.name)}"></i>
                    ${param.name}
                </div>
                <div class="param-current">${param.value}</div>
                <div class="param-optimal">Optim: ${param.optimal}</div>
                <div class="param-status ${statusClass}">${statusText}</div>
            `;
            
            paramsContainer.appendChild(paramItem);
        });
        
        // Populate chart parameter selector
        const chartParamSelect = document.getElementById('chartParamSelect');
        chartParamSelect.innerHTML = '';
        
        params.forEach(param => {
            const option = document.createElement('option');
            option.value = param.name;
            option.textContent = param.name;
            chartParamSelect.appendChild(option);
        });
        
        // Initialize chart with first parameter
        if(params.length > 0) {
            updateChart(params[0].name, '7');
        }
        
        cropDetailsModal.classList.add('active');
    }
    
    // Update chart
    function updateChart(paramName, days) {
        const chartCanvas = document.getElementById('cropChart');
        const ctx = chartCanvas.getContext('2d');
        
        // In a real app, you would fetch this data from an API
        const daysCount = parseInt(days);
        const labels = [];
        const data = [];
        
        for(let i = daysCount; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('ro-RO'));
            
            // Generate random data for demo
            data.push(Math.floor(Math.random() * 20) + 10);
        }
        
        // If chart already exists, destroy it
        if(chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Create new chart
        chartCanvas.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: paramName,
                    data: data,
                    borderColor: 'rgba(76, 175, 80, 1)',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // Tab switching
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabLinks.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Update dashboard title
            document.getElementById('dashboardTitle').textContent = this.textContent.trim();
        });
    });
    
    // Crop selection change
    selectedCrop.addEventListener('change', function() {
        const cropCode = this.value;
        
        // Update selected crops
        userCrops.forEach(crop => {
            crop.selected = crop.code === cropCode;
        });
        
        // Update current selected crop
        currentSelectedCrop = userCrops.find(crop => crop.code === cropCode) || null;
        
        // Render dashboard
        if(currentSelectedCrop) {
            renderCropDashboard(currentSelectedCrop);
        } else {
            // Show welcome message if no crop selected
            cropDashboard.innerHTML = `
                <div class="welcome-message">
                    <h2>Bun venit în AgroMonitor!</h2>
                    <p>Selectează o recoltă pentru a începe monitorizarea.</p>
                    <img src="assets/images/farmer.svg" alt="Farmer" class="welcome-image">
                </div>
            `;
        }
    });
    
    // Add crop button
    addCropBtn.addEventListener('click', function() {
        addCropModal.classList.add('active');
    });
    
    // Add new crop button
    addNewCropBtn.addEventListener('click', function() {
        addCropModal.classList.add('active');
    });
    
    // Add crop form submission
    addCropForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cropCode = document.getElementById('newCropCode').value.trim();
        
        // Check if crop exists in all crops
        const crop = allCrops.find(c => c.code === cropCode);
        
        if(crop) {
            // Check if user already has this crop
            if(!userCrops.some(c => c.code === cropCode)) {
                // Add crop to user's crops
                userCrops.push({
                    code: crop.code,
                    name: crop.name,
                    variety: crop.variety,
                    date: crop.date,
                    selected: false
                });
                
                // Update UI
                renderCropSelector();
                renderMyCrops();
                
                // Close modal
                addCropModal.classList.remove('active');
                addCropForm.reset();
                
                // Show success message
                alert(`Recolta ${crop.name} a fost adăugată cu succes!`);
            } else {
                alert('Această recoltă este deja în lista ta.');
            }
        } else {
            alert('Codul recolei nu a fost găsit. Verificați codul și încercați din nou.');
        }
    });
    
    // View live button
    viewLiveBtn.addEventListener('click', function() {
        liveViewModal.classList.add('active');
        
        // In a real app, you would connect to a live feed here
        setTimeout(() => {
            document.querySelector('.live-feed .loading-spinner').style.display = 'none';
            document.querySelector('.live-feed').innerHTML = `
                <img src="https://via.placeholder.com/800x450?text=Live+Feed+Placeholder" alt="Live Feed" style="width:100%;height:100%;object-fit:cover;">
            `;
        }, 1500);
    });
    
    // Remove crop button
    removeCropBtn.addEventListener('click', function() {
        const cropName = document.getElementById('detailCropName').textContent;
        cropToDelete = cropName;
        confirmDeleteModal.classList.add('active');
    });
    
    // Confirm delete
    confirmDeleteBtn.addEventListener('click', function() {
        if(cropToDelete) {
            // Remove crop from user's list
            userCrops = userCrops.filter(crop => crop.name !== cropToDelete);
            
            // Update UI
            renderCropSelector();
            renderMyCrops();
            
            // Reset selected crop if it was the deleted one
            if(currentSelectedCrop && currentSelectedCrop.name === cropToDelete) {
                currentSelectedCrop = null;
                selectedCrop.value = '';
                renderCropDashboard(null);
            }
            
            // Close modals
            confirmDeleteModal.classList.remove('active');
            cropDetailsModal.classList.remove('active');
            
            // Show success message
            alert(`Recolta ${cropToDelete} a fost eliminată cu succes!`);
            
            cropToDelete = null;
        }
    });
    
    // Cancel delete
    cancelDeleteBtn.addEventListener('click', function() {
        confirmDeleteModal.classList.remove('active');
        cropToDelete = null;
    });
    
    // Chart parameter selection change
    document.getElementById('chartParamSelect').addEventListener('change', function() {
        const paramName = this.value;
        const period = document.getElementById('chartPeriodSelect').value;
        updateChart(paramName, period);
    });
    
    // Chart period selection change
    document.getElementById('chartPeriodSelect').addEventListener('change', function() {
        const paramName = document.getElementById('chartParamSelect').value;
        const period = this.value;
        updateChart(paramName, period);
    });
    
    // AI chat functionality
    sendAiMessage.addEventListener('click', sendAiMessageHandler);
    aiMessageInput.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            sendAiMessageHandler();
        }
    });
    
    function sendAiMessageHandler() {
        const message = aiMessageInput.value.trim();
        if(!message) return;
        
        // Add user message to chat
        addChatMessage(message, 'user');
        aiMessageInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "În general, plante precum grâul preferă soluri cu pH între 6.0 și 7.0. Dacă pH-ul este prea acid, poți adăuga var pentru a-l ajusta.",
                "Temperatura optimă pentru majoritatea cerealelor este între 18°C și 25°C. Temperaturile prea ridicate pot afecta creșterea plantelor.",
                "Umiditatea solului ar trebui să fie menținută între 60% și 70% pentru o creștere optimă. Verifică zilnic solul și ajustează irigația conform necesităților.",
                "Pentru a preveni bolile fungice, asigură-te că există o bună circulație a aerului între plante și evită udarea frunzelor.",
                "Recolta ar trebui să fie efectuată când bobul are un conținut de umiditate de aproximativ 14-16%. Acest lucru asigură o calitate optimă a recoltei."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage(randomResponse, 'ai');
        }, 1000);
    }
    
    function addChatMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="${sender}-avatar">
                <i class="fas fa-${sender === 'ai' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        aiChat.appendChild(messageDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }
    
    // Alerts filter change
    alertsFilter.addEventListener('change', function() {
        renderAlerts(this.value);
    });
    
    // Close modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Logout
    userLogoutBtn.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });
    
    // Initialize the dashboard
    initDashboard();
});
