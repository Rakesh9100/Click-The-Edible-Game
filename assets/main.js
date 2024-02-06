const screens = document.querySelectorAll(".screen");
var foot = document.querySelector(".footer");
var head = document.querySelector(".head");
const choose_btns = document.querySelectorAll(".choose-btn");
const start_btn = document.getElementById("start-btn");
const game_container = document.getElementById("game-container");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");

// cursor movement
window.addEventListener('mousemove', function (e) {
    var rings = document.querySelectorAll(".ring");
    var cursordivdiv = document.querySelectorAll(".cursor div div");
    var instructionsDiv = document.getElementById("instructions");
    var instructionsDiv1 = document.getElementById("instructions2");
    var instructionsDiv2 = document.getElementById("instructions3");
    var gameplayTimeDiv = document.getElementById("gameplayTime");
    var pauseBoxDiv = document.getElementById("pause-menu");
    var gameOverDiv = document.getElementById("gameOver-menu");

    cursordivdiv.forEach(function (element) {
        if (
            e.target.tagName === 'A' ||
            e.target.tagName === 'BUTTON' ||
            (e.target.parentNode && e.target.parentNode.tagName === 'BUTTON') ||
            e.target.tagName === 'I' ||
            e.target.tagName === 'IMG'

        ) {
            element.style.background = 'white';
            element.style.boxShadow = '0 0 10px white';
        } else {
            element.style.background = 'transparent';
            element.style.boxShadow = '0 0 10px white';
        }
    });

    rings.forEach(function (ring) {
        ring.style.transform = `translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`;
    });

    if (
        isCursorOnElement(e, instructionsDiv) ||
        isCursorOnElement(e, instructionsDiv1) ||
        isCursorOnElement(e, instructionsDiv2) ||
        isCursorOnElement(e, gameplayTimeDiv) ||
        isCursorOnElement(e, pauseBoxDiv) ||
        isCursorOnElement(e, gameOverDiv)
    ) {
        cursordivdiv.forEach(function (element) {
            element.style.boxShadow = '0 0 10px blue';
        });
    }
});

function isCursorOnElement(event, element) {
    var rect = element.getBoundingClientRect();
    return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
    );
}



// loading audio files
const bgm1 = new Audio("sounds/bgm1.mp3");
bgm1.volume = 0.6;
const bgm2 = new Audio("sounds/bgm2.mp3");
bgm2.volume = 0.6;
const game_over_audio = new Audio("sounds/gameOver.mp3");
const choose_edible = new Audio("sounds/start.mp3");
const click_edible_audio = new Audio("sounds/edible.mp3");
const click_bomb_audio = new Audio("sounds/explosion.wav");
const click_rotten_audio = new Audio("sounds/splat.mp3");
// loading audio files

// game variables
var seconds = 0;
let score = 0;
var scoresArray = [];
var playerScores = [];
let selected_edible = {};
var gameInterval;
var timer;
var isRunning = -1; //this defines the state of game running or not
// game variables

// Add an event listener to the window to handle autoplay restrictions
window.addEventListener('click', function () {
    if (bgm1.paused && bgm2.paused) {
        // Start playing the background music only if it's not already playing
        bgm1.play();
    }
});

// Also, modify the setInterval function for game bgm management
setInterval(() => {
    if (isRunning == -1) { // if the game is not running
        bgm2.pause();
        bgm2.currentTime = 0;
        game_over_audio.pause();
        game_over_audio.currentTime = 0;
        if (bgm1.currentTime >= bgm1.duration - 0.1 || bgm1.currentTime == 0) {
            bgm1.pause();
            bgm1.currentTime = 0;
            bgm1.play(); // Start playing bgm1 if it's not playing
        }
    } else if (isRunning == 1) { // if the game is running
        bgm1.pause();
        bgm1.currentTime = 0;
        game_over_audio.pause();
        game_over_audio.currentTime = 0;
        if (bgm2.currentTime >= bgm2.duration - 0.1 || bgm2.currentTime == 0) {
            bgm2.pause();
            bgm2.currentTime = 0;
            bgm2.play(); // Start playing bgm2 if it's not playing
        }
    } else {
        bgm1.pause();
        bgm2.pause();
    }
}, 500);

// game bgm management

