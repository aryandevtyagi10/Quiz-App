// Selecting all elements
const startScreen = document.querySelector(".start_screen");
const startButton = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");
const optionList = document.querySelector(".option_list");
const timeLine = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const nextBtn = document.querySelector("footer .next_btn");
const bottomQuesCounter = document.querySelector("footer .total_que");

let timeValue = 15;
let queCount = 0;
let queNumb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

// Start Quiz
startButton.onclick = () => {
  startScreen.classList.add("hideStart");
  infoBox.classList.add("activeInfo");
};

// Exit Quiz
exitBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
  startScreen.classList.remove("hideStart");
};

// Continue to Quiz
continueBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.add("activeQuiz");
  initializeQuiz();
};

// Restart Quiz
document.querySelector(".result_box .buttons .restart").onclick = () => {
  resultBox.classList.remove("activeResult");
  quizBox.classList.add("activeQuiz");
  resetAndGetNewQuestions();
  initializeQuiz();
};

// Quit Quiz
document.querySelector(".result_box .buttons .quit").onclick = () => {
  window.location.reload();
};

// Next Question
nextBtn.onclick = () => {
  if (queCount < questions.length - 1) {
    queCount++;
    queNumb++;
    updateQuiz();
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    showResult();
  }
};

// Functions
function initializeQuiz() {
  showQuestions(queCount);
  queCounter(queNumb);
  startTimer(timeValue);
  startTimerLine(widthValue);
}

function resetQuiz() {
  timeValue = 15;
  queCount = 0;
  queNumb = 1;
  userScore = 0;
  widthValue = 0;
}

function updateQuiz() {
  showQuestions(queCount);
  queCounter(queNumb);
  clearInterval(counter);
  clearInterval(counterLine);
  startTimer(timeValue);
  startTimerLine(widthValue);
  timeText.textContent = "Time Left";
  nextBtn.classList.remove("show");
}

function showQuestions(index) {
  const queText = document.querySelector(".que_text");
  let queTag = `<span>${questions[index].question} 
  <span class="badge ${questions[index].level.toLowerCase()}">${questions[index].level}</span>
  </span>`;
  let optionTag = questions[index].options.map(option => `<div class="option"><span>${option}</span></div>`).join('');
  queText.innerHTML = queTag;
  optionList.innerHTML = optionTag;

  optionList.querySelectorAll(".option").forEach(option => {
    option.onclick = () => optionSelected(option);
  });
}

function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  let userAns = answer.textContent;
  let correctAns = questions[queCount].answer;

  if (userAns === correctAns) {
    userScore++;
    answer.classList.add("correct");
    answer.insertAdjacentHTML("beforeend", tickIconTag);
  } else {
    answer.classList.add("incorrect");
    answer.insertAdjacentHTML("beforeend", crossIconTag);
    highlightCorrectAnswer(correctAns);
  }

  disableOptions();
  nextBtn.classList.add("show");
}

function highlightCorrectAnswer(correctAns) {
  for (let i = 0; i < optionList.children.length; i++) {
    if (optionList.children[i].textContent === correctAns) {
      optionList.children[i].classList.add("correct");
      optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag);
    }
  }
}

function disableOptions() {
  for (let i = 0; i < optionList.children.length; i++) {
    optionList.children[i].classList.add("disabled");
  }
}

function showResult() {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.remove("activeQuiz");
  resultBox.classList.add("activeResult");
  const scoreText = resultBox.querySelector(".score_text");
  const messageText = resultBox.querySelector(".result_message .message");
  const subMessageText = resultBox.querySelector(".result_message .sub_message");
  let scoreTag = '';
  let message = '';
  let subMessage = '';

  if (userScore > 4) {
    scoreTag = `<span>🎉 <span class="score">${userScore}</span> out of <span class="total">${questions.length}</span></span>`;
    message = "Outstanding Performance!";
    subMessage = "You're a tech genius!";
    triggerConfetti();
  } else if (userScore > 2) {
    scoreTag = `<span>👍 <span class="score">${userScore}</span> out of <span class="total">${questions.length}</span></span>`;
    message = "Good Job!";
    subMessage = "You're on the right track!";
    triggerConfetti(0.5);
  } else {
    scoreTag = `<span>😥 <span class="score">${userScore}</span> out of <span class="total">${questions.length}</span></span>`;
    message = "Keep Practicing!";
    subMessage = getRandomQuote();
  }

  scoreText.innerHTML = scoreTag;
  messageText.textContent = message;
  subMessageText.textContent = subMessage;
}

