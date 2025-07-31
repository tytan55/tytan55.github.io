document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const adminLoginLink = document.getElementById('adminLogin');
    const notification = document.getElementById('notification');
    
    // Test users data
    const users = [
        { username: 'user1', password: 'pass1', isAdmin: false },
        { username: 'admin', password: 'admin123', isAdmin: true }
    ];
    
    // Check if user is already logged in
    if(localStorage.getItem('loggedInUser')) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        redirectUser(user);
    }
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validate credentials
        const user = users.find(u => u.username === username && u.password === password);
        
        if(user) {
            // Save user to localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            
            // Show success message
            showNotification('Autentificare reușită!', 'success');
            
            // Redirect after delay
            setTimeout(() => {
                redirectUser(user);
            }, 1000);
        } else {
            showNotification('Nume de utilizator sau parolă incorectă!', 'error');
        }
    });
    
    // Handle admin login link
    adminLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('username').value = 'admin';
        document.getElementById('password').value = 'admin123';
    });
    
    // Function to show notification
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = 'notification ' + type;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // Function to redirect user based on role
    function redirectUser(user) {
        if(user.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
});