// -------------- bomb management section ----------------
var totalBombs = 0; // total number of bombs on screen at a time
var MAX_BOMBS; // maximum number of bombs that can be on screen
var MAX_BOMB_LIFE; // maximum life of a bomb
var MAX_LIVES; // maximum number of lives
var lives; // current number of lives
var prob; //probublity of creating a bomb
var timegap_edible;
var timegap_rotten;
var prob_rotten;

// create a new bomb
function createBomb() {
    const bomb = document.createElement('div');
    bomb.classList.add('bomb');
    bomb.classList.add('bomb-live');
    const { x, y } = getRandomLocation();
    bomb.style.top = `${y}px`;
    bomb.style.left = `${x}px`;
    bomb.innerHTML = `<img src="images/bomb.png" alt="💣" style="transform: rotate(${Math.random() * 360}deg)" /><p style="display: none">${1 + Math.floor(Math.random() * MAX_BOMB_LIFE)}</p>`;
    bomb.addEventListener('click', explodeBomb);
    game_container.appendChild(bomb);
}

// create multiple bombs
function createBombs() {
    for (let i = 0; i < MAX_BOMBS; i++) {
        createBomb();
        totalBombs++;
    }
}

// explode an existing bomb
function explodeBomb() {
    if (isRunning !== 1) return;
    if (lives <= 0) return;
    if (this.classList.contains('dead')) return;
    this.innerHTML = `<img src="images/explosion.png" alt="💥" style="transform: rotate(${Math.random() * 360}deg)" />`;
    this.classList.remove('bomb-live');
    this.classList.add('dead');
    setTimeout(() => {
        this.remove();
        totalBombs--;
    }, 2000);
    lives--;
    if (click_bomb_audio.currentTime > 0) {
        click_bomb_audio.pause();
        click_bomb_audio.currentTime = 0;
    }
    click_bomb_audio.play();
}

