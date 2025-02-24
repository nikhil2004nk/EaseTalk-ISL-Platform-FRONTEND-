// DOM Elements
const mainMenu = document.getElementById('mainMenu');
const mcqSection = document.getElementById('mcqSection');
const practicalSection = document.getElementById('practicalSection');
const resultsSection = document.getElementById('resultsSection');
const level1Btn = document.getElementById('level1Btn');
const level2Btn = document.getElementById('level2Btn');
const pointsCounter = document.getElementById('pointsCounter');
const currentQuestion = document.getElementById('currentQuestion');
const gestureImg = document.getElementById('gestureImg');
const optionButtons = document.querySelectorAll('.option-btn');
const videoFeed = document.getElementById('videoFeed');
const videoCanvas = document.getElementById('videoCanvas');
const retryBtn = document.getElementById('retryBtn');
const menuBtn = document.getElementById('menuBtn');

// Quiz State
let currentPoints = 0;
let questionNumber = 0;
let correctAnswers = 0;
let currentLevel = 1;

// Sample Quiz Data
const quizData = [
    {
        image: 'images/like.jpg',
        options: ['Peace Sign', 'Like', 'Wave', 'Not-OK Sign'],
        correctAnswer: 1
    },
    {
        image: 'images/high-five.jpg',
        options: ['Thumbs Up', 'High Five', 'Fist Bump', 'Point'],
        correctAnswer: 1
    },
    {
        image: 'images/love.jpg',
        options: ['Clap', 'Finger clap', 'Victory Sign', 'Love'],
        correctAnswer: 3
    },
    {
        image: 'images/promise.jpg',
        options: ['Promise', 'Fist Bump', 'Namaste', 'Stop'],
        correctAnswer: 0
    },
    {
        image: 'images/Awesome.jpg',
        options: ['Call Me', 'Thumbs Down', 'Prayer Hands', 'Awesome'],
        correctAnswer: 3
    }
];


// Level 2 Data
const level2Instructions = [
    'Show a Peace Sign',
    'Wave Hello',
    'Thumbs Up',
    'Show OK Sign',
    'Make a Fist'
];

let level2Points = 0;
let level2QuestionNumber = 0;

// Initialize
function init() {
    // Event Listeners
    level1Btn.addEventListener('click', startLevel1);
    level2Btn.addEventListener('click', startLevel2);
    retryBtn.addEventListener('click', () => {
        if (currentLevel === 1) {
            startLevel1();
        } else {
            startLevel2();
        }
    });
    menuBtn.addEventListener('click', showMainMenu);
    
    optionButtons.forEach((button, index) => {
        button.addEventListener('click', () => checkAnswer(index));
    });

    // Add Level 2 button to results section
    const goToLevel2Btn = document.createElement('button');
    goToLevel2Btn.textContent = 'Go to Level 2';
    goToLevel2Btn.className = 'action-btn';
    goToLevel2Btn.addEventListener('click', startLevel2);
    document.querySelector('.results-content').appendChild(goToLevel2Btn);

    // Add Next button for Level 2
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.id = 'nextGestureBtn';
    nextBtn.className = 'action-btn';
    nextBtn.style.display = 'none';
    nextBtn.addEventListener('click', nextLevel2Question);
    document.querySelector('.practical-content').appendChild(nextBtn);

    // Add Level 2 score elements
    const level2Score = document.createElement('div');
    level2Score.className = 'score-counter';
    level2Score.innerHTML = 'Points: <span id="level2Points">0</span>';
    
    const level2QuestionCounter = document.createElement('div');
    level2QuestionCounter.className = 'question-counter';
    level2QuestionCounter.innerHTML = 'Question: <span id="level2CurrentQuestion">1</span>/5';
    
    const level2Header = document.createElement('div');
    level2Header.className = 'quiz-header';
    level2Header.appendChild(level2Score);
    level2Header.appendChild(level2QuestionCounter);
    
    document.querySelector('.practical-content').insertBefore(
        level2Header,
        document.querySelector('.instruction-panel')
    );
}

// Navigation Functions
function showMainMenu() {
    mainMenu.style.display = 'block';
    mcqSection.style.display = 'none';
    practicalSection.style.display = 'none';
    resultsSection.style.display = 'none';
    stopCamera();
    resetQuiz();
}

