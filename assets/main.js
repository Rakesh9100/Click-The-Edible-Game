const screens = document.querySelectorAll(".screen");
var foot = document.querySelector(".footer");
var head = document.querySelector(".head");
const choose_btns = document.querySelectorAll(".choose-btn");
const start_btn = document.getElementById("start-btn");
const game_container = document.getElementById("game-container");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const audio = new Audio("sounds/sound1.mp3");
var seconds = 0;
let score = 0;
var scoresArray = [];
var playerScores = [];
let selected_edible = {};
var gameInterval;
var timer;
var isRunning = -1; //this defines the state of game running or not

// -------------- bomb management section ----------------
var totalBombs = 0;
var MAX_BOMBS = 5;
var bombExploded = false;

function createBomb() {
    const bomb = document.createElement('div');
    bomb.classList.add('bomb');
    const {x, y} = getRandomLocation()
    bomb.style.top = `${y}px`;
    bomb.style.left = `${x}px`;
    bomb.innerHTML = `<img src="images/bomb.png" alt="💣" style="transform: rotate(${Math.random() * 360}deg)" /><p style="display: none">${1 + (Math.random() * 5)}</p>`;
    // bomb.innerHTML = `<img src="images/bomb.png" alt="💣" style="transform: rotate(${Math.random() * 360}deg)" /><p style="display: none">${120}</p>`;
    bomb.addEventListener('click', explodeBomb);
    game_container.appendChild(bomb);
}

function explodeBomb() {
    const audio = new Audio("sounds/explosion.wav");
    audio.play();
    this.innerHTML = `<img src="images/explosion.png" alt="💥" style="transform: rotate(${Math.random() * 360}deg)" />`;
    this.classList.add('dead');
    setTimeout(() => this.remove(), 2000);
    totalBombs--;
    bombExploded = true;
}

function checkBombLife() {
    const bombs = document.getElementsByClassName('bomb');
    for (let i = 0; i < bombs.length; i++) {
        const bomb = bombs[i];
        const life = bomb.querySelector('p');
        if (life.innerText <= 0) {
            bomb.classList.add('dead');
            setTimeout(() => bomb.remove(), 2000);
            totalBombs--;
        } else {
            bomb.querySelector('p').innerText--;
        }
    }
}

function removeBombs() {
    const createdBombs = document.getElementsByClassName('bomb');
    while (createdBombs.length > 0) {
        createdBombs[0].parentNode.removeChild(createdBombs[0]);
    }
}
// -------------- bomb management section ----------------

start_btn.addEventListener("click", function () {
  screens[0].classList.add("up");
  head.style.display = "flex";
});

choose_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    const src = img.getAttribute("src");
    const alt = img.getAttribute("alt");
    selected_edible = { src, alt };
    screens[1].classList.add("up1");
    game_container.style.height = "100vh";
    startGame();
    displayChange();
    audio.play();
  });
});

function chooseGameplayTime() {
  document.getElementById("time").style.display = "none";
  document.getElementById("gameplayTime").style.display = "flex";
    document.getElementById("time-range").addEventListener("change", function (e) {
    seconds = parseInt(document.getElementById("time-range").value) - 1;
    return seconds;
  });
}

function closeGameplayDialog() {
  isRunning = 1;
  seconds = parseInt(document.getElementById("time-range").value) - 1;
  setTimeout(createEdible, 1000);
  document.getElementById("gameplayTime").style.display = "none";
  document.getElementById("time").style.display = "block";
  gameInterval = setInterval(decreaseTime, 1000);
}

