document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isAdmin) return;
    
    // Populează tabelul cu utilizatori
    const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    
    // Simulare date utilizatori (de obicei ar veni dintr-un API)
    const users = [
        { id: 1, username: 'utilizator1', email: 'utilizator1@example.com', registrationDate: '2023-01-15' },
        { id: 2, username: 'utilizator2', email: 'utilizator2@example.com', registrationDate: '2023-02-20' },
        { id: 3, username: 'utilizator3', email: 'utilizator3@example.com', registrationDate: '2023-03-10' }
    ];
    
    users.forEach(user => {
        const row = usersTable.insertRow();
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.registrationDate}</td>
            <td>
                <button class="action-btn edit" data-id="${user.id}"><i class="fas fa-edit"></i> Editează</button>
                <button class="action-btn delete" data-id="${user.id}"><i class="fas fa-trash"></i> Șterge</button>
            </td>
        `;
    });
    
    // Populează tabelul cu recolte
    const cropsTable = document.getElementById('cropsTable').getElementsByTagName('tbody')[0];
    
    // Simulare date recolte
    const crops = [
        { code: 'POR001', name: 'Porumb', variety: 'Soi Dulce', plantingDate: '2023-03-15' },
        { code: 'GR001', name: 'Grâu', variety: 'Soi Toamnă', plantingDate: '2023-10-01' },
        { code: 'SO001', name: 'Soia', variety: 'Soi Rezistent', plantingDate: '2023-04-20' }
    ];
    
    crops.forEach(crop => {
        const row = cropsTable.insertRow();
        row.innerHTML = `
            <td>${crop.code}</td>
            <td>${crop.name}</td>
            <td>${crop.variety}</td>
            <td>${crop.plantingDate}</td>
            <td>
                <button class="action-btn edit" data-code="${crop.code}"><i class="fas fa-edit"></i> Editează</button>
                <button class="action-btn delete" data-code="${crop.code}"><i class="fas fa-trash"></i> Șterge</button>
            </td>
        `;
    });
    
    // Modale
    const addUserModal = document.getElementById('addUserModal');
    const addCropModal = document.getElementById('addCropModal');
    const confirmModal = document.getElementById('confirmModal');
    
    // Butoane pentru deschidere modal
    document.getElementById('addUserBtn').addEventListener('click', () => {
        addUserModal.style.display = 'flex';
    });
    
    document.getElementById('addCropBtn').addEventListener('click', () => {
        addCropModal.style.display = 'flex';
    });
    
    // Închidere modal
    const closeButtons = document.querySelectorAll('.close-modal, #confirmCancel');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            addUserModal.style.display = 'none';
            addCropModal.style.display = 'none';
            confirmModal.style.display = 'none';
        });
    });
    
    // Închidere modal la click în afara conținutului
    window.addEventListener('click', (e) => {
        if (e.target === addUserModal) addUserModal.style.display = 'none';
        if (e.target === addCropModal) addCropModal.style.display = 'none';
        if (e.target === confirmModal) confirmModal.style.display = 'none';
    });
    
    // Formular adăugare utilizator
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Utilizator adăugat cu succes!');
        this.reset();
        addUserModal.style.display = 'none';
    });
    
    // Formular adăugare recoltă
    document.getElementById('addCropForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Recoltă adăugată cu succes!');
        this.reset();
        addCropModal.style.display = 'none';
    });
    
    // Butoane de ștergere
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id') || this.getAttribute('data-code');
            const isUser = this.getAttribute('data-id') !== null;
            
            document.getElementById('confirmMessage').textContent = 
                `Sigur doriți să ștergeți ${isUser ? 'utilizatorul' : 'recolta'} cu ${isUser ? 'ID' : 'codul'} ${id}?`;
            
            confirmModal.style.display = 'flex';
            
            document.getElementById('confirmDelete').onclick = function() {
                alert(`${isUser ? 'Utilizatorul' : 'Recolta'} cu ${isUser ? 'ID' : 'codul'} ${id} a fost șters!`);
                confirmModal.style.display = 'none';
                // Aici ar trebui să fie apelul API pentru ștergere
            };
        });
    });
    
    // Căutare
    document.getElementById('adminSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Filtrare utilizatori
        Array.from(usersTable.rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
        
        // Filtrare recolte
        Array.from(cropsTable.rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
});
