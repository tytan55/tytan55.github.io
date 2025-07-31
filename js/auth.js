// Simulare date utilizatori
const users = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@agromonitor.ro', isAdmin: true },
    { id: 2, username: 'utilizator1', password: 'parola123', email: 'utilizator1@example.com', isAdmin: false },
    { id: 3, username: 'utilizator2', password: 'parola123', email: 'utilizator2@example.com', isAdmin: false }
];

// Simulare date recolte
const crops = [
    { id: 1, code: 'POR001', name: 'Porumb', variety: 'Soi Dulce', plantingDate: '2023-03-15', userId: 2 },
    { id: 2, code: 'GR001', name: 'Grâu', variety: 'Soi Toamnă', plantingDate: '2023-10-01', userId: 2 },
    { id: 3, code: 'SO001', name: 'Soia', variety: 'Soi Rezistent', plantingDate: '2023-04-20', userId: 3 }
];

// Verifică dacă utilizatorul este autentificat
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (currentUser) {
        if (isAdminPage && !currentUser.isAdmin) {
            window.location.href = 'dashboard.html';
        } else if (!isAdminPage && currentUser.isAdmin) {
            window.location.href = 'admin.html';
        }
    } else {
        window.location.href = 'index.html';
    }
}

// Autentificare
document.addEventListener('DOMContentLoaded', function() {
    // Pagina de login
    if (document.getElementById('loginBtn')) {
        document.getElementById('loginBtn').addEventListener('click', function() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                if (user.isAdmin) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                alert('Nume de utilizator sau parolă incorectă!');
            }
        });
        
        // Link pentru admin
        document.getElementById('adminLoginLink').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('username').value = 'admin';
            document.getElementById('password').value = 'admin123';
        });
    }
    
    // Buton de logout
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Verifică autentificarea pe paginile protejate
    if (!window.location.pathname.includes('index.html')) {
        checkAuth();
        
        // Afișează informațiile utilizatorului
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && document.getElementById('usernameDisplay')) {
            document.getElementById('usernameDisplay').textContent = currentUser.username;
            document.getElementById('userEmail').textContent = currentUser.email;
            document.getElementById('usernameShort').textContent = currentUser.username.charAt(0).toUpperCase();
        }
    }
});
