const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// map function return a new array from first array
// then join return a string of result
highScoresList.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">${score.name}: ${score.score}</li>`;
  })
  .join("");
