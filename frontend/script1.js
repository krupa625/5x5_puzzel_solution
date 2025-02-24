let GRID_SIZE = 0;
let allSolutions = [];
let userStars = [];
let regionGrid = [];
let currentSolutionIndex = 0;

function isValid(row, col, stars) {
  for (let [r, c] of stars) {
    if (r === row || c === col) return false; // Same row or column
    if (Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1) return false; // Adjacent cells
  }
  return true;
}

function backtrack(row, stars, solutions) {
  if (row === GRID_SIZE) {
    solutions.push([...stars]);
    return;
  }

  for (let col = 0; col < GRID_SIZE; col++) {
    if (isValid(row, col, stars)) {
      stars.push([row, col]);
      backtrack(row + 1, stars, solutions);
      stars.pop();
    }
  }
}

function createRegionGrid(solution) {
  const grid = Array.from({ length: GRID_SIZE }, () =>Array(GRID_SIZE).fill(0));
  let regionIds = 1;

  for (let [r, c] of solution) {
    grid[r][c] = regionIds++;
  }

  let checking = true;
  while (checking) {
    checking = false;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] !== 0) {
          let region = grid[r][c];

          const directions = [
            [r - 1, c],
            [r + 1, c],
            [r, c - 1],
            [r, c + 1],
          ];

          for (let [nearestr, nearestc] of directions) {
            if (
              nearestr >= 0 &&
              nearestr < GRID_SIZE &&
              nearestc >= 0 &&
              nearestc < GRID_SIZE &&
              grid[nearestr][nearestc] === 0
            ) {
              grid[nearestr][nearestc] = region;
              checking = true;
            }
          }
        }
      }
    }
  }

  return grid;
}

function displayGrid(regionGrid, stars) {
  const container = document.getElementById("container");
  container.innerHTML = "";

  const gridElement = document.createElement("div");
  gridElement.className = "grid";
  gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 40px)`;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");
      const regionNum = regionGrid[r][c];
      cell.className = `cell region-${regionNum}`;
      cell.innerText = stars.some(([sr, sc]) => sr === r && sc === c)
        ? "⭐"
        : regionNum;

      cell.addEventListener("click", () => handleCellClick(r, c));
      gridElement.appendChild(cell);
    }
  }

  container.appendChild(gridElement);
  updateSolutionMessage(false); // msg not display jyare place karo star
}

function handleCellClick(row, col) {
  const messageDiv = document.getElementById("message");
  messageDiv.innerText = ""; //previous msg remove karva mate

  const clickedRegion = regionGrid[row][col]; //clicked region get karva mate

  if (userStars.some(([sr, sc]) => sr === row && sc === col)) {
    userStars = userStars.filter(([sr, sc]) => sr !== row || sc !== col); // star remove karva mate
  } else {
    // Same region check karva mate
    const starInSameRegion = userStars.some(
      ([sr, sc]) => regionGrid[sr][sc] === clickedRegion
    );

    if (starInSameRegion) {
      messageDiv.innerText = "❌ Invalid placement!";
      messageDiv.style.color = "red";
      return;
    }

    if (isValid(row, col, userStars)) {
      userStars.push([row, col]);
    } else {
      messageDiv.innerText = "❌ Invalid placement!";
      messageDiv.style.color = "red";
      return;
    }
  }

  displayGrid(regionGrid, userStars); //grid ma new star place karva mate
  // updateSolutionMessage(false);               //msg not display jyare place karo star

  if (userStars.length === GRID_SIZE) {
    displaySolutions();
  }
}

function generateGrid() {
  const sizeInput = document.getElementById("size");
  GRID_SIZE = parseInt(sizeInput.value);

  if (isNaN(GRID_SIZE) || GRID_SIZE < 1 || GRID_SIZE > 9) {
    alert("Enter a valid grid size between 1-9.");
    return;
  }

  userStars = [];
  allSolutions = [];
  currentSolutionIndex = 0;
  const messageDiv = document.getElementById("message");
  messageDiv.innerText = "";

  backtrack(0, [], allSolutions);

  if (allSolutions.length > 0) {
    regionGrid = createRegionGrid(allSolutions[0]);
    displayGrid(regionGrid, []);

    document.getElementById("btn").classList.add("show"); //starting ma jys sudhi display nai thay grid
    //  tya sudhi next solution button display thay after show class style
    document.getElementById("reset").classList.add("show");
  } else {
    alert("No valid solutions.");
  }
}

function generateNewSolution() {
  if (allSolutions.length === 0) return;

  currentSolutionIndex = (currentSolutionIndex + 1) % allSolutions.length;
  regionGrid = createRegionGrid(allSolutions[currentSolutionIndex]);
  userStars = []; //without userstar not place the star
  displayGrid(regionGrid, []);
  updateSolutionMessage(true);
}

function resetGrid() {
  userStars = [];
  displayGrid(regionGrid, []);
  const messageDiv = document.getElementById("message"); //msg na tag ne get karayu
  messageDiv.innerText = "";
}

function displaySolutions() {
  const messageDiv = document.getElementById("message");
  messageDiv.innerText = `🎉 All stars placed!`;
  messageDiv.style.color = "green";
}

function updateSolutionMessage(show) {
  //show ek boolean value 6 je true false check karse
  const messageDiv = document.getElementById("message");
  if (show && allSolutions.length > 0) {
    messageDiv.innerText = `📊 Viewing Solution ${currentSolutionIndex + 1}`;
    messageDiv.style.color = "blue";
  } else {
    messageDiv.innerText = "";
  }
}
