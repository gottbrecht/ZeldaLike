"use strict";
window.addEventListener("load", init);

//#region CONTROLLER
function init() {
  createView();
  requestAnimationFrame(tick);
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
}
const controls = {
  left: false,
  right: false,
  up: false,
  down: false,
};

function keyDown(event) {
  switch (event.key) {
    case "ArrowLeft": {
      controls.left = true;
      break;
    }
    case "ArrowRight": {
      controls.right = true;
      break;
    }
    case "ArrowUp": {
      controls.up = true;
      break;
    }
    case "ArrowDown": {
      controls.down = true;
      break;
    }
  }
}

function keyUp(event) {
  switch (event.key) {
    case "ArrowLeft": {
      controls.left = false;
      break;
    }
    case "ArrowRight": {
      controls.right = false;
      break;
    }
    case "ArrowUp": {
      controls.up = false;
      break;
    }
    case "ArrowDown": {
      controls.down = false;
      break;
    }
  }
}

let lastTimestamp = 0;
function tick(timestamp) {
  requestAnimationFrame(tick);
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;
  movePlayer(deltaTime);
  displayPlayerAtPosition();
  displayPlayerAnimation();
}
//#endregion

//#region VIEW

function createView() {
  const background = document.getElementById("background");
  background.innerHTML = ''; //clear tiles
  
  //Create the grid
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
     
      switch(tiles[row][col]) {
        case 1:
          tile.classList.add("grass");
          break;
        case 2:
          tile.classList.add("path");
          break;
        case 3:
          tile.classList.add("water");
          break;
        default:
          tile.classList.add("blocked");
          break;
      }
      background.appendChild(tile);
    }
  }
  
  background.style.setProperty("--GRID_COLS", GRID_COLS);
  background.style.setProperty("--GRID_ROWS", GRID_ROWS);
  background.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");
}

function updateView() {
  function updateView() {
    const tilesElements = document.querySelectorAll("#background .tile");
    tiles.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        const tileElement = tilesElements[rowIndex * GRID_COLS + colIndex];
        tileElement.className = "tile"; // Reset classes
        switch(tile) {
          case 1:
            tileElement.classList.add("walkable"); // Eller brug en relevant klasse for walkable tiles
            break;
          case 0:
            tileElement.classList.add("blocked"); // Klasse for ikke-walkable tiles
            break;
          case 2:
            tileElement.classList.add("item"); // Klasse for tiles med genstande
            break;
        }
      });
    });
  }
  
}

function displayPlayerAtPosition() {
  const visualPlayer = document.getElementById("player");
  visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

function displayPlayerAnimation() {
  const visualPlayer = document.getElementById("player");
  if (player.moving) {
    visualPlayer.classList = "animate";
    visualPlayer.classList.add(player.direction);
  } else {
    visualPlayer.classList.remove("animate");
  }
}

//#endregion

//#region MODEL
const player = {
  x: 0,
  y: 0,
  speed: 200,
  moving: false,
  direction: undefined,
};

const tiles = [
  [1, 1, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 3, 3, 0, 0],
  [0, 1, 0, 1, 0, 3, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 1, 1, 1, 2, 3, 2, 2, 0, 0, 0, 3, 3, 0, 0, 0],
  [0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 3, 3, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3, 0, 0, 0, 2, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 3, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const GRID_COLS = tiles[0].length;
const GRID_ROWS = tiles.length;
const TILE_SIZE = 32;

function getTileAtCoordinate({ row, col }) {
  return tiles[row][col];
}

function movePlayer(deltaTime) {
  player.moving = false;

  const newPos = {
    x: player.x,
    y: player.y,
  };

  if (controls.left) {
    player.moving = true;
    newPos.x -= player.speed * deltaTime;
    player.direction = "left";
  }
  if (controls.right) {
    player.moving = true;
    newPos.x += player.speed * deltaTime;
    player.direction = "right";
  }
  if (controls.up) {
    player.moving = true;
    newPos.y -= player.speed * deltaTime;
    player.direction = "up";
  }
  if (controls.down) {
    player.moving = true;
    newPos.y += player.speed * deltaTime;
    player.direction = "down";
  }

  if (canMoveTo(newPos)) {
    player.x = newPos.x;
    player.y = newPos.y;
  }
}
function canMoveTo(position) {
  const maxPosX = GRID_COLS * TILE_SIZE - TILE_SIZE;
  const maxPosY = GRID_ROWS * TILE_SIZE - TILE_SIZE;

  if (position.x < 0 || position.x > maxPosX || position.y < 0 || position.y > maxPosY) {
    return false;
  }

  const col = Math.floor(position.x / TILE_SIZE);
  const row = Math.floor(position.y / TILE_SIZE);

  const tileType = tiles[row][col];
  return tileType === 1;  // Assuming '1' is walkable
}

function checkForItem(position) {
  const col = Math.floor(position.x / TILE_SIZE);
  const row = Math.floor(position.y / TILE_SIZE);
  const tileType = tiles[row][col];

  if (tileType === 2) { // Antag at '2' repræsenterer en genstand
    collectItem({ row, col });
    tiles[row][col] = 1; // Skift tile til en almindelig gangbar tile
    updateView(); // Opdaterer visningen for at fjerne objektet fra skærmen
  }
}

function collectItem({ row, col }) {
  console.log(`Item collected at row ${row}, col ${col}`);
  // Tilføj funktionalitet til at tilføje genstanden til spillerens inventar her
}



/*
function canMoveTo(position) {
  if (
    position.x < 0 ||
    position.x > 470 ||
    position.y < 0 ||
    position.y > 330
  ) {
    player.moving = false;
    return false;
  }
  return true;
}*/
//#endregion
