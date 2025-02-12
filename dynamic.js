const GRID_SIZE = 5;
const TOTAL_REGIONS = 5;
const regions = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0)
);
const regionMap = {};

function generateConnectedRegions() {
  let regionIds = [1, 2, 3, 4, 5];
  let visited = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(false)
  ); //visited box in layout store in this
  //  tracking intially false
  let queue = []; //region ne agal vadharva add karva mate
  let regionbox = {}; //box ne track karva mate store

  for (let region of regionIds) {
    let startRow = Math.floor(Math.random() * GRID_SIZE);
    let startCol = Math.floor(Math.random() * GRID_SIZE); //randomly row and colum starting ma check karse grid size according
    while (visited[startRow][startCol]) {
      startRow = Math.floor(Math.random() * GRID_SIZE);
      startCol = Math.floor(Math.random() * GRID_SIZE); //check karse ke row &col visited chhe ke nahi if not then move to new another
    }

    queue.push([startRow, startCol, region]); // queue ma store thse row and column je visited thay
    visited[startRow][startCol] = true;
    regions[startRow][startCol] = region;
    regionbox[region] = [[startRow, startCol]]; //koi valid row col malse tyare ene stire karavse regionbox inside
  }

  let directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], //edge case mate direction region kya expand thai ske
  ];

  while (queue.length > 0) {
    let [row, col, region] = queue.shift(); //shift method queue ma je first element hse ene remove karse

    for (let [dr, dc] of directions) {
      let newRow = row + dr;
      let newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < GRID_SIZE &&
        newCol >= 0 &&
        newCol < GRID_SIZE &&
        !visited[newRow][newCol]
      ) {
        visited[newRow][newCol] = true;
        regions[newRow][newCol] = region;
        queue.push([newRow, newCol, region]);
        regionbox[region].push([newRow, newCol]); //check the up down and side box if occured then already visited
        //add to the queue for further process
      }
    }
  }

  for (let region in regionbox) {
    regionMap[region] = regionbox[region]; //after completion of creating region this loop store all regions in regionmap
  }
}

generateConnectedRegions();

//overall logic :: first intialize array with false after that math.random generate row & col 5 starting postion
// after that check the expansion using BFS up,down,left,right all expansion complete the layout complete with region
//in between all the position with row column added into queue storing (FIFO)

function isValid(row, col, stars) {
  for (let [r, c] of stars) {
    if (r === row || c === col) return false;
    if (Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1) return false;
  }
  return true;
}

function placeStars(regionMap) {
  let stars = []; //star ni position store karva
  let placedRegions = new Set(); //track karva mate star ni  position

  for (let color in regionMap) {
    let positions = regionMap[color];
    for (let [row, col] of positions) {
      if (isValid(row, col, stars)) {
        stars.push([row, col]);
        regions[row][col] = "★";
        break; ///first loop for star placed after checking conditions
      }
    }
  }

  for (let color in regionMap) {
    if (!placedRegions.has(color)) {
      let positions = regionMap[color];
      for (let [row, col] of positions) {
        if (isValid(row, col, stars)) {
          stars.push([row, col]);
          regions[row][col] = "★";

          break; // star baki hoy ena mate aa loop 5 star place nai thata etle
        }
      }
    }
  }
}
placeStars(regionMap);
console.log(regions);
