// // One star per row → No row has more than one star.
// // One star per column → No column has more than one star.
// // Stars don’t touch each other diagonally or adjacently.
// // Each region can have only one star.
// // Stars should not be at the edges.

const regions = Array.from({ length: 5 }, () => Array(5).fill(0));

const regionMap = {
  Grey: [
    [1, 1],
    [0, 1],
    [0, 0],
    [1, 0],
  ],
  Red: [
    [0, 3],
    [1, 2],
    [0, 2],
  ],
  Purple: [
    [4, 4],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [3, 2],
    [3, 3],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
  ],
  Yellow: [
    [2, 3],
    [1, 3],
    [2, 2],
  ],
  Blue: [
    [3, 1],
    [2, 0],
    [3, 0],
    [2, 1],
    [2, 2],
    [3, 2],
  ],
};

function isValid(row, col, stars) {
  for (let [r, c] of stars) {
    if (r === row || c === col) //check row and colum same chhe ke nahi
        return false;
    if (Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1) 
        return false;//ye logic reference lekar kiya hai for check edges 
  }
  return true;
}

function placeStars(regionMap) {
  let stars = [];  //star ni position store karva
  let placedRegions = new Set(); //track karva mate star ni  position

  for (let color in regionMap) {
    let positions = regionMap[color];
    for (let [row, col] of positions) {
      if (isValid(row, col, stars)) {
        stars.push([row, col]);
        regions[row][col] = "★";
        placedRegions.add(color);
        break;  ///first loop for star placed after checking conditions
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

  for (let color in regionMap) {
    if (!placedRegions.has(color)) {
      let [row, col] = regionMap[color][0];
      stars.push([row, col]);
      regions[row][col] = "★";   //ek region ma star place nai hua isliye ye loop to solve
    }
  }
}

placeStars(regionMap);
console.log(regions);
