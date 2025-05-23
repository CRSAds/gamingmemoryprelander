console.log("memory.js geladen!");

const icons = [
  'grape.png', 'grape.png',
  'cherries.png', 'cherries.png',
  'watermelon.png', 'watermelon.png',
  'pineapple.png', 'pineapple.png',
  'bananas.png', 'bananas.png',
  'strawberry.png', 'strawberry.png'
];

const shuffle = arr => arr.sort(() => Math.random() - 0.5);
const board = document.getElementById('game-board');
const overlay = document.getElementById('win-overlay');
let flipped = [];
let matched = 0;
let timerInterval;
let timeLimit = 90;
let timeLeft = timeLimit;

function createCard(src) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
  <div class="front"><img src="https://gamingmemoryprelander.vercel.app/assets/img/card-icon.png" alt=""></div>
  <div class="back"><img src="https://gamingmemoryprelander.vercel.app/assets/img/${src}" alt=""></div>
  `;
  card.addEventListener('click', () => flipCard(card, src));
  return card;
}

function flipCard(card, src) {
  if (card.classList.contains('flip') || flipped.length === 2) return;
  card.classList.add('flip');
  flipped.push({ card, src });

  if (flipped.length === 2) {
    const [a, b] = flipped;
    if (a.src === b.src) {
      matched++;
      flipped = [];
      if (matched === 6) handleWin();
    } else {
      setTimeout(() => {
        a.card.classList.remove('flip');
        b.card.classList.remove('flip');
        flipped = [];
      }, 900);
    }
  }
}

function handleWin() {
  clearInterval(timerInterval);
  overlay.classList.add('show');

  const nextButton = document.getElementById('to-form-button');
  if (nextButton) {
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = currentUrl.pathname.replace(/[^/]+$/, 'formulier');
    nextButton.setAttribute('href', `${currentUrl.toString()}`);
  }
}

function startGame() {
  board.innerHTML = '';
  matched = 0;
  flipped = [];
  timeLeft = timeLimit;
  updateProgress();
  overlay.classList.remove('show');

  const cards = shuffle([...icons]);
  cards.forEach(icon => board.appendChild(createCard(icon)));

  timerInterval = setInterval(() => {
    timeLeft--;
    updateProgress();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('Tijd is om!');
    }
  }, 1000);
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const percentage = (timeLeft / timeLimit) * 100;
  fill.style.width = `${percentage}%`;
}

if (board && overlay) {
  startGame();
}
