const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter grid size (1-9): ", (input) => {
  const GRID_SIZE = parseInt(input);
  if (isNaN(GRID_SIZE) || GRID_SIZE < 1 || GRID_SIZE > 9) {
    console.log("Invalid input. Please enter a number between 1 and 9.");
    rl.close();
    return;
  }

  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  const regions = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  const solutions = [];

  function isValid(row, col, stars) {
    for (let [r, c] of stars) {
      if (r === row || c === col) return false;
      if (Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1) return false;
    }
    return true;
  }

  function backtrack(row = 0, stars = []) {
    if (stars.length === GRID_SIZE) {
      solutions.push([...stars]); //rest
      return;
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      if (isValid(row, col, stars)) {
        stars.push([row, col]);
        backtrack(row + 1, stars);
        stars.pop();
      } //recursion backtrack function use thay 6
    }
  }
  function placestar(solutions) {
    for (let [row, col] of solutions) {
      grid[row][col] = "⭐";
    }
    // grid.forEach((row) => console.log(row));
  }

  backtrack();

  function createregion(stars) {
    let regionIds = 1;

    for (let [r, c] of stars) {
      grid[r][c] = regionIds; //give id of each star
      regionIds++;
    }
    let checking = true; //while loop tya sudhi run thase jya sudhi grid full fill with region na thay
    while (checking) {
      checking = false; //stop after fullfilling
      // every cell ma check
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (grid[r][c] !== 0) {
            let region = grid[r][c]; //cell jode koi value 6 to then added to regions
            const directions = [
              [r - 1, c],
              [r + 1, c],
              [r, c - 1],
              [r, c + 1],
            ];
            // nearest row and column empty checking
            for (let [nearestr, nearestc] of directions) {
              if (
                nearestr >= 0 &&
                nearestr < GRID_SIZE &&
                nearestc >= 0 &&
                nearestc < GRID_SIZE &&
                grid[nearestr][nearestc] === 0
              ) {
                grid[nearestr][nearestc] = region;
                checking = true; //while loop ne running rakhva
              }
            }
          }
        }
      }
    }

    return grid;
  }

  function printGrid(grid, stars) {
    //final grid with region and star positions
    console.log("\nFinal Grid :");
    for (let r = 0; r < GRID_SIZE; r++) {
      let s = "";
      for (let c = 0; c < GRID_SIZE; c++) {
        if (stars.some(([sr, sc]) => sr === r && sc === c)) {
          //current cell ma koi star 6 ke nai check
          s += `⭐${grid[r][c]} `;
        } else {
          s += ` ${grid[r][c]}  `;
        }
      }
      console.log(s);
    }
  }

  console.log(`Total Solutions: ${solutions.length}`);
  solutions.forEach((sol) => {
    console.log(sol);
  });
  placestar(solutions[0]);

  if (solutions.length > 0) {
    const firstSolution = solutions[0];
    console.log("First Valid Solution:", firstSolution);
    const regionGrid = createregion(firstSolution);
    printGrid(regionGrid, firstSolution); //combine karva mate stras position with regiongrid
  } else {
    console.log("No valid solutions.");
  }

  // console.log(solutions);

  rl.close();
});
