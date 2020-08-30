const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

// constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

let currentQuestion = {};
let acceptingAnswer = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

// using open trivia db
fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    /*
    format of question: 
    {
      question: '',
      choice1: '',
      choice2: '',
      choice3: '',
      choice4: '',
      answer: ''
    }
    */
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      // choose random answer
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      // not remove any answer, just add correct answer at random index of chosen answer above
      // so that the correct answer is stored in position of formattedQuestion.answer
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      console.log(formattedQuestion);
      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

const startGame = () => {
  // reset all and get new question
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];

  // then get new question
  getNewQuestion();

  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

const getNewQuestion = () => {
  // all question shown
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    // go to end page
    return window.location.assign("end.html");
  }

  // if not, update
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //update progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // get current question shown by random
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  // cut used question from available questions for show
  availableQuestions.splice(questionIndex, 1);

  acceptingAnswer = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswer) {
      return;
    }

    acceptingAnswer = false;
    // return an element
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    // typeof string with typeof number
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    // get whole element's container
    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      // remove class after done selecting
      // set enough time to show css
      selectedChoice.parentElement.classList.remove(classToApply);

      getNewQuestion();
    }, 1000);
  });
});

const incrementScore = (number) => {
  score += number;
  scoreText.innerText = score;
};