// check if a bomb's life is over
function checkBombLife() {
    const bombs = document.getElementsByClassName('bomb-live');
    for (let i = 0; i < bombs.length; i++) {
        const bomb = bombs[i];
        const life = bomb.querySelector('p');
        if (life.innerText <= 0) {
            bomb.classList.add('dead');
            bomb.classList.remove('bomb-live');
            setTimeout(() => {
                bomb.remove();
                totalBombs--;
            }, 2000);
        } else {
            life.innerText--;
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

// --------------- Uploading Image Start ----------------

const form = document.querySelector("form");
const dropArea = document.querySelector(".drag-area");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");

const allowed_EXT = /\.(png)$/i;

const files_name_upload = [];

const dragForm = document.querySelector("#drag-form");
const dragText = document.querySelector("#drag_text");
const dragCloud = document.querySelector("#drag-cloud");
const dragInput = document.querySelector("#file-input");
const dragZone = document.querySelector("#drag-area");
const dragWarper = document.querySelector("#drag-warper");

// Displays the Warning message
function showToast(s, c) {
    var x = document.querySelector("#snackbar");
    var text = document.createTextNode(s);
    x.style.backgroundColor = c;
    x.textContent = "";
    x.appendChild(text);
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

// Form click event
form.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({ target }) => {
    let file = target.files;
    if (file.length === 1) {
        if (!allowed_EXT.exec(file[0].name)) {
            showToast("Only png files are allowed", "#fff");
        } else {
            if (!files_name_upload.includes(file[0].name)) {
                files_name_upload.push(file[0].name);
                uploadFile(file[0].name);
            }
        }
    } else {
        showToast("Multiple file uploading is forbidden", "#fff");
    }
};

dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dragText.textContent = "Release to Upload File";
    dragForm.style.borderColor = "#000";
    dragText.style.fontSize = "18px";
    dragText.style.color = "#000";
});

dropArea.addEventListener("dragleave", () => {
    dragText.textContent = "Click Or Drag and Drop File to Upload";
    dragForm.style.borderColor = "#000";
    dragText.style.fontSize = "18px";
    dragText.style.color = "#000";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    var all_drop_files = event.dataTransfer.files;

    if (all_drop_files.length === 1) {
        if (!allowed_EXT.exec(all_drop_files[0].name)) {
            showToast("Only Image files are allowed", "#fff");
        } else {
            if (!files_name_upload.includes(all_drop_files[0].name)) {
                files_name_upload.push(all_drop_files[0].name);
                uploadFile(all_drop_files[0]);
                fileInput.files = all_drop_files;
                fileInput.dispatchEvent(new Event("change"));
            }
        }
    } else {
        showToast("Multiple file uploading is forbidden", "#fff");
    }
    dragText.textContent = "Click Or Drag and Drop File to Upload";
    dragForm.style.borderColor = "#000";
    dragText.style.fontSize = "18px";
    dragText.style.color = "#000";
});

function uploadFile(file) {
    const fileName = typeof file === "string" ? file : file.name;
    let uploadArea = document.querySelector(".uploaded-area");
    uploadArea.style.display = "block";
    uploadArea.innerHTML = `
  <li class="row-upload">
    <div class="content-upload upload">
        <img src="images/upload.png" class="file-preview" alt="preview">
      <div class="details-upload">
        <p class="name">${fileName.slice(0, fileName.length >= 21 ? 21 : fileName.length) + (fileName.length >= 21 ? '...' : '')} • Uploaded</p>
      </div>
    </div>
    <i class="fas fa-check"></i>
  </li>`;
}

const previewPhoto = () => {
    const file = fileInput.files;
    if (file) {
        const fileReader = new FileReader();
        const preview = document.querySelector(".file-preview");
        fileReader.onload = (event) => {
            preview.setAttribute("src", event.target.result);
            const play_on_upload_btn = document.querySelector("#upload-btn");
            play_on_upload_btn.style.display = "block";
        };
        fileReader.readAsDataURL(file[0]);
    }
};
fileInput.addEventListener("change", previewPhoto);

// Upload Play----

document.querySelector("#upload-btn").addEventListener("click", () => {
    const img = document.querySelector(".file-preview");
    const src = img.getAttribute("src");
    const alt = img.getAttribute("alt");
    selected_edible = { src, alt };
    screens[1].classList.add("up1");
    game_container.style.height = "100vh";
    startGame();
    displayChange();
    choose_edible.play();
});

document.querySelectorAll(".choose-btn").forEach(button => {
    button.addEventListener("click", () => {
        const img = button.querySelector("img");
        const src = img.getAttribute("src");
        const alt = img.getAttribute("alt");
        selected_edible = { src, alt };
        screens[1].classList.add("up1");
        game_container.style.height = "100vh";
        startGame();
        displayChange();
        choose_edible.play();
    });
});

// --------------- Uploading Image End ----------------

function chooseGameplayTime() {
    document.getElementById("time").style.display = "none";
    document.getElementById("gameplayTime").style.display = "flex";
    document.getElementById("time-range").addEventListener("change", function (e) {
        seconds = parseInt(document.getElementById("time-range").value) - 1;
        return seconds;
    });
}

function closeGameplayDialog() {

    //Taking the value from difficulity options
    var ele = document.getElementsByName('mode');
    var val;
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            val = ele[i].value;
    }

    //changed the values accordingly
    MAX_BOMBS = 7 * val; // maximum number of bombs that can be on screen
    MAX_BOMB_LIFE = 5 * val; // maximum life of a bomb
    MAX_LIVES = (3 - val) + 1; // maximum number of lives
    prob = 0.3 * val; //probublity of creating a bomb
    lives = MAX_LIVES; //max number of lives
    timegap_edible = (1000 / val); //time between two edible
    timegap_rotten = (1500 / val); //time gap betwen two rotten
    prob_rotten = 0.3 * val; //probablity of rotten creating


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
    var instructionsModal = document.getElementById("instructions");
    var instructionsModal2 = document.getElementById("instructions2");
    var instructionsModal3 = document.getElementById("instructions3");
    instructionsModal.style.display = "flex";
    instructionsModal2.style.display = "flex";
    instructionsModal3.style.display = "flex";
    // Trigger reflow to ensure the transition is applied
    void instructionsModal.offsetWidth;
    instructionsModal.classList.add("show");
    void instructionsModal2.offsetWidth;
    instructionsModal2.classList.add("show");
    void instructionsModal3.offsetWidth;
    instructionsModal3.classList.add("show");
    pauseGame();
}

function closeInstructions() {
    var instructionsModal = document.getElementById("instructions");
    instructionsModal.classList.remove("show");
    var instructionsModal2 = document.getElementById("instructions2");
    instructionsModal2.classList.remove("show");
    var instructionsModal3 = document.getElementById("instructions3");
    instructionsModal3.classList.remove("show");
    // Add a delay before hiding the instructions to allow the animation to play
    setTimeout(function() {
        instructionsModal.style.display = "none";
        instructionsModal2.style.display = "none";
        instructionsModal3.style.display = "none";
        if (isRunning == 0)
            isRunning = 1;
    }, 500); // Match the duration of the animation
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

    bgm1.pause();
    bgm1.currentTime = 0;
    bgm2.pause();
    bgm2.currentTime = 0;
    if (game_over_audio.currentTime > 0) {
        game_over_audio.pause();
        game_over_audio.currentTime = 0;
    }
    game_over_audio.play();

    // -------------- bomb management section ----------------
    lives = MAX_LIVES;
    totalBombs = 0;
    // -------------- bomb management section ----------------
}

function starting() {
    document.getElementById("back-icon").style.display = "block";
}

// function maintaining the game time (also acts as main loop for the game)
function decreaseTime() {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;

    // ---------- displaying total lives -------------
    let _lives = "";
    for (let i = 1; i <= MAX_LIVES; i++) {
        if (i <= lives)
            _lives += '❤️'
        else
            _lives += '🖤'
    }
    // ---------- displaying total lives -------------
    timeEl.innerHTML = `Time: ${m}:${s} <hr> ${_lives}`;

    // -------------- bomb management section ----------------
    if (totalBombs < MAX_BOMBS) { // check if there are already more than enough bombs present on screen
        if (Math.random() < prob) { // randomly decide whether to create a bomb or not
            createBomb();
            totalBombs++;
        }
    }
    // -------------- bomb management section ----------------

    // -------------- game over section ----------------
    if ((s == 0 && m == 0) || lives == 0) {
        gameOver();
        // -------------- game over section ----------------
    } else {
        seconds--;
        // -------------- bomb management section ----------------
        checkBombLife();
        // -------------- bomb management section ----------------
        checkRottenEdibleLife();
    }
}

// -------------- edible management section ----------------
function createRottenEdible() {
    if (isRunning == 1) {
        const edible = document.createElement("div");
        edible.classList.add("edible");
        edible.classList.add("rotten");
        const { x, y } = getRandomLocation();
        edible.style.top = `${y}px`;
        edible.style.left = `${x}px`;
        edible.innerHTML = `<img src="${selected_edible.src}" alt="${selected_edible.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;
        edible.innerHTML += `<p style="display: none">${1 + (Math.random() * 5)}</p>`;
        edible.addEventListener("click", catchRottenEdible);
        game_container.appendChild(edible);
    }
}

function catchRottenEdible() {
    if (isRunning == 1) {
        decreaseScore();
        this.classList.remove("rotten");
        this.innerHTML = `<img src="images/splat.png" alt="🦠" />`;
        this.classList.add("caught");
        setTimeout(() => this.remove(), 2000);
        if (click_rotten_audio.currentTime > 0) {
            click_rotten_audio.pause();
            click_rotten_audio.currentTime = 0;
        }
        click_rotten_audio.play();
        addEdibles();
    }
}

function checkRottenEdibleLife() {
    const rottenEdibles = document.getElementsByClassName("rotten");
    for (let i = 0; i < rottenEdibles.length; i++) {
        const rottenEdible = rottenEdibles[i];
        const life = rottenEdible.querySelector("p");
        rottenEdible.querySelector("img").style.filter = `invert(${20 + (6 - life.innerText) * 7.5}%)`;
        if (life.innerText <= 0) {
            rottenEdible.classList.add("caught");
            setTimeout(() => rottenEdible.remove(), 2000);
        } else {
            rottenEdible.querySelector("p").innerText--;
        }
    }
}

function createEdible() {
    if (isRunning == 1) {
        const edible = document.createElement("div");
        edible.classList.add("edible");
        const { x, y } = getRandomLocation();
        edible.style.top = `${y}px`;
        edible.style.left = `${x}px`;
        edible.innerHTML = `<img src="${selected_edible.src}" alt="${selected_edible.alt
            }" style="transform: rotate(${Math.random() * 360}deg)" />`;

        edible.addEventListener("click", catchEdible);
        game_container.appendChild(edible);
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
        increaseScore();
        this.classList.add("caught");
        setTimeout(() => this.remove(), 2000);
        addEdibles();
        if (click_edible_audio.currentTime > 0) {
            click_edible_audio.pause();
            click_edible_audio.currentTime = 0;
        }
        click_edible_audio.play();
    }
}

