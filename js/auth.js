// Enhanced authentication flow
document.addEventListener('DOMContentLoaded', () => {
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    const roleButtons = document.querySelectorAll('.role-btn');
    
    let selectedRole = null;
    
    // Role selection
    roleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            selectedRole = e.currentTarget.dataset.role;
            
            // Highlight selected role
            roleButtons.forEach(btn => {
                btn.style.backgroundColor = 'white';
                btn.style.color = 'var(--primary)';
            });
            
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.color = 'white';
            
            // Show login form
            roleSelection.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');
        
        // In a real app, this would be an API call
        fetch('data/users.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => 
                    u.username === username && 
                    u.password === password && 
                    u.role === selectedRole
                );
                
                if (user) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
                } else {
                    showError(errorElement, 'Credențiale incorecte sau rol necorespunzător');
                }
            })
            .catch(() => {
                showError(errorElement, 'Eroare la conectare');
            });
    });
});

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}