function startTimer(time) {
  counter = setInterval(() => {
    timeCount.textContent = time > 9 ? time : `0${time}`;
    if (time <= 5) {
      timeCount.classList.add("lowTime");
    } else {
      timeCount.classList.remove("lowTime");
    }
    time--;
    if (time < 0) {
      clearInterval(counter);
      timeText.textContent = "Time Off";
      highlightCorrectAnswer(questions[queCount].answer);
      disableOptions();
      nextBtn.classList.add("show");
    }
  }, 1000);
}

function startTimerLine(time) {
  const totalTime = 550;
  counterLine = setInterval(() => {
    time += 1;
    let progressPercentage = (time / totalTime) * 100;
    timeLine.style.width = `${progressPercentage}%`;
    if (time >= totalTime) {
      clearInterval(counterLine);
    }
  }, 29);
}

function queCounter(index) {
  const currentQuestion = document.querySelector('.question-counter .current');
  const totalQuestions = document.querySelector('.question-counter .total');
  
  if (currentQuestion && totalQuestions) {
    currentQuestion.textContent = index;
    totalQuestions.textContent = questions.length;
  }
}

// Icons
const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// Question Bank
const questionBank = [
  {
    numb: 1,
    question: "Who is known as the father of the computer?",
    answer: "Charles Babbage",
    level: "Easy",
    options: [
      "Alan Turing",
      "Charles Babbage",
      "Bill Gates",
      "Steve Jobs"
    ]
  },
  {
    numb: 2,
    question: "What does 'HTTP' stand for?",
    answer: "HyperText Transfer Protocol",
    level: "Easy",
    options: [
      "HighText Transfer Protocol",
      "HyperText Transfer Protocol",
      "HyperText Transmission Protocol",
      "HyperTransfer Text Protocol"
    ]
  },
  {
    numb: 3,
    question: "Which company created the video game Fortnite?",
    answer: "Epic Games",
    level: "Medium",
    options: [
      "EA Sports",
      "Epic Games",
      "Activision",
      "Ubisoft"
    ]
  },
  {
    numb: 4,
    question: "What programming language is primarily used for Android development?",
    answer: "Kotlin",
    level: "Medium",
    options: [
      "Swift",
      "Kotlin",
      "JavaScript",
      "Ruby"
    ]
  },
  {
    numb: 5,
    question: "What was the first social media platform to reach 1 billion users?",
    answer: "Facebook",
    level: "Easy",
    options: [
      "Instagram",
      "Facebook",
      "TikTok",
      "Twitter"
    ]
  },
  {
    numb: 6,
    question: "What is the name of Apple's programming language introduced in 2014?",
    answer: "Swift",
    level: "Hard",
    options: [
      "Kotlin",
      "Swift",
      "Objective-C",
      "Dart"
    ]
  },
  {
    numb: 7,
    question: "Which technology is used to create decentralized applications?",
    answer: "Blockchain",
    level: "Hard",
    options: [
      "Blockchain",
      "Cloud Computing",
      "Artificial Intelligence",
      "Virtual Reality"
    ]
  },
  {
    numb: 8,
    question: "What does 'AI' stand for in technology?",
    answer: "Artificial Intelligence",
    level: "Easy",
    options: [
      "Advanced Internet",
      "Artificial Intelligence",
      "Automated Interface",
      "Active Intelligence"
    ]
  },
  {
    numb: 9,
    question: "Which company developed the Python programming language?",
    answer: "Guido van Rossum",
    level: "Medium",
    options: [
      "Microsoft",
      "Google",
      "Guido van Rossum",
      "Apple"
    ]
  },
  {
    numb: 10,
    question: "What is the main purpose of a VPN?",
    answer: "Secure Internet Connection",
    level: "Medium",
    options: [
      "Faster Internet Speed",
      "Secure Internet Connection",
      "Free Internet Access",
      "Better Gaming Experience"
    ]
  }
];

// Function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to get random questions
function getRandomQuestions(count = 5) {
  return shuffleArray([...questionBank]).slice(0, count);
}

// Initialize questions array
let questions = getRandomQuestions();

// Function to reset and get new questions
function resetAndGetNewQuestions() {
  questions = getRandomQuestions();
  queCount = 0;
  queNumb = 1;
  userScore = 0;
  widthValue = 0;
}

// Motivational quotes array
const motivationalQuotes = [
  "Every expert was once a beginner. Keep going!",
  "Success is built one question at a time. You've got this!",
  "The only way to learn is to keep trying. Don't give up!",
  "Your next attempt will be even better!",
  "Learning is a journey, not a destination. Keep exploring!",
  "Every mistake is a step towards mastery.",
  "The more you learn, the more you grow. Keep pushing!",
  "Your potential is limitless. Keep practicing!",
  "Success comes to those who persist. You're on the right track!",
  "Every challenge is an opportunity to grow stronger."
];

function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

// Confetti animation function
function triggerConfetti(intensity = 1) {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * intensity;

    // Since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}