function addEdibles() {
    setTimeout(createEdible, timegap_edible);
    // add rotten edibles also
    if (Math.random() < prob_rotten)
        setTimeout(createRottenEdible, timegap_rotten);
    else
        setTimeout(createEdible, timegap_rotten);
}

// -------------- edible management section ----------------

function increaseScore() {
    score++;
    scoreEl.innerHTML = `Score: ${score}`;
}

function decreaseScore() {
    score--;
    scoreEl.innerHTML = `Score: ${score}`;
}

// Page reload
function reset() {
    scoresArray = [];
    location.reload();
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
    isRunning = -1; //this will stop new edibles from generating
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
var themeicon = document.getElementById("light-icon");
themeicon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        document.getElementById("light-icon").classList.remove("fa-moon");
        document.getElementById("light-icon").classList.add("fa-sun");
    } else {
        document.getElementById("light-icon").classList.remove("fa-sun");
        document.getElementById("light-icon").classList.add("fa-moon");
    }
};
var volumeicon = document.getElementById("volume-off-icon");
volumeicon.onclick = function () {
    if (document.getElementById("volume-off-icon").classList.contains("fa-volume-up")) {
        bgm1.volume = 0;
        bgm2.volume = 0;
        game_over_audio.volume = 0;
        choose_edible.volume = 0;
        click_edible_audio.volume = 0;
        click_bomb_audio.volume = 0;
        click_rotten_audio.volume = 0;
        document.getElementById("volume-off-icon").classList.remove("fa-volume-up");
        document.getElementById("volume-off-icon").classList.add("fa-volume-off");
    } else {
        bgm1.volume = 0.6;
        bgm2.volume = 0.6;
        game_over_audio.volume = 0.6;
        choose_edible.volume = 0.6;
        click_edible_audio.volume = 0.6;
        click_bomb_audio.volume = 0.6;
        click_rotten_audio.volume = 0.6;
        document.getElementById("volume-off-icon").classList.add("fa-volume-up");
        document.getElementById("volume-off-icon").classList.remove("fa-volume-off");
    }
};
function displayChange() {
    foot.classList.toggle("toggle-footer");
}

