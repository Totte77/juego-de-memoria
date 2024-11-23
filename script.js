const startButton = document.getElementById('start-button');
const gameBoard = document.querySelector('.game-board');
const foundPairsDisplay = document.querySelector('.found-pairs');
const leftPairsDisplay = document.querySelector('.left-pairs');
const timerDisplay = document.querySelector('.time-elapsed');

let cardElements = [];
let flippedCards = [];
let foundPairs = 0;
let pairsLeft = 8;
let timer = null;
let secondsElapsed = 0;

const images = [
    'images/Dolphin.png',
    'images/Elephant.png',
    'images/Giraffe.png',
    'images/Lion.png',
    'images/Panda.png',
    'images/Rabbit.png',
    'images/Tiger.png',
    'images/Turtle.png'
];

function initializeGame() {
    // Reset state
    gameBoard.innerHTML = '';
    cardElements = [];
    flippedCards = [];
    foundPairs = 0;
    pairsLeft = 8;
    secondsElapsed = 0;

    foundPairsDisplay.textContent = foundPairs;
    leftPairsDisplay.textContent = pairsLeft;
    timerDisplay.textContent = '00:00';
    
    // Shuffle images and create cards
    const shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
    shuffledImages.forEach((imgSrc, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imgSrc;
    
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const img = document.createElement('img');
        img.src = imgSrc;
        img.onerror = () => {
            console.error(`Error loading image: ${imgSrc}`);
        };
        cardFront.appendChild(img);
    
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '?';
    
        card.appendChild(cardFront);
        card.appendChild(cardBack);
    
        card.addEventListener('click', () => flipCard(card));
        cardElements.push(card);
        gameBoard.appendChild(card);
    });
    
    // Start timer
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 800);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        foundPairs++;
        pairsLeft--;

        foundPairsDisplay.textContent = foundPairs;
        leftPairsDisplay.textContent = pairsLeft;

        if (pairsLeft === 0) {
            clearInterval(timer);
            alert(`¡Felicidades! Has completado el juego en ${formatTime(secondsElapsed)}`);
        }
    } else {
        // No match, flip back
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function updateTimer() {
    secondsElapsed++;
    timerDisplay.textContent = formatTime(secondsElapsed);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

startButton.addEventListener('click', initializeGame);