function startLevel1() {
    currentLevel = 1;
    mainMenu.style.display = 'none';
    mcqSection.style.display = 'block';
    resultsSection.style.display = 'none';
    resetQuiz();
    loadQuestion();
}

function startLevel2() {
    currentLevel = 2;
    mainMenu.style.display = 'none';
    mcqSection.style.display = 'none';
    practicalSection.style.display = 'block';
    resultsSection.style.display = 'none';
    resetLevel2();
    initCamera();
}

// Level 2 Functions
function resetLevel2() {
    level2Points = 0;
    level2QuestionNumber = 0;
    document.getElementById('level2Points').textContent = level2Points;
    document.getElementById('level2CurrentQuestion').textContent = '1';
    document.getElementById('nextGestureBtn').style.display = 'block';
    loadLevel2Question();
}

function loadLevel2Question() {
    if (level2QuestionNumber >= 5) {
        showResults();
        return;
    }
    
    document.getElementById('gestureInstruction').textContent = 
        level2Instructions[level2QuestionNumber];
    document.getElementById('level2CurrentQuestion').textContent = 
        level2QuestionNumber + 1;
}

function nextLevel2Question() {
    // Simulate gesture verification (replace with actual verification)
    const correct = Math.random() > 0.5; // Random success for demonstration
    
    if (correct) {
        level2Points += 20;
        document.getElementById('level2Points').textContent = level2Points;
        document.getElementById('gestureFeedback').textContent = 'Correct gesture!';
    } else {
        document.getElementById('gestureFeedback').textContent = 'Incorrect gesture. Try again!';
    }
    
    level2QuestionNumber++;
    
    if (level2QuestionNumber >= 5) {
        showResults();
    } else {
        loadLevel2Question();
    }
}

// Quiz Functions
function resetQuiz() {
    currentPoints = 0;
    questionNumber = 0;
    correctAnswers = 0;
    pointsCounter.textContent = currentPoints;
    currentQuestion.textContent = '1';
}

function loadQuestion() {
    if (questionNumber >= 5) {
        showResults();
        return;
    }

    const question = quizData[questionNumber % quizData.length];
    gestureImg.src = question.image;
    
    optionButtons.forEach((button, index) => {
        button.textContent = question.options[index];
        button.className = 'option-btn';
        button.disabled = false;
    });

    currentQuestion.textContent = questionNumber + 1;
}

function checkAnswer(selectedIndex) {
    const question = quizData[questionNumber % quizData.length];
    const correct = selectedIndex === question.correctAnswer;

    optionButtons.forEach(button => button.disabled = true);
    optionButtons[selectedIndex].classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
        optionButtons[question.correctAnswer].classList.add('correct');
    }

    if (correct) {
        currentPoints += 20;
        correctAnswers++;
        pointsCounter.textContent = currentPoints;
    }

    setTimeout(() => {
        questionNumber++;
        loadQuestion();
    }, 1500);
}

function showResults() {
    const points = currentLevel === 1 ? currentPoints : level2Points;
    const correct = currentLevel === 1 ? correctAnswers : Math.floor(level2Points / 20);
    
    mcqSection.style.display = 'none';
    practicalSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    document.getElementById('finalScore').textContent = points;
    document.getElementById('correctAnswers').textContent = correct;
    
    // Show/hide Level 2 button based on current level
    const goToLevel2Btn = document.querySelector('.results-content .action-btn:last-child');
    goToLevel2Btn.style.display = currentLevel === 1 ? 'inline-block' : 'none';
    
    if (currentLevel === 2) {
        stopCamera();
    }
}

// Camera Functions
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoFeed.srcObject = stream;
        startGestureRecognition();
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions.');
    }
}

function startGestureRecognition() {
    const context = videoCanvas.getContext('2d');
    const gestureFeedback = document.getElementById('gestureFeedback');
    
    function checkGesture() {
        context.drawImage(videoFeed, 0, 0, videoCanvas.width, videoCanvas.height);
        gestureFeedback.textContent = 'Perform the gesture and click Next';
        requestAnimationFrame(checkGesture);
    }

    checkGesture();
}

function stopCamera() {
    const stream = videoFeed.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    videoFeed.srcObject = null;
}

window.addEventListener('beforeunload', stopCamera);

// Initialize the app
init();