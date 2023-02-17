const screens = document.querySelectorAll('.screen');
const choose_btns = document.querySelectorAll('.choose-btn');
const start_btn = document.getElementById('start-btn')
const game_container = document.getElementById('game-container')
const timeEl = document.getElementById('time')
const scoreEl = document.getElementById('score')
let seconds = 0
let score = 0
let selected_edible = {}
var gameInterval;
var isRunning=-1;   //this defines the state of game running or not

start_btn.addEventListener('click', () => screens[0].classList.add('up'))

choose_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        selected_edible = { src, alt }
        screens[1].classList.add('up')
        setTimeout(createEdible, 1000)
        startGame()
    })
})

function startGame() {
    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("pause-button").style.display = "block";
    isRunning = 1;
    gameInterval = setInterval(increaseTime, 1000)
}

function increaseTime() {
    let m = Math.floor(seconds / 60)
    let s = seconds % 60
    m = m < 10 ? `0${m}` : m
    s = s < 10 ? `0${s}` : s
    timeEl.innerHTML = `Time: ${m}:${s}`
    seconds++
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
        increaseScore()
        this.classList.add('caught')
        setTimeout(() => this.remove(), 2000)
        addEdibles()
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
    window.close();
    window.open("https://rakesh9100.github.io/Click-The-Edible-Game/");
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
        gameInterval = setInterval(increaseTime, 1000);
        isRunning = 1;
        //hide pause-menu when game starts again
        document.getElementById("pause-menu").style.display = "none";
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("home-icon").style.display = "block";
    }
}
// Pause game by space bar
document.body.addEventListener("keyup",(e)=>{
    if(e.keyCode==32 || e.keyCode==0){
        //mozilla have "space" keycode 0 and other browsers 32
        if(isRunning!=-1){
            pauseGame()
        }
    }
})

function restartGame() {
    isRunning = 0; //this will stop new edibles from generating
    //reset time and score
    clearInterval(gameInterval);
    score = 0;
    seconds = 0;
    scoreEl.innerHTML = `Score: ${score}`
    timeEl.innerHTML = `Time: 00:00`
    //show the home icon
    document.getElementById("home-icon").style.display = "block";
    //delete all created edibles
    removeEdibles();
    //start game again
    setTimeout(createEdible, 1000)
    startGame()
}

function removeEdibles(){
    const createdEdibles = document.getElementsByClassName('edible');
    while(createdEdibles.length > 0){
        createdEdibles[0].parentNode.removeChild(createdEdibles[0]);
    }
 }