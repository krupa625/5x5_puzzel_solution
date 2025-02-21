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

  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  const userStars = [];
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
      solutions.push([...stars]);
      return;
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      if (isValid(row, col, stars)) {
        stars.push([row, col]);
        backtrack(row + 1, stars);
        stars.pop();
      }
    }
  }

  function printGrid(grid, stars) {
    console.log("\nCurrent Grid:");
    for (let r = 0; r < GRID_SIZE; r++) {
      let s = "";
      for (let c = 0; c < GRID_SIZE; c++) {
        if (stars.some(([sr, sc]) => sr === r && sc === c)) {
          s += "⭐ ";
        } else {
          s += "⬜ ";
        }
      }
      console.log(s);
    }
  }

  function placeUserStars() {
    if (userStars.length === GRID_SIZE) {
      console.log("\nAll stars placed successfully! Final Grid:");
      printGrid(grid, userStars);

      // Print total solutions after user finishes
      console.log(`\nTotal Solutions for Grid Size ${GRID_SIZE}: ${solutions.length}`);
      solutions.forEach((sol, idx) => console.log(`Solution ${idx + 1}:`, sol));

      rl.close();
      return;
    }

    rl.question(`\nPlace star ${userStars.length + 1}: Enter row (0-${GRID_SIZE - 1}): `, (rowInput) => {
      rl.question(`Enter column (0-${GRID_SIZE - 1}): `, (colInput) => {
        const row = parseInt(rowInput);
        const col = parseInt(colInput);
        if (
          isNaN(row) || isNaN(col) ||
          row < 0 || row >= GRID_SIZE ||
          col < 0 || col >= GRID_SIZE
        ) {
          console.log("Invalid input. Please enter valid row and column numbers.");
          placeUserStars();
          return;
        }

        if (!isValid(row, col, userStars)) {
          console.log("Invalid placement!");
          rl.question("Do you want to replace an existing star? (yes): ", (answer) => {
            if (answer === "yes") {
              rl.question("Enter the row of the star to replace: ", (replaceRowInput) => {
                rl.question("Enter the column of the star to replace: ", (replaceColInput) => {
                  const replaceRow = parseInt(replaceRowInput);
                  const replaceCol = parseInt(replaceColInput);

                  const index = userStars.findIndex(([sr, sc]) => sr === replaceRow && sc === replaceCol);
                  if (index !== -1) {
                    userStars.splice(index, 1); // Remove existing star
                    if (isValid(row, col, userStars)) {
                      userStars.push([row, col]);
                      console.log("Star replaced successfully.");
                    } else {
                      console.log("New placement is still invalid. Try again.");
                    }
                  } else {
                    console.log("No star found at the given position.");
                  }

                  printGrid(grid, userStars);
                  placeUserStars();
                });
              });
            } else {
              placeUserStars();
            }
          });
        } else {
          userStars.push([row, col]);
          console.log("Star placed successfully.");
          printGrid(grid, userStars);
          placeUserStars();
        }
      });
    });
  }

  printGrid(grid, userStars);
  backtrack();
  placeUserStars();
});
