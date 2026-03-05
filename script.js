const COLS = 20;
const ROWS = 20;
let currentTile = 'grass';
let isPainting = false;
let mapData = [];

const grid = document.getElementById('grid');

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