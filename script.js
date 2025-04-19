const container = document.querySelector(".container");
const fields = document.querySelectorAll(".field");
const result = document.querySelector(".result");
const popUpWrapper = document.querySelector(".pop-up__wrapper");
const popUpReplayBtn = document.querySelector(".pop-up__replay");
const mainReplayBtn = document.querySelector(".main__replay");

let fieldData = [[9, 9, 9],
                 [9, 9, 9],
                 [9, 9, 9]];

let userFigure = 1;
let computerFigure = 0;
let rowsNumber = 0;
let columnsNumber = 0;
let turns = 0;

popUpWrapper.addEventListener('click', (event) => {
  if(event.target.classList.contains('pop-up__wrapper')){
    popUpWrapper.classList.toggle('pop-up__wrapper-visible');
  }
})

popUpReplayBtn.addEventListener('click', (event) => {
  setInitialState();
  popUpWrapper.classList.toggle('pop-up__wrapper-visible');
  addEvents();
  renderField();
})

mainReplayBtn.addEventListener('click', (event) => {
  setInitialState();
  addEvents();
  renderField();
})

function setInitialState() {

  fieldData = [[9, 9, 9],
                 [9, 9, 9],
                 [9, 9, 9]];

  [...fields].forEach (field => {
    field.classList.remove('field-selected');
  })

  turns = 0;
}

function addEvents() {
  [...fields].forEach (field => {
    field.addEventListener('click', setFigure);
  })
}

function removeEvents() {
  [...fields].forEach (field => {
    field.removeEventListener('click', setFigure);
  })
}

function renderField() {
  let cells = container.children;
  fieldData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      let currentIndex = (rowIndex * columnsNumber) + cellIndex;
      let bgImage = "";
      if(cell === 0) bgImage = 'url(./assets/img/zero.svg)';
      else if(cell === 1) bgImage = 'url(./assets/img/cross.svg)';
      cells[currentIndex].style.backgroundImage = bgImage;
    })
  })
}

function isEmptyFieldsExists() {
  let flag = false;
  fieldData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if(cell !== 1 && cell !== 0){
        flag = true;
      }
    })
  })
  return flag;
}

function matrixSize() {
  let cells = container.children;
  rowsNumber = fieldData.length;
  if(fieldData[0]) columnsNumber = fieldData[0].length;
}

function checkOppositeCombinations() {
  fieldData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if(cell !== 1 && cell !== 0){
        flag = true;
      }
    })
  })
}

function checkWinCombinations(figure) {
  const winCombo = `${figure}${figure}${figure}`
  let flag = false;
  let array = [];
  fieldData.forEach((row, rowIndex) => {
    array.push(row.join(''));
  })
  for(let i = 0; i < columnsNumber; i++){
    let col = '';
    for(let j = 0; j < rowsNumber; j++){
      col += fieldData[j][i];
    }
    array.push(col);
  }
  let col = '';
  for(let i = 0; i < columnsNumber; i++){
    col += fieldData[i][i];
  }
  array.push(col);

  col = '';
  for(let i = 0; i < columnsNumber; i++){

    for(let j = rowsNumber - 1 - i; j >= 0; j--){
      col += fieldData[j][i];
      break;
    }
  }
  array.push(col);

  return array.includes(winCombo);
}

function showResult(res){
  result.textContent = res;
  popUpWrapper.classList.toggle('pop-up__wrapper-visible');
}

function setFigure(event) {
  removeEvents();
  turns++;
  let selectedCell = parseInt(event.target.id);
  event.target.classList.add('field-selected');
  let currentRow = Math.ceil(selectedCell / columnsNumber) - 1;
  let currentColumn = selectedCell - (currentRow * columnsNumber) - 1;
  fieldData[currentRow][currentColumn] = userFigure;
  renderField();
  if(!checkWinCombinations(userFigure))
    if(isEmptyFieldsExists()){
      setTimeout(computerSetFigure,500);
    }else{
      showResult("No winners!!!" + turns)
    }
  else
    showResult("User won!!!" + turns)
}

function computerSetFigure(event) {
  checkOppositeCombinations();
  turns++;
  flag = true;
  let cells = container.children;
  while(flag && isEmptyFieldsExists()){
    const i = Math.floor(Math.random() * rowsNumber);
    const j = Math.floor(Math.random() * columnsNumber);
    if(fieldData[i][j] !== 1 && fieldData[i][j] !== 0){
      fieldData[i][j] = computerFigure;
      let currentIndex = (i * columnsNumber) + j;
      cells[currentIndex].classList.add('field-selected');
      flag = false;
    }
  }
  renderField();
  if(!checkWinCombinations(computerFigure)){
    if(isEmptyFieldsExists()){
      addEvents();
    }else{
      showResult("No winners!!!" + turns)
    }
  }else{
    showResult("Computer won!!!" + turns)
  }
}

function init() {
  matrixSize();
  addEvents();
  renderField();
}

init();
