const screens = document.querySelectorAll('.screen');
var foot= document.querySelector('.footer');
var head = document.querySelector('.head');
const choose_btns = document.querySelectorAll('.choose-btn');
const start_btn = document.getElementById('start-btn')
const game_container = document.getElementById('game-container')
const timeEl = document.getElementById('time')
const scoreEl = document.getElementById('score')
const audio = new Audio("sounds/sound1.mp3");
let seconds = 30
let score = 0
let selected_edible = {}
var gameInterval;
var isRunning = -1;   //this defines the state of game running or not

start_btn.addEventListener('click', function(){
    screens[0].classList.add('up')
    head.style.display = "flex";
});

choose_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        selected_edible = { src, alt }
        screens[1].classList.add('up1')
        setTimeout(createEdible, 1000)
        game_container.style.height= "100vh"
        startGame()
        displayChange()
        audio.play();
    })
})

function startGame() {
    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("pause-button").style.display = "block";
    document.getElementById("gameOver-menu").style.display = "none";
    isRunning = 1;
    gameInterval = setInterval(decreaseTime, 1000);
    document.onkeydown = capturekey;

    function capturekey(e) {
        e = e || window.event;
        
        if (e.code == 'F5') {    
            if (confirm('Do You Want to Refresh ?')) {
                //allow to refresh
            } 
            else {
                //avoid from refresh
                e.preventDefault()
                e.stopPropagation()
            }
        }
        if (e.ctrlKey) {
            var c = e.which || e.keyCode;
            if (c == 82) {
                if (confirm('Do You Want to Refresh ?')) {
                    //allow to refresh
                } 
                else {
                    //avoid from refresh
                    e.preventDefault()
                    e.stopPropagation()
                }
            }
        }
    }
}

function showInstructions(){
    document.getElementById("instructions").style.display = "flex";
    document.getElementById("instructions2").style.display = "flex";
    document.getElementById("instructions3").style.display = "flex";
    if (isRunning != -1) {
        pauseGame()
    }

}

function closeInstructions(){
    document.getElementById("instructions").style.display = "none";
    document.getElementById("instructions2").style.display = "none";
    document.getElementById("instructions3").style.display = "none";
    isRunning = 1;
}

function gameOver(){
        document.getElementById("gameOver-menu").style.display = "flex";
        document.getElementById("pause-button").style.display = "none";
        finalScore.innerHTML = `Final Score : ${score}`
        clearInterval(gameInterval);
        isRunning = 0;
}

function starting(){
    document.getElementById("back-icon").style.display = "block";
}

function decreaseTime() {
    let m = Math.floor(seconds / 60)
    let s = seconds % 60
    m = m < 10 ? `0${m}` : m
    s = s < 10 ? `0${s}` : s
    timeEl.innerHTML = `Time: ${m}:${s}`
    if (s == 0) {
        gameOver()
    }else{
        seconds--
    }
}

function createEdible() {
    if (isRunning == 1) {
        const edible = document.createElement('div')
        edible.classList.add('edible')
        const { x, y } = getRandomLocation()
        edible.style.top = `${y}px`
        edible.style.left = `${x}px`
        edible.innerHTML = `<img src="${selected_edible.src}" alt="${selected_edible.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`

        edible.addEventListener('click', catchEdible)

        game_container.appendChild(edible)
    }
}

function getRandomLocation() {
    const width = window.innerWidth
    const height = window.innerHeight
    const x = Math.random() * (width - 200) + 100
    const y = Math.random() * (height - 200) + 100
    return { x, y }
}

function catchEdible() {
    if (isRunning == 1) {
        const audio = new Audio("sounds/sound2.mp3");
        increaseScore()
        this.classList.add('caught')
        setTimeout(() => this.remove(), 2000)
        addEdibles()
        audio.play();
    }
}

function addEdibles() {
    setTimeout(createEdible, 1000)
    setTimeout(createEdible, 1500)
}

function increaseScore() {
    score++
    scoreEl.innerHTML = `Score: ${score}`
}

// Page reload
function reset() {
    // startGame();
    location.reload();
    // window.close();
    // window.open("https://rakesh9100.github.io/Click-The-Edible-Game/");
}
function pauseGame() {
    //if running then pause the timer
    if (isRunning == 1) {
        clearInterval(gameInterval);
        isRunning = 0;
        //show pause-menu when game paused
        document.getElementById("pause-menu").style.display = "flex";
        document.getElementById("pause-button").style.display = "none";
        document.getElementById("home-icon").style.display = "none";
    }
    // else start the timer
    else {
        gameInterval = setInterval(decreaseTime, 1000);
        isRunning = 1;
        //hide pause-menu when game starts again
        document.getElementById("pause-menu").style.display = "none";
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("home-icon").style.display = "block";
    }
}
// Pause game by space bar
document.body.addEventListener("keyup", (e) => {
    if (e.keyCode == 32 || e.keyCode == 0) {
        //mozilla have "space" keycode 0 and other browsers 32
        if (isRunning != -1) {
            pauseGame()
        }
    }
})

function restartGame() {
    isRunning = 0; //this will stop new edibles from generating
    //reset time and score
    clearInterval(gameInterval);
    score = 0;
    seconds = 30;
    scoreEl.innerHTML = `Score: ${score}`
    timeEl.innerHTML = `Time: 00:30`
    //show the home icon
    document.getElementById("back-icon").style.display = "block";
    //delete all created edibles
    removeEdibles();
    //start game again
    setTimeout(createEdible, 1000)
    startGame()
}

function removeEdibles() {
    const createdEdibles = document.getElementsByClassName('edible');
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

    }
    else {
        document.getElementById("light-icon").classList.remove("fa-sun");
        document.getElementById("light-icon").classList.add("fa-moon");
    }
};



function displayChange(){
    foot.classList.toggle("toggle-footer");
}
