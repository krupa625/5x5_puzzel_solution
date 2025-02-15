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

  const fruitSymbols = {
    1: "🍎",
    2: "🍊",
    3: "🍌",
    4: "🍇",
    5: "🍓",
    6: "🍍",
    7: "🍑",
    8: "🍒",
    9: "🍐",
  };

  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  let regionMap = {}; //region ne store karava track

  
  let regionNum = 1;  //represent karne ke liye region ko differently
  let visited = new Set(); ///kya visit thyu e cell ne store 

  function growRegion(r, c, regionNum, cells) {
    if (cells.length >= GRID_SIZE) return; //region ko expand kiya 

    const directions = [
      [0, 1],  // Right
      [1, 0],  // Down
      [0, -1], // Left
      [-1, 0], // Up  move karne ke liye cell ko
    ];

    for (let [dr, dc] of directions) {
      let nr = r + dr, nc = c + dc;     //region ko directionwise move karne ke liye
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && !visited.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        grid[nr][nc] = regionNum;
        cells.push([nr, nc]);
        growRegion(nr, nc, regionNum, cells);
        if (cells.length >= GRID_SIZE) return;
      }
    }
  }

  for (let r = 0; r < GRID_SIZE; r++) {   //travese every cell and if not visited then add to growregion
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) {
        grid[r][c] = regionNum;
        visited.add(`${r},${c}`);
        regionMap[regionNum] = [[r, c]];
        growRegion(r, c, regionNum, regionMap[regionNum]);
        regionNum++;
      }
    }
  }

  function isValidStar([r, c], stars) {
    for (let [sr, sc] of stars) {
      if (r === sr || c === sc) return false; // Same row/column
      if (Math.abs(r - sr) <= 1 && Math.abs(c - sc) <= 1) return false; // Adjacent
    }
    return true;
  }

  function backtrack(regionIndex, stars, usedRows, usedCols) {
    if (regionIndex > GRID_SIZE) return stars;
    if (!regionMap[regionIndex]) return null;

    for (let [r, c] of regionMap[regionIndex]) {
      if (usedRows.has(r) || usedCols.has(c)) continue;
      if (!isValidStar([r, c], stars)) continue;

      stars.push([r, c]);
      usedRows.add(r);
      usedCols.add(c);

      let result = backtrack(regionIndex + 1, stars, usedRows, usedCols);
      if (result) return result;

      stars.pop();
      usedRows.delete(r);
      usedCols.delete(c);
    }

    return null;
  }

  const starPositions = backtrack(1, [], new Set(), new Set()); // regionmap , storing array, row , colum of star

  if (!starPositions) {
    console.log("No valid star placement found.");
    rl.close();
    return;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      let region = grid[r][c];
      grid[r][c] = fruitSymbols[region];
    }
  }

  const starSymbol = "🤩";
  for (const [r, c] of starPositions) {
    grid[r][c] = `${starSymbol}${grid[r][c]}`;
  }

  console.log("Generated Grid with Connected Regions and Stars:");
  console.table(grid);
  rl.close();
});







//********************** *


// const GRID_SIZE = 5;
// const TOTAL_REGIONS = 5;
// const regions = Array.from({ length: GRID_SIZE }, () =>
//   Array(GRID_SIZE).fill(0)
// );
// const regionMap = {};

// function generateConnectedRegions() {
//   let regionIds = [1, 2, 3, 4, 5];
//   let visited = Array.from({ length: GRID_SIZE }, () =>
//     Array(GRID_SIZE).fill(false)
//   ); //visited box in layout store in this
//   //  tracking intially false
//   let queue = []; //region ne agal vadharva add karva mate
//   let regionbox = {}; //box ne track karva mate store

//   for (let region of regionIds) {
//     let startRow = Math.floor(Math.random() * GRID_SIZE);
//     let startCol = Math.floor(Math.random() * GRID_SIZE); //randomly row and colum starting ma check karse grid size according
//     while (visited[startRow][startCol]) {
//       startRow = Math.floor(Math.random() * GRID_SIZE);
//       startCol = Math.floor(Math.random() * GRID_SIZE); //check karse ke row &col visited chhe ke nahi if not then move to new another
//     }

//     queue.push([startRow, startCol, region]); // queue ma store thse row and column je visited thay
//     visited[startRow][startCol] = true;
//     regions[startRow][startCol] = region;
//     regionbox[region] = [[startRow, startCol]]; //koi valid row col malse tyare ene stire karavse regionbox inside
//   }

//   let directions = [
//     [-1, 0],
//     [1, 0],
//     [0, -1],
//     [0, 1], //edge case mate direction region kya expand thai ske
//   ];

//   while (queue.length > 0) {
//     let [row, col, region] = queue.shift(); //shift method queue ma je first element hse ene remove karse

//     for (let [dr, dc] of directions) {
//       let newRow = row + dr;
//       let newCol = col + dc;

//       if (
//         newRow >= 0 &&
//         newRow < GRID_SIZE &&
//         newCol >= 0 &&
//         newCol < GRID_SIZE &&
//         !visited[newRow][newCol]
//       ) {
//         visited[newRow][newCol] = true;
//         regions[newRow][newCol] = region;
//         queue.push([newRow, newCol, region]);
//         regionbox[region].push([newRow, newCol]); //check the up down and side box if occured then already visited
//         //add to the queue for further process
//       }
//     }
//   }

//   for (let region in regionbox) {
//     regionMap[region] = regionbox[region]; //after completion of creating region this loop store all regions in regionmap
//   }
// }

// generateConnectedRegions();

// //overall logic :: first intialize array with false after that math.random generate row & col 5 starting postion
// // after that check the expansion using BFS up,down,left,right all expansion complete the layout complete with region
// //in between all the position with row column added into queue storing (FIFO)

// function isValid(row, col, stars) {
//   for (let [r, c] of stars) {
//     if (r === row || c === col) return false;
//     if (Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1) return false;
//   }
//   return true;
// }

// function placeStars(regionMap) {
//   let stars = []; //star ni position store karva
//   let placedRegions = new Set(); //track karva mate star ni  position

//   for (let color in regionMap) {
//     let positions = regionMap[color];
//     for (let [row, col] of positions) {
//       if (isValid(row, col, stars)) {
//         stars.push([row, col]);
//         regions[row][col] = "★";
//         break; ///first loop for star placed after checking conditions
//       }
//     }
//   }

//   for (let color in regionMap) {
//     if (!placedRegions.has(color)) {
//       let positions = regionMap[color];
//       for (let [row, col] of positions) {
//         if (isValid(row, col, stars)) {
//           stars.push([row, col]);
//           regions[row][col] = "★";

//           break; // star baki hoy ena mate aa loop 5 star place nai thata etle
//         }
//       }
//     }
//   }
// }
// placeStars(regionMap);
// console.log(regions);
