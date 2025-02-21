let GRID_SIZE = 0;
let allSolutions = [];
let trackIndex = 0;

function isValid(row, col, stars) {
  for (let [r, c] of stars) {
    if (r === row || c === col) return false;
    if (Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1) return false;
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
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  let regionIds = 1;

  for (let [r, c] of solution) {
    grid[r][c] = regionIds;
    regionIds++;
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
  container.innerHTML = ""; //remove old grid replace new

  const gridElement = document.createElement("div");
  gridElement.className = "grid";
  gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 40px)`; //num and size of col ne repeat karse gridsize according

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");
      const regionNum = regionGrid[r][c];
      cell.className = `cell region-${regionNum}`; //assign class ex:region-1

      if (stars.some(([sr, sc]) => sr === r && sc === c)) {
        cell.innerText = "⭐";
      } else {
        cell.innerText = regionNum;
      }

      gridElement.appendChild(cell);
    }
  }
  container.appendChild(gridElement);
}

function generateGrid() {
  const sizeInput = document.getElementById("size");
  GRID_SIZE = parseInt(sizeInput.value); //without .value not get any value

  if (isNaN(GRID_SIZE) || GRID_SIZE < 1 || GRID_SIZE > 9) {
    alert("Enter a valid grid size between 1-9.");
    return;
  }

  allSolutions = [];
  trackIndex = 0; //solution ni index all

  backtrack(0, [], allSolutions); //row=0, empty stars[], starsolution

  if (allSolutions.length > 0) {
    const firstSolution = allSolutions[0];
    const regionGrid = createRegionGrid(firstSolution);
    displayGrid(regionGrid, firstSolution);
    document.getElementById("btn").style.display = "inline-block"; //when solution display instant geting the nextsolution button
  } else {
    alert("No valid solutions.");
  }
}

function generateNewSolution() {
  if (allSolutions.length === 0) return; // check solution 6e ke nai
  if (trackIndex === allSolutions.length - 1) {
    alert("All solutions completed");
    return;
  }

  trackIndex = trackIndex + 1; //ek solution display thaya p6i next ++
  const nextSolution = allSolutions[trackIndex]; //display next solution one by one
  const regionGrid = createRegionGrid(nextSolution);
  displayGrid(regionGrid, nextSolution);
}