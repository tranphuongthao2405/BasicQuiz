const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", (event) => {
  saveScoreBtn.disabled = !event.target.value;
});

const saveHighScore = (event) => {
  event.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value,
  };

  // push score saved to array, then sort it, then keep it pnly to top 5 highest scores
  highScores.push(score);

  highScores.sort((a, b) => {
    return b.score - a.score;
  });

  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  window.location.assign("index.html");
};
