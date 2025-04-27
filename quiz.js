// Selecting elements
const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");
const optionList = document.querySelector(".option_list");
const timeLine = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const restartQuizBtn = resultBox.querySelector(".buttons .restart");
const quitQuizBtn = resultBox.querySelector(".buttons .quit");
const nextBtn = document.querySelector("footer .next_btn");
const bottomQuesCounter = document.querySelector("footer .total_que");
const darkModeBtn = document.getElementById("darkModeToggle");
const leaderboardList = document.querySelector(".leaderboard ul");

// Sound Effects
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");

let timeValue = 15;
let queCount = 0;
let queNumb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
let streak = 0;

// Dark Mode Toggle
darkModeBtn.onclick = () => {
  document.body.classList.toggle("dark");
}

// Start button
startBtn.onclick = () => {
  infoBox.classList.add("activeInfo");
}

// Exit button
exitBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
}

// Continue button
continueBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.add("activeQuiz");
  initializeQuiz();
}

// Restart button
restartQuizBtn.onclick = () => {
  resultBox.classList.remove("activeResult");
  quizBox.classList.add("activeQuiz");
  resetQuiz();
  initializeQuiz();
}

// Quit button
quitQuizBtn.onclick = () => {
  window.location.reload();
}

// Next button
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
}

// Initialize quiz
function initializeQuiz() {
  showQuestions(queCount);
  queCounter(queNumb);
  startTimer(timeValue);
  startTimerLine(widthValue);
}

// Reset quiz
function resetQuiz() {
  timeValue = 15;
  queCount = 0;
  queNumb = 1;
  userScore = 0;
  widthValue = 0;
  streak = 0;
}

// Update quiz
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

// Show questions
function showQuestions(index) {
  const queText = document.querySelector(".que_text");
  let queTag = `<span>${questions[index].numb}. ${questions[index].question}</span>`;
  let optionTag = questions[index].options.map(option => `<div class="option"><span>${option}</span></div>`).join('');
  queText.innerHTML = queTag;
  optionList.innerHTML = optionTag;

  optionList.querySelectorAll(".option").forEach(option => {
    option.onclick = () => optionSelected(option);
  });
}

// Option selected
function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  let userAns = answer.textContent;
  let correctAns = questions[queCount].answer;

  if (userAns === correctAns) {
    userScore++;
    streak++;
    correctSound.play();
    answer.classList.add("correct");
    answer.insertAdjacentHTML("beforeend", tickIconTag);
  } else {
    wrongSound.play();
    answer.classList.add("incorrect");
    answer.insertAdjacentHTML("beforeend", crossIconTag);
    highlightCorrectAnswer(correctAns);
    streak = 0;
  }

  disableOptions();
  nextBtn.classList.add("show");
}

// Highlight correct answer
function highlightCorrectAnswer(correctAns) {
  Array.from(optionList.children).forEach(option => {
    if (option.textContent === correctAns) {
      option.classList.add("correct");
      option.insertAdjacentHTML("beforeend", tickIconTag);
    }
  });
}

// Disable options
function disableOptions() {
  Array.from(optionList.children).forEach(option => {
    option.classList.add("disabled");
  });
}

// Show result
function showResult() {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.remove("activeQuiz");
  resultBox.classList.add("activeResult");

  const scoreText = resultBox.querySelector(".score_text");
  let scoreTag = '';

  if (userScore > 5) {
    scoreTag = `<span>Congrats! You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
    startConfetti();
  } else if (userScore > 2) {
    scoreTag = `<span>Nice! You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
  } else {
    scoreTag = `<span>Keep trying! You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
  }

  scoreText.innerHTML = scoreTag;

  saveLeaderboard(userScore);
  displayLeaderboard();
}

// Timer
function startTimer(time) {
  counter = setInterval(() => {
    timeCount.textContent = time > 9 ? time : `0${time}`;
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

// Timer line
function startTimerLine(time) {
  const totalTime = 550;
  counterLine = setInterval(() => {
    time++;
    let progress = (time / totalTime) * 100;
    timeLine.style.width = `${progress}%`;
    if (time >= totalTime) {
      clearInterval(counterLine);
    }
  }, 29);
}

// Question counter
function queCounter(index) {
  bottomQuesCounter.innerHTML = `<span><p>${index}</p> of <p>${questions.length}</p> Questions</span>`;
}

// Confetti
function startConfetti() {
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti();
}

// Leaderboard
function saveLeaderboard(score) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(scores));
}

function displayLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = scores.map(score => `<li>Score: ${score}</li>`).join('');
}

// Icons
const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';