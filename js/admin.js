document.addEventListener('DOMContentLoaded', function() {
    // Verify admin role
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Load stats
    loadAdminStats();
    
    // Load recent activity
    loadRecentActivity();
    
    // Set current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('ro-RO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Button event listeners
    document.getElementById('addUserBtn').addEventListener('click', () => {
        window.location.href = 'admin-users.html?action=add';
    });
    
    document.getElementById('addParcelBtn').addEventListener('click', () => {
        window.location.href = 'admin-parcels.html?action=add';
    });
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

async function loadAdminStats() {
    try {
        // In a real app, these would be API calls
        const [users, parcels, sensors] = await Promise.all([
            fetch('data/users.json').then(res => res.json()),
            fetch('data/parcels.json').then(res => res.json()),
            fetch('data/sensors.json').then(res => res.json())
        ]);
        
        document.getElementById('userCount').textContent = users.length;
        document.getElementById('parcelCount').textContent = parcels.length;
        document.getElementById('sensorCount').textContent = sensors.filter(s => s.active).length;
        
        // Count critical alerts
        const alerts = await fetch('data/alerts.json').then(res => res.json());
        document.getElementById('alertCount').textContent = alerts.filter(a => a.priority === 'high').length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadRecentActivity() {
    try {
        const activities = await fetch('data/activities.json').then(res => res.json());
        const activityList = document.getElementById('activityList');
        
        activityList.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    ${activity.description}
                </div>
                <div class="activity-time">
                    ${new Date(activity.timestamp).toLocaleTimeString('ro-RO')}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

function getActivityIcon(type) {
    const icons = {
        login: 'fa-sign-in-alt',
        logout: 'fa-sign-out-alt',
        create: 'fa-plus-circle',
        update: 'fa-edit',
        delete: 'fa-trash-alt',
        alert: 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-info-circle';
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
