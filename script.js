// app.js
const users = [
  { username: 'admin', password: 'admin123', isAdmin: true },
  { username: 'ionut', password: '1234', isAdmin: false, harvests: [] },
];

const harvests = [
  { code: 'REC123', name: 'Recolta 1', varieties: ['Merlot', 'Cabernet'], parameters: ['umiditate', 'temperatura', 'ph'] },
  { code: 'REC456', name: 'Recolta 2', varieties: ['Feteasca', 'Sauvignon'], parameters: ['aciditate', 'starea solului', 'umiditate'] },
];

let currentUser = null;

function $(id) {
  return document.getElementById(id);
}

function login(e) {
  e.preventDefault();
  const user = users.find(
    u => u.username === $('username').value && u.password === $('password').value
  );
  if (user) {
    currentUser = user;
    $('login-page').style.display = 'none';
    if (user.isAdmin) $('admin-panel').style.display = 'block';
    else {
      $('user-panel').style.display = 'block';
      $('current-user').textContent = user.username;
      loadUserHarvests();
    }
  } else {
    alert('Credențiale incorecte.');
  }
}

function loadUserHarvests() {
  $('harvest-selector').innerHTML = '';
  (currentUser.harvests || []).forEach(code => {
    const h = harvests.find(h => h.code === code);
    if (h) {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = h.name;
      $('harvest-selector').appendChild(opt);
    }
  });
  loadVarieties();
}

function addHarvestToUser() {
  const code = prompt('Introduce codul recoltei:');
  const h = harvests.find(h => h.code === code);
  if (h && !currentUser.harvests.includes(code)) {
    currentUser.harvests.push(code);
    loadUserHarvests();
  } else {
    alert('Cod invalid sau recolta deja adăugată.');
  }
}

function confirmDeleteHarvest() {
  $('delete-confirm').style.display = 'block';
}

function cancelDelete() {
  $('delete-confirm').style.display = 'none';
}

function deleteHarvestFromUser() {
  const selected = $('harvest-selector').value;
  currentUser.harvests = currentUser.harvests.filter(c => c !== selected);
  $('delete-confirm').style.display = 'none';
  loadUserHarvests();
}

function loadVarieties() {
  const code = $('harvest-selector').value;
  const h = harvests.find(h => h.code === code);
  $('plant-selector').innerHTML = '';
  if (h) {
    h.varieties.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      $('plant-selector').appendChild(opt);
    });
    displayParameters(h);
  }
}

function displayParameters(harvest) {
  const list = $('parameter-list');
  list.innerHTML = '';
  $('alerts').innerHTML = '';
  harvest.parameters.forEach(p => {
    const li = document.createElement('li');
    const value = (Math.random() * 10).toFixed(2);
    li.textContent = `${p}: ${value}`;
    list.appendChild(li);
    if (value < 3 || value > 8) {
      $('alerts').innerHTML += `<p>Avertisment: ${p} este ${value}, ar trebui să fie între 3-8.</p>`;
    }
  });
  drawChart();
}

function drawChart() {
  const ctx = $('harvest-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 7 }, (_, i) => `Ziua ${i + 1}`),
      datasets: [
        {
          label: 'Umiditate',
          data: Array.from({ length: 7 }, () => Math.random() * 10),
          borderColor: 'purple',
          fill: false
        },
        {
          label: 'Temperatură',
          data: Array.from({ length: 7 }, () => Math.random() * 30),
          borderColor: 'orange',
          fill: false
        }
      ]
    }
  });
}

function openLiveCamera() {
  window.open('https://example.com/camera', '_blank');
}

function openChat() {
  $('chat-box').style.display = 'block';
}

async function sendMessageToAI() {
  const msg = $('chat-input').value;
  if (!msg) return;
  $('chat-messages').innerHTML += `<div><strong>Tu:</strong> ${msg}</div>`;
  $('chat-input').value = '';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY_HERE'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: msg }]
    })
  });
  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'Eroare AI';
  $('chat-messages').innerHTML += `<div><strong>AI:</strong> ${reply}</div>`;
}

$('login-form').addEventListener('submit', login);
$('harvest-selector').addEventListener('change', loadVarieties);
$('chart-period').addEventListener('change', drawChart);

