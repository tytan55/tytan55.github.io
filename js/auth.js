// Database simulation
const users = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "admin",
        name: "Administrator Sistem"
    },
    {
        id: 2,
        username: "user",
        password: "user123",
        role: "user",
        name: "Viticultor Exemplu"
    }
];

// DOM Elements
const roleButtons = document.querySelectorAll('.role-btn');
const loginForm = document.getElementById('loginForm');
let selectedRole = 'user';

// Role selection
roleButtons.forEach(button => {
    button.addEventListener('click', () => {
        roleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedRole = button.dataset.role;
    });
});

// Login handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === selectedRole
    );
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = user.role === 'admin' ? 
            'admin/dashboard.html' : 
            'parcels/list.html';
    } else {
        alert('Autentificare eșuată! Verifică datele.');
    }
});

// Check existing session
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('currentUser')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        window.location.href = user.role === 'admin' ? 
            'admin/dashboard.html' : 
            'parcels/list.html';
    }
});
