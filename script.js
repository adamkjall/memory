const container = document.querySelector(".container");

// const soundCardFlip = new Audio("audio/cardFlip2.wav");
const soundPoints = new Audio("audio/points.wav");
const soundWinning = new Audio("audio/winning.wav");
const SoundButton = new Audio("audio/menu.wav");

const cards = [
  "🍕",
  "🍕",
  "🍧",
  "🍧",
  "🍺",
  "🍺",
  "🥝",
  "🥝",
  "🍇",
  "🍇",
  "🍄",
  "🍄",
  "🧀",
  "🧀",
  "🌮",
  "🌮"
];

const initialState = [
  {
    card: null,
    closed: true
  },
  {
    card: null,
    closed: true
  }
];

let score = 0;
let isGameOver = false;

let activeCards = [...initialState];

//  The sorting method reorders elements randomly because
//  Math.random() - 0.5) is a random number to could be positive or negative
const shuffle = arr => {
  arr.sort(() => Math.random() - 0.5);
};

const playSound = sound => {
  sound.currentTime = 0;
  sound.play();
};
const toggleCard = e => {
  const card = e.currentTarget;
  const cardIsClosed = !card.classList.contains("open-active");

  /* card to toggle */
  if (cardIsClosed) {
    // playSound(soundCardFlip)
    /* check if first spot is available */
    if (activeCards[0].closed) {
      activeCards[0] = { card, closed: false };
      card.classList.add("open-active");
      /* check if second spot is available */
    } else if (activeCards[1].closed) {
      activeCards[1] = { card, closed: false };
      card.classList.add("open-active");

      /* no spot availible, turn both active cards */
    } else {
      activeCards[0].card.classList.remove("open-active");
      activeCards[1].card.classList.remove("open-active");
      activeCards = [...initialState];

      /* open new card */
      activeCards[0] = { card, closed: false };
      card.classList.add("open-active");
    }
  }

  if (checkIfPair()) {
    playSound(soundPoints);
    activeCards[0].card.classList.add("hide", "pairEffect");
    activeCards[1].card.classList.add("hide", "pairEffect");
    activeCards = [...initialState]; // pair found so reset active cards
    score += 2;
    isGameOver = score >= cards.length;
    if (isGameOver) {
      const gameOver = document.querySelector(".m-intro h2");
      gameOver.classList.toggle("hide");
      playSound(soundWinning);
    }
  }
};

const createBoard = cards => {
  // size of one side
  const board = [];
  for (let i = 0; i < cards.length; i++) {
    /* Memory card */
    const card = document.createElement("div");
    card.classList.add("card", `card-${i}`);

    /* Front of memmory card */
    const front = document.createElement("div");
    front.classList.add("front");
    // front.innerText = "🔴";
    front.innerText = "🎃";

    /* Back of memory card */
    const back = document.createElement("div");
    back.classList.add("back");
    back.innerText = cards[i];

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener("click", toggleCard);

    board.push(card);
  }

  board.forEach(card => container.appendChild(card));
};

const checkIfPair = () => {
  const cardA = activeCards[0].card ? activeCards[0].card.textContent : "1";
  const cardB = activeCards[1].card ? activeCards[1].card.textContent : "2";
  return cardA === cardB;
};

const reset = document.querySelector(".reset-btn");
const show = document.querySelector(".show-btn");

const resetBoard = () => {
  playSound(SoundButton);
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
  shuffle(cards);
  createBoard(cards);
  score = 0;
  elapsedTime = -1; // because of how update time is implemented
  isGameOver = false;
  const gameOver = document.querySelector(".m-intro h2");
  if (!gameOver.classList.contains("hide")) {
    gameOver.classList.add("hide");
  }
};

// for testing
const showBoard = () => {
  playSound(SoundButton);
  const cards = document.querySelectorAll(".container > *");
  cards.forEach(card => {
    card.querySelector(".front").classList.toggle("none");
    card.querySelector(".back").classList.toggle("show");
  });
};

const time = document.querySelector(".time");
let elapsedTime = 0;

const uppdateTime = () => {
  if (isGameOver) return;
  elapsedTime++;

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime - minutes * 60;

  time.innerHTML = `Time: ${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

shuffle(cards);
createBoard(cards);

setInterval(uppdateTime, 1000);

reset.addEventListener("click", resetBoard);

show.addEventListener("click", showBoard);
