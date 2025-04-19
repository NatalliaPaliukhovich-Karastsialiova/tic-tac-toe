const container = document.querySelector(".container");
const fields = document.querySelectorAll(".field");
const result = document.querySelector(".result");
const popUpWrapper = document.querySelector(".pop-up__wrapper");
const popUpReplayBtn = document.querySelector(".pop-up__replay");
const mainReplayBtn = document.querySelector(".main__replay");
const resultText = document.querySelector(".text");
const turnsText = document.querySelector(".turns");
const settingsWrapper = document.querySelector(".settings__wrapper");
const crossBtn = document.querySelector(".cross");
const zeroBtn = document.querySelector(".zero");
const turnText = document.querySelector(".turn-text");
const winLine = document.querySelector('.win-line');

let fieldData = [[9, 9, 9], [9, 9, 9], [9, 9, 9]];

const cellSize = 100;
let userFigure = 1;
let computerFigure = 0;
let rowsNumber = 0;
let columnsNumber = 0;
let turns = 0;
let winner;
const bgAudio = new Audio();
const soundEffect = new Audio(
  "./assets/sounds/mixkit-retro-game-notification-212.wav"
);

zeroBtn.addEventListener("click", event => {
  userFigure = 0;
  computerFigure = 1;
  setTurnText();
  turnOnSound();
  setInitialState();
  renderField();
  chooseSymbol();
  setTimeout(() => {
    computerSetFigure();
  }, 1000);
});

crossBtn.addEventListener("click", event => {
  userFigure = 1;
  computerFigure = 0;
  setTurnText();
  turnOnSound();
  setInitialState();
  addEvents();
  renderField();
  chooseSymbol();
});

popUpWrapper.addEventListener("click", event => {
  if (event.target.classList.contains("pop-up__wrapper")) {
    popUpWrapper.classList.toggle("pop-up__wrapper-visible");
    chooseSymbol();
  }
});

popUpReplayBtn.addEventListener("click", event => {
  setInitialState();
  popUpWrapper.classList.toggle("pop-up__wrapper-visible");
  if(userFigure === 1) addEvents();
  else removeEvents();
  renderField();
  chooseSymbol();
});

mainReplayBtn.addEventListener("click", event => {
  setInitialState();
  if(userFigure === 1) addEvents();
  else removeEvents();
  renderField();
  chooseSymbol();
});

function setInitialState() {
  fieldData = [[9, 9, 9], [9, 9, 9], [9, 9, 9]];

  [...fields].forEach(field => {
    field.classList.remove("field-selected");
  });

  turns = 0;
}

function addEvents() {
  [...fields].forEach(field => {
    field.addEventListener("click", setFigure);
  });
}

function removeEvents() {
  [...fields].forEach(field => {
    field.removeEventListener("click", setFigure);
  });
}

function renderField() {
  let cells = container.children;
  fieldData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      let currentIndex = rowIndex * columnsNumber + cellIndex;
      let bgImage = "";
      if (cell === 0) bgImage = "url(./assets/img/zero.svg)";
      else if (cell === 1) bgImage = "url(./assets/img/cross.svg)";
      cells[currentIndex].style.backgroundImage = bgImage;
    });
  });
}

function isEmptyFieldsExists() {
  let flag = false;
  fieldData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell !== 1 && cell !== 0) {
        flag = true;
      }
    });
  });
  return flag;
}

function matrixSize() {
  let cells = container.children;
  rowsNumber = fieldData.length;
  if (fieldData[0]) columnsNumber = fieldData[0].length;
}

