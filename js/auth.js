// Sample user data (in production, use a server-side solution)
const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "viticultor", password: "parola123", role: "user" }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    // Validate credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store user session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        errorElement.textContent = 'Nume de utilizator sau parolă incorectă';
        errorElement.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
});

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('login.html')) return;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
});
