const COLS = 20;
const ROWS = 20;
let currentTile = 'grass';
let isPainting = false;
let mapData = [];



function vytvorGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  mapData = [];

  for (let r = 0; r < ROWS; r++) {
    mapData[r] = [];
    for (let c = 0; c < COLS; c++) {
      mapData[r][c] = 'grass';

      const cell = document.createElement('div');
      cell.className = 'cell grass';
      cell.dataset.r = r;
      cell.dataset.c = c;

      cell.addEventListener('mousedown', () => {
        isPainting = true;
        paint(r, c, cell);
      });

      cell.addEventListener('mouseenter', () => {
        if (isPainting) paint(r, c, cell);
      });

      grid.appendChild(cell);
    }
  }
}

document.addEventListener('mouseup', () => isPainting = false);

function paint(r, c, cell) {
  mapData[r][c] = currentTile;
  cell.className = 'cell ' + currentTile;
}

function selectTile(btn, type) {
  document.querySelectorAll('.tile-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentTile = type;
}



function showMenu() {
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('editor').classList.add('hidden');
  zobrazSeznam();
}

function showEditor() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('editor').classList.remove('hidden');
}

function novaMapaAEdtor() {
  document.getElementById('nazev-mapy').value = '';
  vytvorGrid();
  showEditor();
}



function ulozitMapu() {
  const nazev = document.getElementById('nazev-mapy').value.trim();
  if (!nazev) {
    alert('Zadej název mapy!');
    return;
  }

  const saves = nactiSaves();
  saves[nazev] = { cols: COLS, rows: ROWS, data: mapData };
  localStorage.setItem('ctb_saves', JSON.stringify(saves));
  alert('Mapa "' + nazev + '" uložena!');
}

function nactiSaves() {
  try {
    return JSON.parse(localStorage.getItem('ctb_saves')) || {};
  } catch {
    return {};
  }
}

function zobrazNacist() {
  zobrazSeznam();
}

function zobrazSeznam() {
  const saves = nactiSaves();
  const nazvy = Object.keys(saves);
  const container = document.getElementById('seznam-map');

  if (nazvy.length === 0) {
    container.innerHTML = '<p>Žádné uložené mapy.</p>';
    return;
  }

  container.innerHTML = '<h3>Uložené mapy:</h3>';

  nazvy.forEach(nazev => {
    const div = document.createElement('div');
    div.className = 'mapa-item';
    div.innerHTML = `
      <span>${nazev}</span>
      <button onclick="nacistMapu('${nazev}')">Načíst</button>
      <button onclick="smazatMapu('${nazev}')">Smazat</button>
    `;
    container.appendChild(div);
  });
}

function nacistMapu(nazev) {
  const saves = nactiSaves();
  const s = saves[nazev];
  if (!s) return;

  vytvorGrid();
  document.getElementById('nazev-mapy').value = nazev;


  for (let r = 0; r < s.rows; r++) {
    for (let c = 0; c < s.cols; c++) {
      mapData[r][c] = s.data[r][c];
      const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
      if (cell) cell.className = 'cell ' + s.data[r][c];
    }
  }

  showEditor();
}

function smazatMapu(nazev) {
  if (!confirm('Smazat mapu "' + nazev + '"?')) return;
  const saves = nactiSaves();
  delete saves[nazev];
  localStorage.setItem('ctb_saves', JSON.stringify(saves));
  zobrazSeznam();
}



function exportMapu() {
  const nazev = document.getElementById('nazev-mapy').value.trim() || 'mapa';
  const data = { nazev, cols: COLS, rows: ROWS, data: mapData };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nazev + '.json';
  a.click();
}

function importMapu(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const obj = JSON.parse(e.target.result);
      vytvorGrid();
      document.getElementById('nazev-mapy').value = obj.nazev || 'imported';

      for (let r = 0; r < obj.rows; r++) {
        for (let c = 0; c < obj.cols; c++) {
          mapData[r][c] = obj.data[r][c];
          const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
          if (cell) cell.className = 'cell ' + obj.data[r][c];
        }
      }

      showEditor();
    } catch {
      alert('Chybný soubor!');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}


vytvorGrid();
zobrazSeznam();