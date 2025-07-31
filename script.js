document.addEventListener('DOMContentLoaded', function() {
    const app = {
        // Configurații inițiale
        config: {
            adminCredentials: {
                username: "admin",
                password: "admin123"
            },
            defaultParameters: {
                sugar: { min: 22, max: 25, unit: "°Brix" },
                acidity: { min: 5.5, max: 7.5, unit: "g/L" },
                ph: { min: 3.2, max: 3.8, unit: "" },
                temperature: { min: 18, max: 30, unit: "°C" },
                humidity: { min: 40, max: 80, unit: "%" },
                soil: { optimal: "Ușor umed" }
            }
        },

        // Starea aplicației
        state: {
            currentUser: null,
            currentWinery: null,
            currentPlant: null,
            currentTimeframe: 7,
            darkMode: false,
            users: [],
            wineries: [],
            chatHistory: []
        },

        // Elemente DOM
        elements: {},

        // Inițializare aplicație
        init: function() {
            this.initElements();
            this.loadData();
            this.bindEvents();
            this.checkAuthState();
            this.initTheme();
            this.renderLoginForm();
        },

        // Inițializare elemente DOM
        initElements: function() {
            this.elements = {
                // Elemente generale
                body: document.body,
                themeToggle: document.getElementById('theme-toggle'),
                
                // Formular login
                loginContainer: document.getElementById('login-container'),
                loginForm: document.getElementById('login-form'),
                usernameInput: document.getElementById('username-input'),
                passwordInput: document.getElementById('password-input'),
                loginError: document.getElementById('login-error'),
                adminLoginBtn: document.getElementById('admin-login-btn'),
                
                // Admin panel
                adminPanel: document.getElementById('admin-panel'),
                adminNav: document.getElementById('admin-nav'),
                userManagementSection: document.getElementById('user-management'),
                wineryManagementSection: document.getElementById('winery-management'),
                adminSearch: document.getElementById('admin-search'),
                adminLogoutBtn: document.getElementById('admin-logout-btn'),
                
                // User panel
                userPanel: document.getElementById('user-panel'),
                winerySelection: document.getElementById('winery-selection'),
                wineryGrid: document.getElementById('winery-grid'),
                addWineryForm: document.getElementById('add-winery-form'),
                wineryCodeInput: document.getElementById('winery-code-input'),
                
                // Monitorizare recoltă
                monitoringPanel: document.getElementById('monitoring-panel'),
                wineryHeader: document.getElementById('winery-header'),
                plantSelect: document.getElementById('plant-select'),
                parameterGrid: document.getElementById('parameter-grid'),
                chartContainer: document.getElementById('chart-container'),
                timeframeControls: document.getElementById('timeframe-controls'),
                liveCameraBtn: document.getElementById('live-camera-btn'),
                chatBtn: document.getElementById('chat-btn'),
                backToWineriesBtn: document.getElementById('back-to-wineries-btn'),
                
                // Modale
                modalOverlay: document.getElementById('modal-overlay'),
                confirmModal: document.getElementById('confirm-modal'),
                confirmMessage: document.getElementById('confirm-message'),
                confirmYesBtn: document.getElementById('confirm-yes'),
                confirmNoBtn: document.getElementById('confirm-no'),
                
                // Camera live
                cameraModal: document.getElementById('camera-modal'),
                cameraFeed: document.getElementById('camera-feed'),
                closeCameraBtn: document.getElementById('close-camera-btn'),
                
                // Chat AI
                chatModal: document.getElementById('chat-modal'),
                chatMessages: document.getElementById('chat-messages'),
                chatInput: document.getElementById('chat-input'),
                sendChatBtn: document.getElementById('send-chat-btn'),
                closeChatBtn: document.getElementById('close-chat-btn'),
                
                // Admin modals
                addEditUserModal: document.getElementById('add-edit-user-modal'),
                addEditWineryModal: document.getElementById('add-edit-winery-modal')
            };
        },

        // Încărcare date
        loadData: function() {
            // Încărcare date din localStorage sau folosire valori implicite
            this.state.users = JSON.parse(localStorage.getItem('wineAppUsers')) || this.getDefaultUsers();
            this.state.wineries = JSON.parse(localStorage.getItem('wineAppWineries')) || this.getDefaultWineries();
            this.state.chatHistory = JSON.parse(localStorage.getItem('wineAppChatHistory')) || [];
        },

        // Salvarea datelor
        saveData: function() {
            localStorage.setItem('wineAppUsers', JSON.stringify(this.state.users));
            localStorage.setItem('wineAppWineries', JSON.stringify(this.state.wineries));
            localStorage.setItem('wineAppChatHistory', JSON.stringify(this.state.chatHistory));
        },

        // Utilizatori impliciți
        getDefaultUsers: function() {
            return [
                {
                    id: 1,
                    username: "utilizator1",
                    password: "parola1",
                    wineries: [1, 2]
                },
                {
                    id: 2,
                    username: "utilizator2",
                    password: "parola2",
                    wineries: [3]
                }
            ];
        },

        // Recolte implicite
        getDefaultWineries: function() {
            return [
                {
                    id: 1,
                    code: "VIT2023001",
                    name: "Domeniul Viticole Exemplu",
                    location: "Dealu Mare",
                    plants: [
                        {
                            name: "Merlot",
                            parameters: this.generatePlantParameters()
                        },
                        {
                            name: "Cabernet Sauvignon",
                            parameters: this.generatePlantParameters()
                        }
                    ],
                    history: this.generateHistoryData()
                },
                {
                    id: 2,
                    code: "VIT2023002",
                    name: "Vinăria Regală",
                    location: "Murfatlar",
                    plants: [
                        {
                            name: "Chardonnay",
                            parameters: this.generatePlantParameters()
                        },
                        {
                            name: "Pinot Noir",
                            parameters: this.generatePlantParameters()
                        }
                    ],
                    history: this.generateHistoryData()
                }
            ];
        },

        // Generare parametri planta
        generatePlantParameters: function() {
            return {
                sugar: (Math.random() * 5 + 20).toFixed(1),
                acidity: (Math.random() * 3 + 5).toFixed(1),
                ph: (Math.random() * 1.5 + 3).toFixed(1),
                temperature: (Math.random() * 15 + 15).toFixed(1),
                humidity: (Math.random() * 50 + 30).toFixed(1),
                soil: ["Ușor umed", "Umed", "Uscat"][Math.floor(Math.random() * 3)]
            };
        },

        // Generare date istorice
        generateHistoryData: function() {
            const history = [];
            const today = new Date();
            
            for (let i = 90; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                history.push({
                    date: date.toISOString().split('T')[0],
                    parameters: {
                        sugar: (Math.random() * 5 + 20).toFixed(1),
                        acidity: (Math.random() * 3 + 5).toFixed(1),
                        ph: (Math.random() * 1.5 + 3).toFixed(1),
                        temperature: (Math.random() * 15 + 15).toFixed(1),
                        humidity: (Math.random() * 50 + 30).toFixed(1)
                    }
                });
            }
            
            return history;
        },

        // Verificare stare autentificare
        checkAuthState: function() {
            const rememberedUser = localStorage.getItem('rememberedUser');
            if (rememberedUser) {
                const user = JSON.parse(rememberedUser);
                const foundUser = this.state.users.find(u => u.username === user.username);
                if (foundUser) {
                    this.state.currentUser = foundUser;
                    this.renderWinerySelection();
                    return;
                }
            }
            this.renderLoginForm();
        },

        // Legare evenimente
        bindEvents: function() {
            // Login form
            this.elements.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            // Admin login
            this.elements.adminLoginBtn.addEventListener('click', () => {
                this.elements.loginForm.dataset.mode = 'admin';
                this.elements.passwordInput.style.display = 'block';
                this.elements.loginForm.querySelector('h2').textContent = 'Autentificare Administrator';
            });

            // Logout
            this.elements.adminLogoutBtn.addEventListener('click', () => {
                this.state.currentUser = null;
                localStorage.removeItem('rememberedUser');
                this.renderLoginForm();
            });

            // Buton înapoi la selecție recoltă
            this.elements.backToWineriesBtn.addEventListener('click', () => {
                this.renderWinerySelection();
            });

            // Adăugare recoltă utilizator
            this.elements.addWineryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddWinery();
            });

            // Buton confirmare modal
            this.elements.confirmYesBtn.addEventListener('click', () => {
                this.handleConfirm(true);
            });

            this.elements.confirmNoBtn.addEventListener('click', () => {
                this.handleConfirm(false);
            });

            // Butoane timeframe
            this.elements.timeframeControls.addEventListener('click', (e) => {
                if (e.target.classList.contains('timeframe-btn')) {
                    this.state.currentTimeframe = parseInt(e.target.dataset.days);
                    this.updateChart();
                }
            });

            // Buton camera live
            this.elements.liveCameraBtn.addEventListener('click', () => {
                this.showCameraModal();
            });

            // Buton chat
            this.elements.chatBtn.addEventListener('click', () => {
                this.showChatModal();
            });

            // Trimite mesaj chat
            this.elements.sendChatBtn.addEventListener('click', () => {
                this.handleChatMessage();
            });

            this.elements.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleChatMessage();
                }
            });
        },

        // Gestionare login
        handleLogin: function() {
            const username = this.elements.usernameInput.value.trim();
            const password = this.elements.passwordInput.value;
            const isAdminMode = this.elements.loginForm.dataset.mode === 'admin';

            // Resetare eroare
            this.elements.loginError.textContent = '';
            this.elements.loginError.style.display = 'none';

            if (isAdminMode) {
                // Verificare credentiale admin
                if (username === this.config.adminCredentials.username && 
                    password === this.config.adminCredentials.password) {
                    this.renderAdminPanel();
                } else {
                    this.showLoginError('Credențiale admin incorecte');
                }
            } else {
                // Verificare utilizator normal
                const user = this.state.users.find(u => u.username === username && u.password === password);
                if (user) {
                    this.state.currentUser = user;
                    localStorage.setItem('rememberedUser', JSON.stringify({ username: user.username }));
                    this.renderWinerySelection();
                } else {
                    this.showLoginError('Nume utilizator sau parolă incorectă');
                }
            }
        },

        // Afișare eroare login
        showLoginError: function(message) {
            this.elements.loginError.textContent = message;
            this.elements.loginError.style.display = 'block';
        },

        // Randare formular login
        renderLoginForm: function() {
            // Resetare formular
            this.elements.loginForm.reset();
            this.elements.loginForm.dataset.mode = '';
            this.elements.passwordInput.style.display = 'none';
            this.elements.loginForm.querySelector('h2').textContent = 'Autentificare Utilizator';
            
            // Ascunde toate panourile
            this.hideAllPanels();
            
            // Afișează formularul de login
            this.elements.loginContainer.style.display = 'block';
            this.elements.usernameInput.focus();
        },

        // Randare panou admin
        renderAdminPanel: function() {
            this.hideAllPanels();
            this.elements.adminPanel.style.display = 'block';
            this.renderUserManagement();
        },

        // Randare selecție recoltă utilizator
        renderWinerySelection: function() {
            if (!this.state.currentUser) return;
            
            this.hideAllPanels();
            this.elements.userPanel.style.display = 'block';
            this.elements.winerySelection.style.display = 'block';
            
            // Golire și repopulare grid recoltă
            this.elements.wineryGrid.innerHTML = '';
            
            this.state.currentUser.wineries.forEach(wineryId => {
                const winery = this.getWineryById(wineryId);
                if (!winery) return;
                
                const wineryCard = document.createElement('div');
                wineryCard.className = 'winery-card';
                wineryCard.innerHTML = `
                    <h3>${winery.name}</h3>
                    <p><strong>Cod:</strong> ${winery.code}</p>
                    <p><strong>Locație:</strong> ${winery.location}</p>
                    <div class="winery-plants">
                        ${winery.plants.map(p => `<span class="plant-tag">${p.name}</span>`).join('')}
                    </div>
                    <button class="select-winery-btn" data-id="${winery.id}">Selectează</button>
                    <button class="remove-winery-btn" data-id="${winery.id}">Elimină</button>
                `;
                
                wineryCard.querySelector('.select-winery-btn').addEventListener('click', (e) => {
                    this.selectWinery(winery.id);
                });
                
                wineryCard.querySelector('.remove-winery-btn').addEventListener('click', (e) => {
                    this.showConfirmModal(`Sigur doriți să eliminați recolta ${winery.name} din lista dvs.?`, {
                        type: 'remove-winery',
                        wineryId: winery.id
                    });
                });
                
                this.elements.wineryGrid.appendChild(wineryCard);
            });
        },

        // Randare panou monitorizare recoltă
        renderMonitoringPanel: function(wineryId) {
            const winery = this.getWineryById(wineryId);
            if (!winery) return;
            
            this.state.currentWinery = winery;
            this.state.currentPlant = winery.plants[0];
            
            this.hideAllPanels();
            this.elements.userPanel.style.display = 'block';
            this.elements.monitoringPanel.style.display = 'block';
            
            // Actualizare header
            this.elements.wineryHeader.innerHTML = `
                <h2>${winery.name}</h2>
                <p>Cod: ${winery.code} | Locație: ${winery.location}</p>
            `;
            
            // Populare selector plante
            this.elements.plantSelect.innerHTML = '';
            winery.plants.forEach(plant => {
                const option = document.createElement('option');
                option.value = plant.name.toLowerCase().replace(/\s+/g, '-');
                option.textContent = plant.name;
                this.elements.plantSelect.appendChild(option);
            });
            
            // Actualizare afișaj parametri
            this.updateParametersDisplay();
            
            // Inițializare grafic
            this.initChart();
        },

        // Actualizare afișaj parametri
        updateParametersDisplay: function() {
            if (!this.state.currentPlant) return;
            
            const params = this.state.currentPlant.parameters;
            this.elements.parameterGrid.innerHTML = '';
            
            // Adăugare carduri parametri
            this.addParameterCard('Zahăr', params.sugar, this.config.defaultParameters.sugar);
            this.addParameterCard('Aciditate', params.acidity, this.config.defaultParameters.acidity);
            this.addParameterCard('pH', params.ph, this.config.defaultParameters.ph);
            this.addParameterCard('Temperatură', params.temperature, this.config.defaultParameters.temperature);
            this.addParameterCard('Umiditate', params.humidity, this.config.defaultParameters.humidity);
            this.addParameterCard('Starea solului', params.soil, this.config.defaultParameters.soil, true);
            
            // Adăugare eveniment schimbare plantă
            this.elements.plantSelect.addEventListener('change', () => {
                const plantName = this.elements.plantSelect.options[this.elements.plantSelect.selectedIndex].text;
                this.state.currentPlant = this.state.currentWinery.plants.find(p => p.name === plantName);
                this.updateParametersDisplay();
                this.updateChart();
            });
        },

        // Adăugare card parametru
        addParameterCard: function(name, value, config, isSoil = false) {
            const card = document.createElement('div');
            card.className = 'parameter-card';
            
            let status = 'good';
            let statusText = 'Optim';
            
            if (isSoil) {
                status = value === config.optimal ? 'good' : 'warning';
                statusText = value === config.optimal ? 'Optim' : 'Necesită atenție';
            } else {
                const numValue = parseFloat(value);
                if (numValue < config.min || numValue > config.max) {
                    status = 'danger';
                    statusText = 'Necesită intervenție';
                }
            }
            
            card.innerHTML = `
                <div class="parameter-header">
                    <h3>${name}</h3>
                    <span class="status-badge ${status}">${statusText}</span>
                </div>
                <div class="parameter-value">${value} ${config.unit}</div>
                ${!isSoil ? `<div class="parameter-range">Interval optim: ${config.min}-${config.max}${config.unit}</div>` : ''}
                ${status !== 'good' ? `<div class="parameter-alert">${this.getParameterAlert(name, value, config)}</div>` : ''}
            `;
            
            this.elements.parameterGrid.appendChild(card);
        },

        // Mesaj alertă parametru
        getParameterAlert: function(name, value, config) {
            if (name === 'Starea solului') {
                return value === "Umed" ? "Solul este prea umed. Recomandare: reduceți irigația." : "Solul este prea uscat. Recomandare: creșteți irigația.";
            }
            
            const numValue = parseFloat(value);
            if (numValue < config.min) {
                return `Valoarea ${name.toLowerCase()} este sub optim. ${this.getParameterAdvice(name, 'low')}`;
            } else {
                return `Valoarea ${name.toLowerCase()} este peste optim. ${this.getParameterAdvice(name, 'high')}`;
            }
        },

        // Sfaturi parametri
        getParameterAdvice: function(param, state) {
            const advice = {
                'Zahăr': {
                    low: "Recoltarea poate fi amânată pentru a permite creșterea conținutului de zahăr.",
                    high: "Recoltarea poate fi accelerată pentru a preveni supra-maturarea."
                },
                'Aciditate': {
                    low: "Poate fi necesară corecția cu acid tartric.",
                    high: "Poate fi necesară corecția cu carbonat de calciu."
                },
                'pH': {
                    low: "Poate afecta fermentația. Monitorizați îndeaproape.",
                    high: "Poate crește riscul de oxidare. Monitorizați îndeaproape."
                },
                'Temperatură': {
                    low: "Fermentația poate fi prea lentă. Considerați măsuri de încălzire.",
                    high: "Riscul de dezvoltare a bacterii este crescut. Considerați măsuri de răcire."
                },
                'Umiditate': {
                    low: "Solul poate fi prea uscat. Considerați creșterea irigației.",
                    high: "Riscul de mucegai este crescut. Considerați reducerea irigației."
                }
            };
            
            return advice[param]?.[state] || "Monitorizați parametrul și consultați un specialist.";
        },

        // Inițializare grafic
        initChart: function() {
            if (this.chart) {
                this.chart.destroy();
            }
            
            const ctx = document.getElementById('harvest-chart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: this.getChartData(),
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Evoluția parametrilor - ${this.state.currentPlant.name}`,
                            font: {
                                size: 16
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        },

        // Actualizare grafic
        updateChart: function() {
            if (!this.chart) return;
            
            this.chart.data = this.getChartData();
            this.chart.update();
        },

        // Pregătire date grafic
        getChartData: function() {
            if (!this.state.currentWinery || !this.state.currentPlant) return { labels: [], datasets: [] };
            
            const history = this.state.currentWinery.history;
            const days = this.state.currentTimeframe;
            const filteredHistory = history.slice(-days);
            
            return {
                labels: filteredHistory.map(item => item.date),
                datasets: [
                    {
                        label: 'Zahăr (°Brix)',
                        data: filteredHistory.map(item => item.parameters.sugar),
                        borderColor: '#5E2B7A',
                        backgroundColor: 'rgba(94, 43, 122, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Aciditate (g/L)',
                        data: filteredHistory.map(item => item.parameters.acidity),
                        borderColor: '#D4A76A',
                        backgroundColor: 'rgba(212, 167, 106, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'pH',
                        data: filteredHistory.map(item => item.parameters.ph),
                        borderColor: '#8BC34A',
                        backgroundColor: 'rgba(139, 195, 74, 0.1)',
                        tension: 0.4
                    }
                ]
            };
        },

        // Gestionare adăugare recoltă utilizator
        handleAddWinery: function() {
            const code = this.elements.wineryCodeInput.value.trim();
            const winery = this.state.wineries.find(w => w.code === code);
            
            if (!winery) {
                alert('Cod recoltă invalid. Verificați codul sau contactați administratorul.');
                return;
            }
            
            if (this.state.currentUser.wineries.includes(winery.id)) {
                alert('Această recoltă este deja adăugată în contul dvs.');
                return;
            }
            
            this.state.currentUser.wineries.push(winery.id);
            this.saveData();
            this.renderWinerySelection();
            this.elements.addWineryForm.reset();
        },

        // Gestionare confirmare modal
        showConfirmModal: function(message, action) {
            this.elements.confirmMessage.textContent = message;
            this.elements.confirmModal.dataset.action = JSON.stringify(action);
            this.elements.modalOverlay.style.display = 'flex';
            this.elements.confirmModal.style.display = 'block';
        },

        handleConfirm: function(confirmed) {
            const action = JSON.parse(this.elements.confirmModal.dataset.action);
            
            this.elements.modalOverlay.style.display = 'none';
            this.elements.confirmModal.style.display = 'none';
            
            if (!confirmed) return;
            
            switch (action.type) {
                case 'remove-winery':
                    this.removeUserWinery(action.wineryId);
                    break;
                // Poți adăuga alte acțiuni aici
            }
        },

        // Eliminare recoltă din lista utilizatorului
        removeUserWinery: function(wineryId) {
            this.state.currentUser.wineries = this.state.currentUser.wineries.filter(id => id !== wineryId);
            this.saveData();
            this.renderWinerySelection();
        },

        // Selectare recoltă
        selectWinery: function(wineryId) {
            this.renderMonitoringPanel(wineryId);
        },

        // Afișare camera live
        showCameraModal: function() {
            // În implementare reală, aici s-ar conecta la un stream video real
            this.elements.cameraFeed.innerHTML = `
                <div class="camera-placeholder">
                    <p>Conectare la camera live pentru ${this.state.currentPlant.name}</p>
                    <div class="loading-animation"></div>
                </div>
            `;
            this.elements.modalOverlay.style.display = 'flex';
            this.elements.cameraModal.style.display = 'block';
        },

        // Afișare chat
        showChatModal: function() {
            this.loadChatHistory();
            this.elements.modalOverlay.style.display = 'flex';
            this.elements.chatModal.style.display = 'block';
            this.elements.chatInput.focus();
        },

        // Gestionare mesaj chat
        handleChatMessage: function() {
            const message = this.elements.chatInput.value.trim();
            if (!message) return;
            
            // Adaugă mesajul utilizatorului
            this.addChatMessage(message, 'user');
            this.elements.chatInput.value = '';
            
            // Simulează răspuns AI
            setTimeout(() => {
                const aiResponse = this.generateAIResponse(message);
                this.addChatMessage(aiResponse, 'ai');
            }, 500);
        },

        // Adăugare mesaj chat
        addChatMessage: function(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}-message`;
            messageDiv.textContent = message;
            this.elements.chatMessages.appendChild(messageDiv);
            
            // Salvare istoric
            this.state.chatHistory.push({
                sender,
                message,
                timestamp: new Date().toISOString()
            });
            this.saveData();
            
            // Scroll la ultimul mesaj
            this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        },

        // Generare răspuns AI
        generateAIResponse: function(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            // Verifică cuvinte cheie
            const plant = this.state.currentPlant;
            const winery = this.state.currentWinery;
            
            if (!plant || !winery) {
                return "Selectați mai întâi o plantă pentru a primi sfaturi specifice.";
            }
            
            // Răspunsuri parametri
            if (lowerMessage.includes('zahăr') || lowerMessage.includes('zahar')) {
                return this.getParameterResponse('zahăr', plant.parameters.sugar, this.config.defaultParameters.sugar);
            }
            
            if (lowerMessage.includes('aciditate') || lowerMessage.includes('acid')) {
                return this.getParameterResponse('aciditate', plant.parameters.acidity, this.config.defaultParameters.acidity);
            }
            
            if (lowerMessage.includes('ph')) {
                return this.getParameterResponse('pH', plant.parameters.ph, this.config.defaultParameters.ph);
            }
            
            if (lowerMessage.includes('temperatur')) {
                return this.getParameterResponse('temperatură', plant.parameters.temperature, this.config.defaultParameters.temperature);
            }
            
            if (lowerMessage.includes('umiditate')) {
                return this.getParameterResponse('umiditate', plant.parameters.humidity, this.config.defaultParameters.humidity);
            }
            
            if (lowerMessage.includes('sol') || lowerMessage.includes('pământ')) {
                return this.getParameterResponse('starea solului', plant.parameters.soil, this.config.defaultParameters.soil);
            }
            
            // Răspunsuri generale
            if (lowerMessage.includes('salut') || lowerMessage.includes('bună') || lowerMessage.includes('buna')) {
                return "Bună ziua! Cu ce vă pot ajuta astăzi?";
            }
            
            if (lowerMessage.includes('ajutor') || lowerMessage.includes('ajuta')) {
                return `Pot să vă ajut cu informații despre parametrii plantei ${plant.name}:\n- Zahăr\n- Aciditate\n- pH\n- Temperatură\n- Umiditate\n- Starea solului\n\nPuteți întreba despre oricare dintre aceștia.`;
            }
            
            if (lowerMessage.includes('recolt') || lowerMessage.includes('când') || lowerMessage.includes('cand')) {
                const sugar = parseFloat(plant.parameters.sugar);
                if (sugar < 22) {
                    return `Pe baza nivelului de zahăr (${plant.parameters.sugar}°Brix), recoltarea pentru ${plant.name} poate fi amânată încă ${Math.ceil((22 - sugar) * 2)} zile.`;
                } else if (sugar > 25) {
                    return `Pe baza nivelului de zahăr (${plant.parameters.sugar}°Brix), recoltarea pentru ${plant.name} ar trebui să înceapă cât mai curând posibil.`;
                } else {
                    return `Pe baza nivelului de zahăr (${plant.parameters.sugar}°Brix), ${plant.name} este gata pentru recoltare.`;
                }
            }
            
            // Răspuns implicit
            return `Pentru ${plant.name}, pot oferi informații despre:\n- Parametrii actuali\n- Recomandări de îngrijire\n- Prognoza recoltării\n\nPuteți întreba despre oricare dintre aceste aspecte.`;
        },

        // Răspuns parametru specific
        getParameterResponse: function(paramName, value, config) {
            const plant = this.state.currentPlant;
            
            if (paramName === 'starea solului') {
                return `Starea solului pentru ${plant.name} este ${value}. ${value === config.optimal ? 
                    'Este în stare optimă.' : 
                    'Recomandare: ' + (value === 'Umed' ? 'reduceți irigația.' : 'creșteți irigația.')}`;
            }
            
            const numValue = parseFloat(value);
            let status = '';
            let advice = '';
            
            if (numValue < config.min) {
                status = 'sub optim';
                advice = this.getParameterAdvice(paramName, 'low');
            } else if (numValue > config.max) {
                status = 'peste optim';
                advice = this.getParameterAdvice(paramName, 'high');
            } else {
                status = 'în limitele optime';
                advice = 'Nu sunt necesare intervenții.';
            }
            
            return `${paramName} pentru ${plant.name} este ${value}${config.unit} (${status}). ${advice}`;
        },

        // Încărcare istoric chat
        loadChatHistory: function() {
            this.elements.chatMessages.innerHTML = '';
            
            if (this.state.chatHistory.length === 0) {
                this.addChatMessage("Bună! Sunt asistentul tău viticol. Cu ce te pot ajuta astăzi?", 'ai');
                return;
            }
            
            this.state.chatHistory.forEach(msg => {
                this.addChatMessage(msg.message, msg.sender);
            });
        },

        // Ascundere toate panourile
        hideAllPanels: function() {
            this.elements.loginContainer.style.display = 'none';
            this.elements.adminPanel.style.display = 'none';
            this.elements.userPanel.style.display = 'none';
            this.elements.winerySelection.style.display = 'none';
            this.elements.monitoringPanel.style.display = 'none';
            this.elements.modalOverlay.style.display = 'none';
            this.elements.confirmModal.style.display = 'none';
            this.elements.cameraModal.style.display = 'none';
            this.elements.chatModal.style.display = 'none';
        },

        // Găsire recoltă după ID
        getWineryById: function(id) {
            return this.state.wineries.find(w => w.id === id);
        },

        // Inițializare temă
        initTheme: function() {
            const savedTheme = localStorage.getItem('wineAppTheme');
            if (savedTheme === 'dark') {
                this.toggleDarkMode(true);
            }
        },

        // Comutare dark/light mode
        toggleDarkMode: function(enable) {
            this.state.darkMode = enable;
            document.body.classList.toggle('dark-mode', enable);
            localStorage.setItem('wineAppTheme', enable ? 'dark' : 'light');
            
            // Actualizare iconiță
            this.elements.themeToggle.innerHTML = enable ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
    };

    // Inițializare aplicație
    app.init();
});
