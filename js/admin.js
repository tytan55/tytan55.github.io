document.addEventListener('DOMContentLoaded', function() {
    // Verifică dacă utilizatorul este admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!currentUser || !currentUser.isAdmin) {
        window.location.href = '../index.html';
        return;
    }
    
    // Elemente DOM
    const logoutBtn = document.getElementById('logoutBtn');
    const tabLinks = document.querySelectorAll('nav li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const addUserBtn = document.getElementById('addUserBtn');
    const addCropBtn = document.getElementById('addCropBtn');
    const userModal = document.getElementById('userModal');
    const cropModal = document.getElementById('cropModal');
    const confirmModal = document.getElementById('confirmModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const userForm = document.getElementById('userForm');
    const cropForm = document.getElementById('cropForm');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmAction = document.getElementById('confirmAction');
    const userSearch = document.getElementById('userSearch');
    const cropSearch = document.getElementById('cropSearch');
    const usersTableBody = document.getElementById('usersTableBody');
    const cropsGrid = document.getElementById('cropsGrid');
    const userCount = document.getElementById('userCount');
    const cropCount = document.getElementById('cropCount');
    const alertCount = document.getElementById('alertCount');
    const activityList = document.getElementById('activityList');
    
    // Date demo
    let users = [
        { id: 1, name: 'Ion Popescu', email: 'ion.popescu@example.com', date: '2023-05-15', password: 'parola1' },
        { id: 2, name: 'Maria Ionescu', email: 'maria.ionescu@example.com', date: '2023-06-20', password: 'parola2' },
        { id: 3, name: 'Andrei Georgescu', email: 'andrei.georgescu@example.com', date: '2023-07-10', password: 'parola3' }
    ];
    
    let crops = [
        { id: 1, name: 'Grâu', code: 'CR001', variety: 'Soi A', image: 'https://via.placeholder.com/300x200?text=Gr%C3%A2u' },
        { id: 2, name: 'Porumb', code: 'CR002', variety: 'Soi B', image: 'https://via.placeholder.com/300x200?text=Porumb' },
        { id: 3, name: 'Floarea soarelui', code: 'CR003', variety: 'Soi C', image: 'https://via.placeholder.com/300x200?text=Floarea+Soarelui' }
    ];
    
    let activities = [
        { id: 1, type: 'user', title: 'Utilizator nou', details: 'Andrei Georgescu s-a înregistrat', time: 'Acum 2 ore' },
        { id: 2, type: 'crop', title: 'Recoltă adăugată', details: 'Floarea soarelui a fost adăugată', time: 'Acum 1 zi' },
        { id: 3, type: 'alert', title: 'Alertă nouă', details: 'Temperatură ridicată la recolta de grâu', time: 'Acum 2 zile' }
    ];
    
    // Variabile pentru acțiuni
    let currentAction = null;
    let currentItemId = null;
    let confirmCallback = null;
    
    // Inițializare panou admin
    function initAdminPanel() {
        updateStats();
        renderUsersTable();
        renderCropsGrid();
        renderActivities();
        setupEventListeners();
    }
    
    // Actualizează statisticile
    function updateStats() {
        userCount.textContent = users.length;
        cropCount.textContent = crops.length;
        alertCount.textContent = activities.filter(a => a.type === 'alert').length;
    }
    
    // Randare tabel utilizatori
    function renderUsersTable(filter = '') {
        usersTableBody.innerHTML = '';
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(filter.toLowerCase()) || 
            user.email.toLowerCase().includes(filter.toLowerCase())
        );
        
        if(filteredUsers.length === 0) {
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="no-results">Nu s-au găsit utilizatori</td>
                </tr>
            `;
            return;
        }
        
        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    }
    
    // Randare grilă recolte
    function renderCropsGrid(filter = '') {
        cropsGrid.innerHTML = '';
        
        const filteredCrops = crops.filter(crop => 
            crop.name.toLowerCase().includes(filter.toLowerCase()) || 
            crop.code.toLowerCase().includes(filter.toLowerCase())
        );
        
        if(filteredCrops.length === 0) {
            cropsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-seedling"></i>
                    <p>Nu s-au găsit recolte</p>
                </div>
            `;
            return;
        }
        
        filteredCrops.forEach(crop => {
            const cropCard = document.createElement('div');
            cropCard.className = 'crop-card';
            cropCard.innerHTML = `
                <div class="crop-image" style="background-image: url('${crop.image}')"></div>
                <div class="crop-details">
                    <h3 class="crop-name">${crop.name}</h3>
                    <p class="crop-code">Cod: ${crop.code}</p>
                    <span class="crop-variety">${crop.variety}</span>
                    <div class="crop-actions">
                        <button class="action-btn edit-btn" data-id="${crop.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${crop.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cropsGrid.appendChild(cropCard);
        });
    }
    
    // Randare activități
    function renderActivities() {
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            let icon = '';
            let color = '';
            
            switch(activity.type) {
                case 'user':
                    icon = 'fa-user-plus';
                    color = 'var(--accent)';
                    break;
                case 'crop':
                    icon = 'fa-seedling';
                    color = 'var(--primary)';
                    break;
                case 'alert':
                    icon = 'fa-bell';
                    color = '#FFD166';
                    break;
            }
            
            activityItem.innerHTML = `
                <i class="fas ${icon}" style="background-color: ${color}"></i>
                <div class="activity-details">
                    <h4>${activity.title}</h4>
                    <p>${activity.details}</p>
                    <small>${activity.time}</small>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }
    
    // Adaugă utilizator
    function addUser(user) {
        user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        user.date = new Date().toISOString().split('T')[0];
        users.push(user);
        
        // Adaugă activitate
        activities.unshift({
            id: activities.length + 1,
            type: 'user',
            title: 'Utilizator nou',
            details: `${user.name} a fost adăugat`,
            time: 'Chiar acum'
        });
        
        updateStats();
        renderUsersTable();
        renderActivities();
    }
    
    // Actualizează utilizator
    function updateUser(user) {
        const index = users.findIndex(u => u.id === user.id);
        if(index !== -1) {
            users[index] = user;
            
            // Adaugă activitate
            activities.unshift({
                id: activities.length + 1,
                type: 'user',
                title: 'Utilizator actualizat',
                details: `${user.name} a fost actualizat`,
                time: 'Chiar acum'
            });
            
            renderUsersTable();
            renderActivities();
        }
    }
    
    // Șterge utilizator
    function deleteUser(id) {
        const user = users.find(u => u.id === id);
        if(user) {
            users = users.filter(u => u.id !== id);
            
            // Adaugă activitate
            activities.unshift({
                id: activities.length + 1,
                type: 'user',
                title: 'Utilizator șters',
                details: `${user.name} a fost șters`,
                time: 'Chiar acum'
            });
            
            updateStats();
            renderUsersTable();
            renderActivities();
        }
    }
    
    // Adaugă recoltă
    function addCrop(crop) {
        crop.id = crops.length > 0 ? Math.max(...crops.map(c => c.id)) + 1 : 1;
        crops.push(crop);
        
        // Adaugă activitate
        activities.unshift({
            id: activities.length + 1,
            type: 'crop',
            title: 'Recoltă nouă',
            details: `${crop.name} a fost adăugată`,
            time: 'Chiar acum'
        });
        
        updateStats();
        renderCropsGrid();
        renderActivities();
    }
    
    // Actualizează recoltă
    function updateCrop(crop) {
        const index = crops.findIndex(c => c.id === crop.id);
        if(index !== -1) {
            crops[index] = crop;
            
            // Adaugă activitate
            activities.unshift({
                id: activities.length + 1,
                type: 'crop',
                title: 'Recoltă actualizată',
                details: `${crop.name} a fost actualizată`,
                time: 'Chiar acum'
            });
            
            renderCropsGrid();
            renderActivities();
        }
    }
    
    // Șterge recoltă
    function deleteCrop(id) {
        const crop = crops.find(c => c.id === id);
        if(crop) {
            crops = crops.filter(c => c.id !== id);
            
            // Adaugă activitate
            activities.unshift({
                id: activities.length + 1,
                type: 'crop',
                title: 'Recoltă ștearsă',
                details: `${crop.name} a fost ștearsă`,
                time: 'Chiar acum'
            });
            
            updateStats();
            renderCropsGrid();
            renderActivities();
        }
    }
    
    // Afișează modal de confirmare
    function showConfirmModal(message, callback) {
        document.getElementById('confirmMessage').textContent = message;
        confirmModal.classList.add('active');
        confirmCallback = callback;
    }
    
    // Setare event listeners
    function setupEventListeners() {
        // Schimbare tab-uri
        tabLinks.forEach(link => {
            link.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Actualizează tab-ul activ
                tabLinks.forEach(tab => tab.classList.remove('active'));
                this.classList.add('active');
                
                // Actualizează conținutul vizibil
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Actualizează titlul paginii
                document.getElementById('pageTitle').textContent = this.querySelector('span').textContent;
            });
        });
        
        // Căutare utilizatori
        userSearch.addEventListener('input', function() {
            renderUsersTable(this.value);
        });
        
        // Căutare recolte
        cropSearch.addEventListener('input', function() {
            renderCropsGrid(this.value);
        });
        
        // Adăugare utilizator
        addUserBtn.addEventListener('click', function() {
            currentAction = 'add';
            document.getElementById('modalUserTitle').textContent = 'Adaugă Utilizator';
            document.getElementById('userForm').reset();
            userModal.classList.add('active');
        });
        
        // Adăugare recoltă
        addCropBtn.addEventListener('click', function() {
            currentAction = 'add';
            document.getElementById('modalCropTitle').textContent = 'Adaugă Recoltă';
            document.getElementById('cropForm').reset();
            cropModal.classList.add('active');
        });
        
        // Editare/ștergere utilizator (delegare evenimente)
        usersTableBody.addEventListener('click', function(e) {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            
            if(editBtn) {
                const userId = parseInt(editBtn.getAttribute('data-id'));
                editUser(userId);
            }
            
            if(deleteBtn) {
                const userId = parseInt(deleteBtn.getAttribute('data-id'));
                const user = users.find(u => u.id === userId);
                showConfirmModal(`Ești sigur că dorești să ștergi utilizatorul ${user.name}?`, () => deleteUser(userId));
            }
        });
        
        // Editare/ștergere recoltă (delegare evenimente)
        cropsGrid.addEventListener('click', function(e) {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            
            if(editBtn) {
                const cropId = parseInt(editBtn.getAttribute('data-id'));
                editCrop(cropId);
            }
            
            if(deleteBtn) {
                const cropId = parseInt(deleteBtn.getAttribute('data-id'));
                const crop = crops.find(c => c.id === cropId);
                showConfirmModal(`Ești sigur că dorești să ștergi recolta ${crop.name}?`, () => deleteCrop(cropId));
            }
        });
        
        // Închidere modale
        closeModals.forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // Confirmare acțiuni
        confirmAction.addEventListener('click', function() {
            if(confirmCallback) {
                confirmCallback();
                confirmModal.classList.remove('active');
                confirmCallback = null;
            }
        });
        
        confirmCancel.addEventListener('click', function() {
            confirmModal.classList.remove('active');
            confirmCallback = null;
        });
        
        // Trimitere formular utilizator
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = {
                id: document.getElementById('userId').value ? parseInt(document.getElementById('userId').value) : null,
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                password: document.getElementById('userPassword').value
            };
            
            if(currentAction === 'add') {
                addUser(user);
            } else {
                updateUser(user);
            }
            
            userModal.classList.remove('active');
        });
        
        // Trimitere formular recoltă
        cropForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const crop = {
                id: document.getElementById('cropId').value ? parseInt(document.getElementById('cropId').value) : null,
                name: document.getElementById('cropName').value,
                code: document.getElementById('cropCode').value,
                variety: document.getElementById('cropVariety').value,
                image: document.getElementById('cropImage').value || 'https://via.placeholder.com/300x200?text=Recolt%C4%83'
            };
            
            if(currentAction === 'add') {
                addCrop(crop);
            } else {
                updateCrop(crop);
            }
            
            cropModal.classList.remove('active');
        });
        
        // Deconectare
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = '../index.html';
        });
    }
    
    // Editare utilizator
    function editUser(id) {
        const user = users.find(u => u.id === id);
        if(user) {
            currentAction = 'edit';
            document.getElementById('modalUserTitle').textContent = 'Editează Utilizator';
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').value = user.password;
            userModal.classList.add('active');
        }
    }
    
    // Editare recoltă
    function editCrop(id) {
        const crop = crops.find(c => c.id === id);
        if(crop) {
            currentAction = 'edit';
            document.getElementById('modalCropTitle').textContent = 'Editează Recoltă';
            document.getElementById('cropId').value = crop.id;
            document.getElementById('cropName').value = crop.name;
            document.getElementById('cropCode').value = crop.code;
            document.getElementById('cropVariety').value = crop.variety;
            document.getElementById('cropImage').value = crop.image;
            cropModal.classList.add('active');
        }
    }
    
    // Inițializare panou admin
    initAdminPanel();
});
