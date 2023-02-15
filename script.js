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
var isRunning;   //this defines the state of game running or not

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
    if(isRunning == 1){
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
    }
    // else start the timer
    else {
        gameInterval = setInterval(increaseTime, 1000);
        isRunning = 1;
    }
}