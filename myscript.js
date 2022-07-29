window.addEventListener("load", function (event) {
  "use strict";

  const numSeat = 12000;
  const colSize = 150;
  let rowSize = numSeat / colSize;
  const SPARSE = 1;
  const DENSE = 4;
  const REPRODUCE = 3;
  const RANDOM = false;
  const RANDOMPROB = 0.001;
  const midSection = document.getElementById("seating");
  const roundSpan = document.getElementById("round");
  const initialStates = //"";
    "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111100000000000011111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111100000000000011111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111100000000000011111111";
  //
  let states = [];
  let statesTemp;
  function createSeatLayout() {
    for (let r = 0; r < rowSize; r++) {
      states.push([]);
      for (let c = 0; c < colSize; c++) {
        // console.log(r, c);
        var initialState =
          initialStates[r * colSize + c] === undefined
            ? 0
            : Number(initialStates[r * colSize + c]);
        midSection.appendChild(createSeat(r, c, initialState));
        states[r].push(initialState);
      }
    }
    statesTemp = JSON.parse(JSON.stringify(states));
  }
  function createSeat(row, col, initialState) {
    let seat = document.createElement("div");
    seat.setAttribute("id", `${row}_${col}`);
    if (initialState === 0) seat.setAttribute("class", "a");
    else if (initialState === 1) seat.setAttribute("class", "s");
    // seat.innerText = `${row}_${col}`;
    seat.innerText = "";
    return seat;
  }

  // entry -> game round
  createSeatLayout();
  let round = 0;
  var itvid = this.setInterval(function () {
    roundSpan.innerText = `${round}`;
    round += 1;
    gameRound();
  }, 2000);

  // allow to click
  document.querySelectorAll("#seating div").forEach((element) => {
    element.addEventListener("click", (evt) => {
      evt.preventDefault();
      let [row, col] = evt.target.getAttribute("id").split("_").map(Number);
      if (evt.target.className != "s") {
        evt.target.className = "s";
        states[row][col] = 1;
        statesTemp[row][col] = 1;
      } else if (evt.target.className === "s") {
        evt.target.className = "a";
        states[row][col] = 0;
        statesTemp[row][col] = 0;
      }
    });
  });

  // core
  function gameRound() {
    // update state
    updateState();
    // render
    renderPage();
    // save temp to state
    states = JSON.parse(JSON.stringify(statesTemp));
  }

  function updateState() {
    for (let r = 0; r < rowSize; r++) {
      for (let c = 0; c < colSize; c++) {
        statesTemp[r][c] = checkState(r, c);
        if (RANDOM && Math.random() < RANDOMPROB) {
          statesTemp[r][c] = 1 - statesTemp[r][c];
        }
      }
    }
  }

  function checkState(r, c) {
    let survived = 0;
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (
          // i < 0 ||
          // j < 0 ||
          // i >= rowSize - 1 ||
          // j >= colSize - 1 ||
          i === r &&
          j === c
        ) {
          continue;
        }
        let it = i < 0 ? rowSize - 1 : i >= rowSize ? 0 : i;
        let jt = j < 0 ? colSize - 1 : j >= colSize ? 0 : j;
        // console.log(i, j);
        if (states[it][jt] === 1) survived++;
      }
    }
    if (states[r][c] === 1) {
      // console.log(`${r}_${c} survived: ${survived}`);
      // rule 1: dead if near-by live cell <= 1 (SPARSE)
      if (survived <= SPARSE) return 0;
      // rule 2: dead if near-by live cell >= 4 (DENSE)
      else if (survived >= DENSE) return 0;
      else return 1;
    } else {
      // rule 3: alive if near-by live cell == 3 (REPRODUCE)
      if (survived === REPRODUCE) return 1;
      else return 0;
    }
  }
  function renderPage() {
    for (let r = 0; r < rowSize; r++) {
      for (let c = 0; c < colSize; c++) {
        if (statesTemp[r][c] === 1) {
          document.getElementById(`${r}_${c}`).className = "s";
        } else {
          document.getElementById(`${r}_${c}`).className = "a";
        }
      }
    }
  }
});