// displaying the selected time on screen in real time.
function set_time_range_val() {
    var time = document.getElementById("time-range").value;
    time = parseInt(time);
    if (time % 60 == 0) {
        if (time == 60)
            document.getElementById("time-range-val").innerHTML = "1 min";
        else
            document.getElementById("time-range-val").innerHTML = time / 60 + " mins";
    }
    else {
        if (time < 60) {
            document.getElementById("time-range-val").innerHTML = time + " secs";
            return;
        }
        let min = Math.floor(time / 60);
        let sec = time % 60;
        document.getElementById("time-range-val").innerHTML = min + " min " + sec + " secs";
    }
}
function scrollToTop() {
    var container2 = document.querySelector(".container2");
    container2.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// Hide the progress bar container initially
document.getElementById("progress-bar-container").style.display = "none";

// Show or hide the container based on .container2 scroll position, only if necessary
document.querySelector(".container2").onscroll = function () {
    var container = document.getElementById("progress-bar-container");
    if (this.scrollHeight > this.clientHeight) { // Check if scrolling is necessary
        if (this.scrollTop > 50) {
            container.style.display = "block";
        } else {
            container.style.display = "none";
        }
    }
};

// Remove the global scroll event listener, as it's handled within .container2
// window.addEventListener('scroll', function () { ... });

// Circular progress bar initialization and update
const progressBarContainer = document.getElementById("progress-bar-container");

document.querySelector(".container2").addEventListener("scroll", updateProgressBar);

// Update progress bar based on scroll position
function updateProgressBar() {
    const scrollHeight = document.querySelector(".container2").scrollHeight;
    const scrollTop = document.querySelector(".container2").scrollTop;
    const windowHeight = window.innerHeight;

    const scrollPercentage = (scrollTop / (scrollHeight - windowHeight)) * 100;
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.setProperty('--progress-value', scrollPercentage);
}

// Hide the progress bar container when the page is not visible
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
        document.getElementById("progress-bar-container").style.display = "none";
    }
});