// Verify admin role
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = '../../login.html';
    }
    
    // Load admin data
    loadAdminStats();
    
    // Setup event listeners
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('addUserBtn').addEventListener('click', () => {
        window.location.href = 'manage-users.html?action=add';
    });
});

async function loadAdminStats() {
    // Simulated API call
    const stats = {
        users: 24,
        parcels: 15,
        activeSensors: 42,
        alerts: 3
    };
    
    document.querySelector('.admin-stats').innerHTML = `
        <div class="stat-card">
            <h3>Utilizatori</h3>
            <p>${stats.users}</p>
        </div>
        <div class="stat-card">
            <h3>Parcele</h3>
            <p>${stats.parcels}</p>
        </div>
        <div class="stat-card">
            <h3>Senzori Activi</h3>
            <p>${stats.activeSensors}</p>
        </div>
        <div class="stat-card alert">
            <h3>Alerte</h3>
            <p>${stats.alerts}</p>
        </div>
    `;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../../login.html';
}
