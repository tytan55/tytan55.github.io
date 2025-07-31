document.addEventListener('DOMContentLoaded', function() {
    // Elemente DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');
    const adminLoginLink = document.getElementById('adminLogin');
    
    // Schimbare între login și register
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Actualizează tab-urile active
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizează formularele vizibile
            forms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabId}Form`).classList.add('active');
        });
    });
    
    // Date utilizatori (în aplicația reală, acestea ar fi stocate pe server)
    let users = [
        { username: 'copil1', email: 'copil1@example.com', password: 'parola1', isAdmin: false },
        { username: 'admin', email: 'admin@example.com', password: 'admin123', isAdmin: true }
    ];
    
    // Autentificare
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Verifică credențialele
        const user = users.find(u => u.username === username && u.password === password);
        
        if(user) {
            // Salvează utilizatorul autentificat
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirecționează către dashboard
            window.location.href = user.isAdmin ? 'admin.html' : 'dashboard.html';
        } else {
            showError('Nume de utilizator sau parolă incorectă!');
        }
    });
    
    // Înregistrare
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        // Verifică dacă utilizatorul există deja
        const userExists = users.some(u => u.username === username || u.email === email);
        
        if(userExists) {
            showError('Numele de utilizator sau email-ul este deja folosit!');
            return;
        }
        
        // Adaugă noul utilizator
        const newUser = {
            username,
            email,
            password,
            isAdmin: false
        };
        
        users.push(newUser);
        
        // Salvează utilizatorul autentificat
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Redirecționează către dashboard
        window.location.href = 'dashboard.html';
    });
    
    // Link pentru admin
    adminLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('username').value = 'admin';
        document.getElementById('password').value = 'admin123';
    });
    
    // Funcție pentru afișarea erorilor
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Adaugă mesajul de eroare
        const activeForm = document.querySelector('.form.active');
        activeForm.appendChild(errorDiv);
        
        // Elimină mesajul după 3 secunde
        setTimeout(() => {
            errorDiv.classList.add('fade-out');
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }
});