function startGame() {
  document.getElementById("pause-menu").style.display = "none";
  document.getElementById("pause-button").style.display = "block";
  document.getElementById("gameOver-menu").style.display = "none";
  seconds = chooseGameplayTime();
  document.onkeydown = capturekey;

  function capturekey(e) {
    e = e || window.event;

    if (e.code == "F5") {
      if (confirm("Do you want to Refresh ? Your progress may be lost!!")) {
        //allow to refresh
      } else {
        //avoid from refresh
        e.preventDefault();
        e.stopPropagation();
      }
    }
    if (e.ctrlKey) {
      var c = e.which || e.keyCode;
      if (c == 82) {
        if (confirm("Do you want to Refresh ? Your progress may be lost!!")) {
          //allow to refresh
        } else {
          //avoid from refresh
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }
  }
}

function showInstructions() {
  document.getElementById("instructions").style.display = "flex";
  document.getElementById("instructions2").style.display = "flex";
  document.getElementById("instructions3").style.display = "flex";
  pauseGame();
}

function closeInstructions() {
  document.getElementById("instructions").style.display = "none";
  document.getElementById("instructions2").style.display = "none";
  document.getElementById("instructions3").style.display = "none";
  isRunning = 1;
}

//Maximum in the array
Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

function gameOver() {
  document.getElementById("gameOver-menu").style.display = "flex";
  document.getElementById("pause-button").style.display = "none";
  finalScore.innerHTML = `Final Score : ${score}`;
  clearInterval(gameInterval);
  scoresArray.push(score);
  var HIGHSCORE = scoresArray.max();
  scoresArray.sort((a, b) => a - b);
  scoresArray.reverse();
  highscore.innerHTML = `HIGH SCORE : ${HIGHSCORE}`;
  scores.innerHTML = `Your Scores : ${scoresArray}`;
  isRunning = 0;

  // -------------- bomb management section ----------------
  bombExploded = false;
  totalBombs = 0;
}

function starting() {
  document.getElementById("back-icon").style.display = "block";
}

function decreaseTime() {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  timeEl.innerHTML = `Time: ${m}:${s}`;

  // -------------- game over section ----------------
  if ((s == 0 && m == 0) || bombExploded == true) {
    gameOver();
  } else {
    seconds--;
    // -------------- bomb management section ----------------
    checkBombLife();
  }
}

function createEdible() {
  if (isRunning == 1) {
    const edible = document.createElement("div");
    edible.classList.add("edible");
    const { x, y } = getRandomLocation();
    edible.style.top = `${y}px`;
    edible.style.left = `${x}px`;
    edible.innerHTML = `<img src="${selected_edible.src}" alt="${
      selected_edible.alt
    }" style="transform: rotate(${Math.random() * 360}deg)" />`;

    edible.addEventListener("click", catchEdible);
    game_container.appendChild(edible);

    // -------------- bomb management section ----------------
    if (totalBombs < MAX_BOMBS) {
        if (Math.random() < 0.5) {
            createBomb();
            totalBombs++;
        }
    }
  }
}

function getRandomLocation() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const x = Math.random() * (width - 200) + 100;
  const y = Math.random() * (height - 200) + 100;
  return { x, y };
}

function catchEdible() {
  if (isRunning == 1) {
    const audio = new Audio("sounds/sound2.mp3");
    increaseScore();
    this.classList.add("caught");
    setTimeout(() => this.remove(), 2000);
    addEdibles();
    audio.play();
  }
}

function addEdibles() {
  setTimeout(createEdible, 1000);
  setTimeout(createEdible, 1500);
}

function increaseScore() {
  score++;
  scoreEl.innerHTML = `Score: ${score}`;
}

// Page reload
function reset() {
  // startGame();
  scoresArray = [];
  location.reload();
  // window.close();
  // window.open("https://rakesh9100.github.io/Click-The-Edible-Game/");
}

function pauseGame() {
  //if running then pause the timer
  if (isRunning == 1) {
    // saving the interval while pause
    timer = seconds;
    clearInterval(gameInterval);
    isRunning = 0;
    //show pause-menu when game paused
    document.getElementById("pause-menu").style.display = "flex";
    document.getElementById("pause-button").style.display = "none";
    document.getElementById("home-icon").style.display = "none";
  }
}

function resumeGame() {
  // starting the timer
  // overwriting the seconds with interval while pause
  seconds = timer;
  gameInterval = setInterval(decreaseTime, 1000);
  isRunning = 1;
  //hide pause-menu when game starts again
  document.getElementById("pause-menu").style.display = "none";
  document.getElementById("pause-button").style.display = "block";
  document.getElementById("home-icon").style.display = "block";
}

// Pause game by space bar
document.body.addEventListener("keyup", (e) => {
  if (e.keyCode == 32 || e.keyCode == 0) {
    //mozilla have "space" keycode 0 and other browsers 32
    if (isRunning != -1) {
      pauseGame();
    }
  }
});

function restartGame() {
  isRunning = 0; //this will stop new edibles from generating
  //reset time and score
  seconds = 0;
  clearInterval(gameInterval);
  score = 0;
  seconds = chooseGameplayTime();
  scoreEl.innerHTML = `Score: ${score}`;
  //show the home icon
  document.getElementById("back-icon").style.display = "block";
  //delete all created edibles
  removeEdibles();
  removeBombs();
  //start game again
  setTimeout(createEdible, 1000);
  startGame();
}

function removeEdibles() {
  const createdEdibles = document.getElementsByClassName("edible");
  while (createdEdibles.length > 0) {
    createdEdibles[0].parentNode.removeChild(createdEdibles[0]);
  }
}
var icon = document.getElementById("light-icon");
icon.onclick = function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    document.getElementById("light-icon").classList.remove("fa-moon");
    document.getElementById("light-icon").classList.add("fa-sun");
  } else {
    document.getElementById("light-icon").classList.remove("fa-sun");
    document.getElementById("light-icon").classList.add("fa-moon");
  }
};

function displayChange() {
  foot.classList.toggle("toggle-footer");
}

function set_time_range_val() {
  var time = document.getElementById("time-range").value;
  time = parseInt(time);
  if (time % 60 == 0) {
    if(time == 60)
      document.getElementById("time-range-val").innerHTML = "1 min";
    else
      document.getElementById("time-range-val").innerHTML = time / 60 + " mins";
  }
  else {
    if(time < 60) {
      document.getElementById("time-range-val").innerHTML = time + " secs";
      return;
    }
    let min = Math.floor(time / 60);
    let sec = time % 60;
    if(min == 1)
      document.getElementById("time-range-val").innerHTML = "1 min " + sec + " secs";
    else
      document.getElementById("time-range-val").innerHTML = min + " mins " + sec + " secs";
  }
}