function checkPossibleTurn(figure) {
  let comboFounded = false;
  let emptySpaceExists = false;
  let row = 0;
  let column = 0;
  let num;

  for (let i = 0; i < rowsNumber; i++) {
    num = 0;
    emptySpaceExists = false;
    for (let j = 0; j < columnsNumber; j++) {
      if (fieldData[i][j] === figure) num++;
      else if (fieldData[i][j] === 9) {
        row = i;
        column = j;
        emptySpaceExists = true;
      }
    }
    if (num > 1 && emptySpaceExists) {
      comboFounded = true;
      break;
    }
  }

  if (!comboFounded) {
    for (let i = 0; i < columnsNumber; i++) {
      num = 0;
      emptySpaceExists = false;
      for (let j = 0; j < rowsNumber; j++) {
        if (fieldData[j][i] === figure) num++;
        else if (fieldData[j][i] === 9) {
          row = j;
          column = i;
          emptySpaceExists = true;
        }
      }
      if (num > 1 && emptySpaceExists) {
        comboFounded = true;
        break;
      }
    }
  }

  if (!comboFounded) {
    num = 0;
    emptySpaceExists = false;
    for (let i = 0; i < columnsNumber; i++) {
      if (fieldData[i][i] === figure) num++;
      else if (fieldData[i][i] === 9) {
        row = i;
        column = i;
        emptySpaceExists = true;
      }
    }
    if (num > 1 && emptySpaceExists) {
      comboFounded = true;
    }
  }

  if (!comboFounded) {
    num = 0;
    emptySpaceExists = false;
    for (let i = 0; i < columnsNumber; i++) {
      for (let j = rowsNumber - 1 - i; j >= 0; j--) {
        if (fieldData[j][i] === figure) num++;
        else if (fieldData[j][i] === 9) {
          row = j;
          column = i;
          emptySpaceExists = true;
        }
        break;
      }
    }
    if (num > 1 && emptySpaceExists) {
      comboFounded = true;
    }
  }

  if (comboFounded) return { i: row, j: column };
  return {};
}

function checkIfWinPossible(figure) {
  return checkPossibleTurn(figure);
}

function checkOppositeCombinations(figure) {
  let opponentFigure = figure === 0 ? 1 : 0;
  return checkPossibleTurn(opponentFigure);
}

function checkWinCombinations(figure) {
  const winCombo = `${figure}${figure}${figure}`;
  let flag = false;
  let array = [];
  let res = {
    isWin : false,
    startRow : 0,
    endRow : 0,
    startColumn : 0,
    endColumn : 0,
  }

  fieldData.forEach((row, rowIndex) => {
    const combo = row.join("");
    if(combo === winCombo) {
      res.startRow = rowIndex;
      res.endRow = rowIndex;
      res.startColumn = 0;
      res.endColumn = columnsNumber - 1;
    }
    array.push(combo);
  });

  for (let i = 0; i < columnsNumber; i++) {
    let combo = "";
    for (let j = 0; j < rowsNumber; j++) {
      combo += fieldData[j][i];
    }
    if(combo === winCombo) {
      res.startRow = 0;
      res.endRow = rowsNumber - 1;
      res.startColumn = i;
      res.endColumn = i;
    }
    array.push(combo);
  }

  let col = "";
  for (let i = 0; i < columnsNumber; i++) {
    col += fieldData[i][i];
  }
  if(col === winCombo) {
    res.startRow = 0;
    res.endRow = rowsNumber - 1;
    res.startColumn = 0;
    res.endColumn = columnsNumber - 1;
  }
  array.push(col);

  col = "";
  for (let i = 0; i < columnsNumber; i++) {
    for (let j = rowsNumber - 1 - i; j >= 0; j--) {
      col += fieldData[j][i];
      break;
    }
  }
  if(col === winCombo) {
    res.startRow = rowsNumber - 1;
    res.endRow = 0;
    res.startColumn = 0;
    res.endColumn = columnsNumber - 1;
  }
  array.push(col);
  res.isWin = array.includes(winCombo);
  return res;
}

function showResult(winner, turns, winCoordinates) {
  if(winner !== "draw") accentWinCombo(winCoordinates);
  setTimeout(() => showResultPopUp(winner, turns),2000);
}

function accentWinCombo(winCoordinates) {
  const x1 = winCoordinates.startColumn * cellSize  + cellSize / 2;
  const y1 = winCoordinates.startRow * cellSize  + cellSize / 2;
  const x2 = winCoordinates.endColumn * cellSize  + cellSize / 2;
  const y2 = winCoordinates.endRow * cellSize  + cellSize / 2;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  winLine.style.width = `${length}px`;
  winLine.style.left = `${x1}px`;
  winLine.style.top = `${y1}px`;
  winLine.style.transform = `rotate(${angle}deg)`;
  winLine.style.display = 'block';
  console.log(winCoordinates);
}

function showResultPopUp(winner, turns) {
  let text = "";
  let symbol = "";
  let link = "";
  winner === "draw"
    ? (text = "No winner this time!")
    : (text = " is the winner!");
  if (winner === "computer") {
    if (computerFigure === 0) {
      symbol = `url(./assets/img/zero.svg)`;
      link = `./assets/img/zero.svg`;
    } else {
      symbol = `url(./assets/img/cross.svg)`;
      link = `./assets/img/cross.svg`;
    }
  } else if (winner === "player") {
    if (userFigure === 0) {
      symbol = `url(./assets/img/zero.svg)`;
      link = `./assets/img/zero.svg`;
    } else {
      symbol = `url(./assets/img/cross.svg)`;
      link = `./assets/img/cross.svg`;
    }
  }
  result.classList.remove("visible-block");
  if (symbol) {
    result.style.backgroundImage = symbol;
    result.classList.add("visible-block");
  }
  turnsText.textContent = turns;
  resultText.textContent = text;
  popUpWrapper.classList.toggle("pop-up__wrapper-visible");
  saveGameResult(winner, link, turns);
  renderLeaderboard();
  winLine.style.display = 'none';
}

