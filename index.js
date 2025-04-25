// Game configuration
const config = {
    easy: { maxNum: 10, timeLimit: 10 },
    medium: { maxNum: 20, timeLimit: 8 },
    hard: { maxNum: 50, timeLimit: 5 }
};

// DOM Elements
const questionEl = document.getElementById("question");
const inputEl = document.getElementById("input");
const formEl = document.getElementById("form");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const resetBtn = document.getElementById("resetBtn");

// Game state
let score = JSON.parse(localStorage.getItem("score")) || 0;
let highScore = JSON.parse(localStorage.getItem("highScore")) || 0;
let currentDifficulty = "easy";
let timeLeft;
let timerInterval;
let num1, num2, correctAns;

// Initialize the game
function initGame() {
    updateScoreDisplay();
    generateQuestion();
    startTimer();
}

// Reset game function
function resetGame() {
    score = 0;
    updateLocalStorage();
    updateScoreDisplay();
    generateQuestion();
    startTimer();
    showFeedback("Game reset!", true);
}

// Generate new question based on difficulty
function generateQuestion() {
    const { maxNum } = config[currentDifficulty];
    num1 = Math.ceil(Math.random() * maxNum);
    num2 = Math.ceil(Math.random() * maxNum);
    correctAns = num1 * num2;
    questionEl.innerText = `What is ${num1} × ${num2}?`;
    inputEl.value = "";
    inputEl.focus();
}

// Timer functions
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = config[currentDifficulty].timeLimit;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerEl.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 3) {
        timerEl.style.color = "#e74c3c";
    } else {
        timerEl.style.color = "white";
    }
}

function handleTimeUp() {
    showFeedback("Time's up!", false);
    decrementScore();
    setTimeout(() => {
        generateQuestion();
        startTimer();
    }, 1000);
}

// Score handling
function updateScoreDisplay() {
    scoreEl.innerText = `Score: ${score}`;
    highScoreEl.innerText = `High Score: ${highScore}`;
}

function incrementScore() {
    score++;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", JSON.stringify(highScore));
    }
    updateLocalStorage();
    updateScoreDisplay();
}

function decrementScore() {
    score = Math.max(0, score - 1); // Ensure score never goes below 0
    updateLocalStorage();
    updateScoreDisplay();
}

function updateLocalStorage() {
    localStorage.setItem("score", JSON.stringify(score));
}

// Feedback handling
function showFeedback(message, isCorrect) {
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
    
    if (isCorrect) {
        correctSound.currentTime = 0;
        correctSound.play();
    } else {
        wrongSound.currentTime = 0;
        wrongSound.play();
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 500);
    }
}

// Event Listeners
formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userAns = +inputEl.value;
    
    if (userAns === correctAns) {
        showFeedback("Correct!", true);
        incrementScore();
        setTimeout(() => {
            generateQuestion();
            startTimer();
        }, 1000);
    } else {
        showFeedback("Wrong answer!", false);
        decrementScore();
    }
});

difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Update active button
        difficultyBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // Update difficulty and restart game
        currentDifficulty = btn.dataset.difficulty;
        generateQuestion();
        startTimer();
    });
});

// Reset button event listener
resetBtn.addEventListener("click", resetGame);

// Initialize the game
initGame();