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
  resetQuiz();
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
  let queTag = `<span>${questions[index].numb}. ${questions[index].question} 
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
  let scoreTag = '';

  if (userScore > 4) {
    scoreTag = `<span>🎉 Awesome! You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
  } else if (userScore > 2) {
    scoreTag = `<span>👍 Nice! You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
  } else {
    scoreTag = `<span>😥 Keep Trying! You got only <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
  }

  scoreText.innerHTML = scoreTag;
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
  let totalQueCounTag = `<span><p>${index}</p> of <p>${questions.length}</p> Questions</span>`;
  bottomQuesCounter.innerHTML = totalQueCounTag;
}

// Icons
const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// New Technology Trivia Questions
const questions = [
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
  }
];