function setFigure(event) {
  removeEvents();
  turns++;
  let selectedCell = parseInt(event.target.id);
  event.target.classList.add("field-selected");
  let currentRow = Math.ceil(selectedCell / columnsNumber) - 1;
  let currentColumn = selectedCell - currentRow * columnsNumber - 1;
  fieldData[currentRow][currentColumn] = userFigure;
  renderField();
  playSoundEffect();
  let checkWinCombinationsRes = checkWinCombinations(userFigure);
  if (!checkWinCombinationsRes.isWin) {
    if (isEmptyFieldsExists()) {
      setTurnText(computerFigure);
      setTimeout(computerSetFigure, 1000);
    } else {
      winner = "draw";
      showResult(winner, turns, checkWinCombinationsRes);
    }
  } else {
    winner = "player";
    showResult(winner, turns, checkWinCombinationsRes);
  }
}

function computerSetFigure(event) {
  let i, j;
  let indexes = checkIfWinPossible(computerFigure);
  if (Object.keys(indexes).length !== 0) {
    i = indexes.i;
    j = indexes.j;
  } else {
    indexes = checkOppositeCombinations(computerFigure);
    if (Object.keys(indexes).length !== 0) {
      i = indexes.i;
      j = indexes.j;
    }
  }

  turns++;
  flag = true;
  let cells = container.children;
  while (flag && isEmptyFieldsExists()) {
    if (Object.keys(indexes).length === 0) {
      i = Math.floor(Math.random() * rowsNumber);
      j = Math.floor(Math.random() * columnsNumber);
    }
    if (fieldData[i][j] !== 1 && fieldData[i][j] !== 0) {
      fieldData[i][j] = computerFigure;
      let currentIndex = i * columnsNumber + j;
      cells[currentIndex].classList.add("field-selected");
      flag = false;
    }
  }
  renderField();
  playSoundEffect();
  setTurnText(userFigure);
  let checkWinCombinationsRes = checkWinCombinations(computerFigure);
  if (!checkWinCombinationsRes.isWin) {
    if (isEmptyFieldsExists()) {
      setTimeout(() => {
        addEvents();
      }, 300);
    } else {
      winner = "draw";
      showResult(winner, turns, checkWinCombinationsRes);
    }
  } else {
    winner = "computer";
    showResult(winner, turns, checkWinCombinationsRes);
  }
}

function saveGameResult(winner, symbol, moves) {
  const gameResult = {
    winner,
    symbol,
    moves,
    timestamp: new Date().toISOString()
  };
  let history = JSON.parse(localStorage.getItem("TicTacHistory")) || [];
  history.unshift(gameResult);
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem("TicTacHistory", JSON.stringify(history));
}

function renderLeaderboard() {
  const history = JSON.parse(localStorage.getItem("TicTacHistory")) || [];
  const tableBody = document.querySelector("#history tbody");
  tableBody.innerHTML = "";
  history.forEach((game, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${game.winner}</td>`;
    if (game.symbol) row.innerHTML += `<td><img src="${game.symbol}"></td>`;
    else row.innerHTML += `<td></td>`;

    row.innerHTML += `<td>${game.moves}</td>
      <td>${new Date(game.timestamp).toLocaleString()}</td>
    `;

    tableBody.appendChild(row);
  });
}

function turnOnSound() {
  bgAudio.src = "./assets/sounds/bg_sound.mp3";
  bgAudio.loop = true;
  bgAudio.volume = 0.2;
  bgAudio.play();
}

function chooseSymbol() {
  settingsWrapper.classList.toggle("visible-flex");
}

function playSoundEffect() {
  soundEffect.currentTime = 0;
  soundEffect.volume = 0.15;
  soundEffect.play();
}

function setTurnText(symbol) {
  const symbolText = symbol === 0 ? "0" : "X";
  turnText.textContent = `Player ${symbolText}'s Turn`;
}

function init() {
  chooseSymbol();
  matrixSize();
}

init();
