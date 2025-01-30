import { cat, hourglass, camel, dog, dinosaur } from './nonograms5x5.js';
import { octopus, helicopter, elk, submarine, tick } from './nonograms10x10.js';
import { cherry, scorpion, owl, lizard, car } from './nonograms15x15.js';

const nonograms = {
  'easy': { 'cat': cat, 'hourglass': hourglass, 'camel': camel, 'dog': dog, 'dinosaur': dinosaur },
  'medium': { 'octopus': octopus, 'helicopter': helicopter, 'elk': elk, 'submarine': submarine, 'tick': tick },
  'hard': { 'cherry': cherry, 'scorpion': scorpion, 'owl': owl, 'lizard': lizard, 'car': car }
};

let result = [];
let name = 'Cat';
let size = 'easy';
let seconds = 0;
let minutes = 0;
let hours = 0;
let interval;
let timer;
let startTimer = 0;
let wrapperList;
let wrapperNonogram;

function clearTimer() {
  clearInterval(interval);
  startTimer = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
}

const getRandomNumber = (min = 1, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomNonogram = () => {
  const keysSize = Object.keys(nonograms);
  size = keysSize[getRandomNumber(0, keysSize.length - 1)];
  const keysName = Object.keys(nonograms[size]);
  name = keysName[getRandomNumber(0, keysName.length - 1)];
  return { size, name };
}

function getTime() {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTime() {
  seconds++;
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }
  if (minutes === 60) {
    hours++;
    minutes = 0;
  }
  timer.textContent = getTime();
}

// функция генерации блоков
const generateBlock = (data, rows, columns, numRows, numColumns, playField = '', classRow) => {
  let template = '';
  let displayData;

  for (let i = rows; i < data[0].length - numRows; i++) {
    template += `<div class="${classRow}">`;
    for (let j = columns; j < data[0].length - numColumns; j++) {
      displayData = !playField ? data[i][j] : '';

      if (playField && data[i][j] === 1) {
        template += `<div data-cage="${[i, j]}" class="cage ${playField} cage-press">${displayData}</div>`;
      } else if (playField && data[i][j] === 'x') {
        template += `<div data-cage="${[i, j]}" class="cage ${playField} cross">${displayData}</div>`;
      } else {
        template += `<div data-cage="${[i, j]}" class="cage ${playField}"><p>${displayData}</p></div>`;
      }
    }
    template += '</div>';
  }
  return template;
}

const body = document.querySelector('body');

function generateNonogram(data, name, size, scale = '') {
  let template = '';
  let rows = 4;
  let columns = 10;

  if (data[0].length > 15) {
    rows = 5;
    columns = 15;
  }
  if (data[0].length < 8) {
    rows = 2;
    columns = 5;
  }

  document.documentElement.style.setProperty('--field-columns', columns);
  document.documentElement.style.setProperty('--field-rows', rows);
  let div = document.createElement('div');
  div.className = 'nonogram';
  div.setAttribute('id', name.toUpperCase());
  div.setAttribute('data-size', size);
  template += `<h2 id="timer">${getTime()}</h2>`;
  template += `<h2 class="name">${name}</h2>`;
  template += '<div class="top-container">';
  template += '<div class="top-left-container"></div>';
  template += '<div class="top-right-container">';
  template += `${generateBlock(data, 0, rows, columns, 0, '', 'row', scale)}`;
  template += '</div>';
  template += '</div>';
  template += '<div class="bottom-container">';
  template += '<div class="bottom-left-container">';
  template += `${generateBlock(data, rows, 0, 0, columns, '', 'row-left', scale)}`;
  template += '</div>';
  template += '<div class="play-field">';
  template += `${generateBlock(data, rows, rows, 0, 0, 'cage-play-field', 'row', scale)}`;
  template += '</div>';
  template += '</div>';
  div.innerHTML = template;
  wrapperNonogram = document.querySelector('.wrapper-nonogram');
  wrapperNonogram.append(div);
  timer = document.getElementById('timer');
  btns.style.display = 'flex';
}

function generatePage(data, size) {
  let template = '';
  let div = document.createElement('div');
  div.className = 'container';
  template += '<div class="modalBackground"></div>';
  template += '<div class="header">';
  template += '<div class="btn-wrapper">';
  template += '<button id="theme" class="btn-dark"></button>';
  template += '</div>';
  template += '<h1 class="title">NONOGRAMS</h1>';
  template += '<div class="btn-wrapper">';
  template += '<button id="sound" class="sound-off"></button>';
  template += '</div>';
  template += '</div>';
  template += '<div class="size">';
  template += '<div id="easy" class="button active">5x5</div>';
  template += '<div id="medium" class="button">10x10</div>';
  template += '<div id="hard" class="button">15x15</div>';
  template += '</div>';
  template += '<div class="btns-2">';
  template += '<button id="random" class="button btn-style">Random Nonogram</button>';
  template += '<button id="continue" class="button btn-style">Continue last game</button>';
  template += '</div>';
  template += '<div class="wrapper-list"></div>';
  template += '<div class="wrapper-nonogram"></div>';
  template += '<div class="btns">';
  template += '<button id="show" class="button btn-style">Show</button>';
  template += '<button id="save" class="button btn-style">Save Game</button>';
  template += '<button id="restart" class="button btn-style">Restart</button>';
  template += '</div>';
  div.innerHTML = template;
  body.append(div);
  generateListNonogram(data, size);
}

const getRecordTable = () => {
  let temp = JSON.parse(localStorage.getItem('nonogram')) ?? [{ name: '-----', size: '-----', time: '-----' }];
  let template = '';
  let table = document.createElement('table');
  let name;
  let size;
  let time;
  table.className = 'table';
  template += '<tr><th class="hat">№</th><th class="hat">Name</th><th class="hat">Level</th><th class="hat">Time</th></tr>';

  for (let i = 0; i < 5; i += 1) {
    name = temp[i] ? temp[i].name : '-----';
    size = temp[i] ? temp[i].size : '-----';
    time = temp[i] ? temp[i].time : '-----';
    template += `<tr><th>${i + 1}</th><th>${name}</th><th>${size}</th><th>${time}</th></tr>`;
  }
  table.innerHTML = template;
  wrapperList.append(table);
}

const generateSmallNonogram = (name, size) => {
  let template = '';
  let div = document.createElement('div');
  div.className = 'nonogram-small';
  div.setAttribute('id', name);
  div.setAttribute('data-size', size);
  template += `<h2 class="name">${name}</h2>`;
  template += '<div class="img">';
  template += `<img src="./css/img/${name}.png" width="80" height="80" alt=”${name}”>`;
  template += '</div>';
  div.innerHTML = template;
  wrapperList = document.querySelector('.wrapper-list');
  wrapperList.append(div);
}

// рендеринг списка нонограм
function generateListNonogram(data, size) {
  const keys = Object.keys(data);
  keys.forEach(key => {
    generateSmallNonogram(key.toLocaleLowerCase(), size);
  });
  getRecordTable();
}

generatePage(nonograms.easy, 'easy');

const clearResult = () => {
  let rows = 2;
  if (size === 'medium') rows = 4;
  if (size === 'hard') rows = 5;
  for (let i = rows; i < result[0].length; i++) {
    for (let j = rows; j < result[0].length; j++) {
      if (result[i][j] === 1 || result[i][j] === 'x') result[i][j] = 0;
    }
  }
}

// тема //////////////////////////////////////////////////////////////////////////////////////////
const theme = document.getElementById('theme');
theme.addEventListener('click', function (event) {
  const theme = event.target;
  theme.classList.contains('btn-dark') ?
    (theme.classList.remove('btn-dark'), theme.classList.add('btn-light')) :
    (theme.classList.remove('btn-light'), theme.classList.add('btn-dark'));
  if (!theme.classList.contains('btn-dark')) {
    document.documentElement.style.setProperty('--text-light', 'white');
    document.documentElement.style.setProperty('--border-light', 'white');
    document.documentElement.style.setProperty('--background-light', 'black');
    document.documentElement.style.setProperty('--background-light2', 'black');
    document.documentElement.style.setProperty('--background-light3', 'black');
    document.documentElement.style.setProperty('--background-cage', 'black');
    document.documentElement.style.setProperty('--background-light4', 'black');
    document.documentElement.style.setProperty('--background-btn', 'white');
    document.documentElement.style.setProperty('--cage-press', 'rgb(173, 168, 168)');
   } else {
    document.documentElement.style.setProperty('--text-light', 'rgb(92, 85, 85)');
    document.documentElement.style.setProperty('--border-light', 'rgb(92, 85, 85)');
    document.documentElement.style.setProperty('--background-light', 'rgb(165, 157, 157)');
    document.documentElement.style.setProperty('--background-light2', 'rgb(241, 238, 238)');
    document.documentElement.style.setProperty('--background-light3', 'rgb(201, 192, 192)');
    document.documentElement.style.setProperty('--background-light4', 'rgb(240, 231, 231)');
    document.documentElement.style.setProperty('--background-cage', 'white');
    document.documentElement.style.setProperty('--background-btn', 'rgb(241, 238, 238)');
    document.documentElement.style.setProperty('--cage-press', 'rgb(71, 67, 67)');
   }
  
  });

// звук
const sound = document.getElementById('sound');
sound.addEventListener('click', function (event) {
  const sound = event.target;
  sound.classList.contains('sound-off') ?
    (sound.classList.remove('sound-off'), sound.classList.add('sound-on')) :
    (sound.classList.remove('sound-on'), sound.classList.add('sound-off'));
});

const getSound = (typeClick) => {
  if (sound.classList.contains('sound-on')) {
    const path = `./css/click${typeClick}.mp3`;
    const audio = new Audio(path);
    audio.play();
  }
}

function addListenersPlayField() {
  const playField = document.querySelector('.play-field');
  document.oncontextmenu = function () { //убирает всплытие контекстного меню
    return false;
  };
  // правый клик на поле
  playField.addEventListener("contextmenu", function (event) {
    if (startTimer === 0) {
      interval = setInterval(updateTime, 1000);
      startTimer = 1;
    }
    const cage = event.target;
    if (cage.classList.contains('cage')) {
      const [i, j] = cage.dataset.cage.split(',');
      if (!cage.classList.contains('cross') && !cage.classList.contains('cage-press')) {
        getSound(1);
        cage.classList.add('cross');
        result[i][j] = 'x';
      } else if (cage.classList.contains('cage-press')) {
        getSound(1);
        cage.classList.remove('cage-press');
        cage.classList.add('cross');
        result[i][j] = 0;
      } else {
        getSound(3);
        cage.classList.remove('cross');
      }
    }
  });

  // левый клик на поле
  playField.addEventListener('click', function (event) {
    if (startTimer === 0) {
      interval = setInterval(updateTime, 1000);
      startTimer = 1;
    }

    const cage = event.target;
    if (cage.classList.contains('cage')) {
      const [i, j] = cage.dataset.cage.split(',');
      if (!cage.classList.contains('cage-press') && !cage.classList.contains('cross')) {
        getSound(2);
        cage.classList.add('cage-press');
        result[i][j] = 1;
      } else if (cage.classList.contains('cross')) {
        getSound(2);
        cage.classList.remove('cross');
        cage.classList.add('cage-press');
        result[i][j] = 1;
      } else {
        getSound(3);
        cage.classList.remove('cage-press');
        result[i][j] = 0;
      }
      if (nonograms[size][name].toString() === replaceAll(result.toString(), 'x', 0)) {/////////////////////////////////////////////////
        let time = timer.textContent;
        let temp = JSON.parse(localStorage.getItem('nonogram')) ?? [];
        temp.push({ name, size, time });
        // сортировка
        temp.sort(function (a, b) {
          if (a.time > b.time) {
            return 1;
          }
          if (a.time < b.time) {
            return -1;
          }
          return 0;
        });

        localStorage.setItem('nonogram', JSON.stringify(temp));
        getSound('win');
        clearTimer();
        gameOver();
      }
    }
  });
}
// функция замены всех совпадений
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

const btns = document.querySelector('.btns');
const btns2 = document.querySelector('.btns-2');

// кнопки Random, Continue
btns2.addEventListener('click', function (event) {
  const id = event.target.id;
  if (id === 'continue') {
    if (localStorage.lastGame !== undefined) {
      const lastGame = JSON.parse(localStorage.lastGame);
      result = JSON.parse(JSON.stringify(lastGame.data));
      name = lastGame.name;
      size = lastGame.size;
      seconds = lastGame.seconds;
      minutes = lastGame.minutes;
      hours = lastGame.hours;
      wrapperList.innerHTML = '';
      if (wrapperNonogram !== undefined) wrapperNonogram.innerHTML = '';
      generateNonogram(lastGame.data, lastGame.name, lastGame.size, '');
      addListenersPlayField();
    }
  }
  if (id === 'random') {
    wrapperList.innerHTML = '';
    if (wrapperNonogram !== undefined) wrapperNonogram.innerHTML = '';
    const { size, name } = getRandomNonogram();
    result = JSON.parse(JSON.stringify(nonograms[size][name]));
    clearResult();
    clearTimer();
    generateNonogram(result, name, size, '');
    addListenersPlayField();
  }
});

// кнопки Show, Save, Restart
btns.addEventListener('click', function (event) {
  const id = event.target.id;
  switch (id) {
    case 'show':
      clearTimer();
      wrapperNonogram.innerHTML = '';
      generateNonogram(nonograms[size][name], name, size, 'show');
      break;

    case 'save':
      localStorage.lastGame = JSON.stringify({ name, size, data: result, seconds, minutes, hours });
      break;

    case 'restart':
      clearTimer();
      wrapperNonogram.innerHTML = '';
      clearResult();
      generateNonogram(result, name, size, 500);
      addListenersPlayField();
      break;

    default:
      break;
  }
});



function addListeners() {
  clearTimer();
  //обработчик выбора нонограм
  const listener = (event) => {
    const nonogram = event.target.closest('.nonogram-small');
    if (nonogram.classList.contains('nonogram-small')) {
      wrapperList.innerHTML = '';
      if (wrapperNonogram !== undefined) wrapperNonogram.innerHTML = '';
      size = nonogram.dataset.size;
      name = nonogram.id;
      result = JSON.parse(JSON.stringify(nonograms[nonogram.dataset.size][nonogram.id]));
      clearResult();
      generateNonogram(result, name, size, 500);
      addListenersPlayField();
    }
  };


  wrapperList.addEventListener('click', listener, false);

  //обработчик кнопки выбора размера нонограм
  const buttonSize = document.querySelector('.size');
  buttonSize.addEventListener('click', function (event) {
    const button = event.target;
    if (button.classList.contains('button') && !button.classList.contains('active')) {
      buttonSize.querySelectorAll('div').forEach(el => el.classList.remove('active'));
      button.classList.add('active');
      wrapperList.innerHTML = '';
      if (wrapperNonogram !== undefined) wrapperNonogram.innerHTML = '';
      generateListNonogram(nonograms[button.id], button.id);
      addListeners();
      btns.style.display = 'none';
    }
  });
}

window.addEventListener('resize', (e) => {
  const width = window.innerWidth;
  if (width <= 500) {
    document.documentElement.style.setProperty('--size-field', '300px');
    document.documentElement.style.setProperty('--font-size', '10px');
  } else {
    document.documentElement.style.setProperty('--size-field', '450px');
  }
});

// функция генерации модального окна

const generateModalWindow = () => {
  let template = '';
  template += '<div class="modalActive">';
  template += '<div class="modalWindow">';
  template += '<h2 class="modal-title">Congratulations !</h2>';
  template += `<h4 class="modal-title">"You have solved the nonogram in <span>${timer.textContent}</span> seconds!"</h4>`;
  template += '<div class="modal-button">';
  template += '<p class="play-again">Play again</p>';
  template += '</div>';
  template += '</div>';
  template += '</div>';
  return template;
}

// функция окончания игры
function gameOver() {
  const modal = document.querySelector('.modalBackground');
  modal.innerHTML = generateModalWindow();
  modal.classList.add('modal-active');
  body.classList.add('scroll-menu-disabled');
  const button = document.querySelector('.modal-button');
  button.addEventListener('click', function (event) {
    modal.classList.remove('modal-active');
    body.classList.remove('scroll-menu-disabled');
    wrapperNonogram.innerHTML = '';
    generateListNonogram(nonograms.easy, 'easy');
    btns.style.display = 'none';
  });
}

addListeners();



