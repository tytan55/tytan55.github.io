
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if(!loggedInUser || !loggedInUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    // DOM Elements
    const logoutBtn = document.getElementById('logoutBtn');
    const tabLinks = document.querySelectorAll('nav li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchInput = document.getElementById('adminSearch');
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
    const usersTableBody = document.getElementById('usersTableBody');
    const cropsTableBody = document.getElementById('cropsTableBody');
    
    // Test data
    let users = [
        { id: 1, name: 'Ion Popescu', email: 'ion.popescu@example.com', date: '2023-05-15' },
        { id: 2, name: 'Maria Ionescu', email: 'maria.ionescu@example.com', date: '2023-06-20' },
        { id: 3, name: 'Andrei Georgescu', email: 'andrei.georgescu@example.com', date: '2023-07-10' }
    ];
    
    let crops = [
        { code: 'CR001', name: 'Grâu', variety: 'Soi A', date: '2023-05-10', user: 'Ion Popescu' },
        { code: 'CR002', name: 'Porumb', variety: 'Soi B', date: '2023-06-05', user: 'Maria Ionescu' },
        { code: 'CR003', name: 'Floarea soarelui', variety: 'Soi C', date: '2023-07-15', user: 'Andrei Georgescu' }
    ];
    
    // Current action variables
    let currentAction = null;
    let currentItemId = null;
    
    // Initialize the admin panel
    function initAdminPanel() {
        renderUsersTable();
        renderCropsTable();
        initCharts();
    }
    
    // Render users table
    function renderUsersTable() {
        usersTableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${user.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-delete" data-id="${user.id}"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                editUser(userId);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                showConfirmModal('Ești sigur că dorești să ștergi acest utilizator?', () => deleteUser(userId));
            });
        });
    }
    
    // Render crops table
    function renderCropsTable() {
        cropsTableBody.innerHTML = '';
        
        crops.forEach(crop => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crop.code}</td>
                <td>${crop.name}</td>
                <td>${crop.variety}</td>
                <td>${crop.date}</td>
                <td>${crop.user}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-code="${crop.code}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-delete" data-code="${crop.code}"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            `;
            cropsTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const cropCode = this.getAttribute('data-code');
                editCrop(cropCode);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const cropCode = this.getAttribute('data-code');
                showConfirmModal('Ești sigur că dorești să ștergi această recoltă?', () => deleteCrop(cropCode));
            });
        });
    }
    
    // Initialize charts
    function initCharts() {
        // Users chart
        const usersCtx = document.getElementById('usersChart').getContext('2d');
        new Chart(usersCtx, {
            type: 'bar',
            data: {
                labels: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul'],
                datasets: [{
                    label: 'Utilizatori înregistrați',
                    data: [2, 5, 8, 12, 15, 18, 22],
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Crops chart
        const cropsCtx = document.getElementById('cropsChart').getContext('2d');
        new Chart(cropsCtx, {
            type: 'pie',
            data: {
                labels: ['Grâu', 'Porumb', 'Floarea soarelui', 'Rapiță', 'Orz'],
                datasets: [{
                    data: [15, 10, 8, 5, 7],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(33, 150, 243, 0.7)',
                        'rgba(156, 39, 176, 0.7)',
                        'rgba(244, 67, 54, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
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
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Search in users table
        if(document.getElementById('users-tab').classList.contains('active')) {
            const rows = usersTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }
        
        // Search in crops table
        if(document.getElementById('crops-tab').classList.contains('active')) {
            const rows = cropsTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }
    });
    
    // Add new user
    addUserBtn.addEventListener('click', function() {
        currentAction = 'add';
        document.getElementById('modalUserTitle').textContent = 'Adaugă Utilizator';
        document.getElementById('userForm').reset();
        userModal.classList.add('active');
    });
    
    // Edit user
    function editUser(userId) {
        currentAction = 'edit';
        currentItemId = userId;
        
        const user = users.find(u => u.id === userId);
        if(user) {
            document.getElementById('modalUserTitle').textContent = 'Editează Utilizator';
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPassword').value = 'password'; // In a real app, you wouldn't show the password
            
            userModal.classList.add('active');
        }
    }
    
    // Delete user
    function deleteUser(userId) {
        users = users.filter(u => u.id !== userId);
        renderUsersTable();
        confirmModal.classList.remove('active');
    }
    
    // Add new crop
    addCropBtn.addEventListener('click', function() {
        currentAction = 'add';
        document.getElementById('modalCropTitle').textContent = 'Adaugă Recoltă';
        document.getElementById('cropForm').reset();
        
        // Populate users dropdown
        const cropUserSelect = document.getElementById('cropUser');
        cropUserSelect.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            cropUserSelect.appendChild(option);
        });
        
        cropModal.classList.add('active');
    });
    
    // Edit crop
    function editCrop(cropCode) {
        currentAction = 'edit';
        currentItemId = cropCode;
        
        const crop = crops.find(c => c.code === cropCode);
        if(crop) {
            document.getElementById('modalCropTitle').textContent = 'Editează Recoltă';
            document.getElementById('cropId').value = crop.code;
            document.getElementById('cropCode').value = crop.code;
            document.getElementById('cropName').value = crop.name;
            document.getElementById('cropVariety').value = crop.variety;
            
            // Populate users dropdown
            const cropUserSelect = document.getElementById('cropUser');
            cropUserSelect.innerHTML = '';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                option.selected = user.name === crop.user;
                cropUserSelect.appendChild(option);
            });
            
            cropModal.classList.add('active');
        }
    }
    
    // Delete crop
    function deleteCrop(cropCode) {
        crops = crops.filter(c => c.code !== cropCode);
        renderCropsTable();
        confirmModal.classList.remove('active');
    }
    
    // Show confirm modal
    function showConfirmModal(message, callback) {
        document.getElementById('confirmMessage').textContent = message;
        confirmModal.classList.add('active');
        
        confirmAction.onclick = function() {
            callback();
            confirmAction.onclick = null;
        };
    }
    
    // Handle user form submission
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const userPassword = document.getElementById('userPassword').value;
        
        if(currentAction === 'add') {
            // Add new user
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name: userName,
                email: userEmail,
                date: new Date().toISOString().split('T')[0]
            };
            
            users.push(newUser);
        } else if(currentAction === 'edit') {
            // Update existing user
            const userIndex = users.findIndex(u => u.id === parseInt(userId));
            if(userIndex !== -1) {
                users[userIndex].name = userName;
                users[userIndex].email = userEmail;
            }
        }
        
        renderUsersTable();
        userModal.classList.remove('active');
    });
    
    // Handle crop form submission
    cropForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cropId = document.getElementById('cropId').value;
        const cropCode = document.getElementById('cropCode').value;
        const cropName = document.getElementById('cropName').value;
        const cropVariety = document.getElementById('cropVariety').value;
        const cropUserId = document.getElementById('cropUser').value;
        
        const selectedUser = users.find(u => u.id === parseInt(cropUserId));
        const userName = selectedUser ? selectedUser.name : '';
        
        if(currentAction === 'add') {
            // Add new crop
            const newCrop = {
                code: cropCode,
                name: cropName,
                variety: cropVariety,
                date: new Date().toISOString().split('T')[0],
                user: userName
            };
            
            crops.push(newCrop);
        } else if(currentAction === 'edit') {
            // Update existing crop
            const cropIndex = crops.findIndex(c => c.code === cropId);
            if(cropIndex !== -1) {
                crops[cropIndex].code = cropCode;
                crops[cropIndex].name = cropName;
                crops[cropIndex].variety = cropVariety;
                crops[cropIndex].user = userName;
            }
        }
        
        renderCropsTable();
        cropModal.classList.remove('active');
    });
    
    // Close modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Confirm modal actions
    confirmCancel.addEventListener('click', function() {
        confirmModal.classList.remove('active');
    });
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });
    
    // Initialize the admin panel
    initAdminPanel();
});
