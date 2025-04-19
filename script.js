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

let fieldData = [[9, 9, 9], [9, 9, 9], [9, 9, 9]];

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
  addEvents();
  renderField();
  chooseSymbol();
});

mainReplayBtn.addEventListener("click", event => {
  setInitialState();
  addEvents();
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
  fieldData.forEach((row, rowIndex) => {
    array.push(row.join(""));
  });
  for (let i = 0; i < columnsNumber; i++) {
    let col = "";
    for (let j = 0; j < rowsNumber; j++) {
      col += fieldData[j][i];
    }
    array.push(col);
  }
  let col = "";
  for (let i = 0; i < columnsNumber; i++) {
    col += fieldData[i][i];
  }
  array.push(col);

  col = "";
  for (let i = 0; i < columnsNumber; i++) {
    for (let j = rowsNumber - 1 - i; j >= 0; j--) {
      col += fieldData[j][i];
      break;
    }
  }
  array.push(col);

  return array.includes(winCombo);
}

function showResult(winner) {
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
  } else if (winner === "user") {
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
  if (!checkWinCombinations(userFigure)) {
    if (isEmptyFieldsExists()) {
      setTurnText(computerFigure);
      setTimeout(computerSetFigure, 1000);
    } else {
      winner = "draw";
      showResult(winner, turns);
    }
  } else {
    winner = "user";
    showResult(winner, turns);
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
  if (!checkWinCombinations(computerFigure)) {
    if (isEmptyFieldsExists()) {
      setTimeout(() => {
        addEvents();
      }, 300);
    } else {
      winner = "draw";
      showResult(winner, turns);
    }
  } else {
    winner = "computer";
    showResult(winner, turns);
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
