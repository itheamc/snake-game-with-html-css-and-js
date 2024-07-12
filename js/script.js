const board  = document.getElementById("game-board")
const currentScore = document.getElementById('current-score')
const highScore = document.getElementById('high-score')
const speedTextBox = document.getElementById('speed')


let snake_speed = Number.parseInt(speedTextBox.value);
let current_score;
let high_score;
let last_frame_time;
let pressed_key;
let movement;
let snakes;
let food;


// Function to set default values
const initializeGame = () => {
    current_score = 0;
    high_score = localStorage.getItem('high-score') || 0
    highScore.innerText = "High Score - " + high_score
    currentScore.innerText = "Score - " + current_score
    last_frame_time = 0
    pressed_key = ""
    movement = {r: 0, c: 0}     // Here r represents the star row and c represents the start column
    snakes = [{r: Math.round(2 +  (35 - 1) * Math.random()), c: Math.round(2 +  (35 - 1) * Math.random())}]
    food = {r: Math.round(2 +  (34 - 1) * Math.random()), c: Math.round(2 +  (34 - 1) * Math.random())}
}

initializeGame()
/**
 * -----------------------------------------------------------------------------------------
 * This is the starting function of the game
 * @param {*} ctime -> It is the current time that the frame is created
 * @returns -> void
 * ------------------------------------------------------------------------------------------
 */
const main = (ctime) => {
    // Here speed will be controlled
    if ((ctime - last_frame_time)/1000 < 1/snake_speed) {
        window.requestAnimationFrame(main)
        return
    }

    last_frame_time = ctime

    gameEngine()
    window.requestAnimationFrame(main)

}


/**
 * ------------------------------------------------------------------------------------
 * Function to check whether snake is collided or not
 * @returns it will returns true or false
 * ------------------------------------------------------------------------------------
 */
const isCollied = () => {
    let is_colide = false
    if (snakes[0].r < 1 || snakes[0].r > 36 || snakes[0].c < 1 || snakes[0].c > 36) {
        is_colide = true
    }

    for (let i = 1; i < snakes.length; i++) {
        if (snakes[0].r === snakes[i].r && snakes[0].c === snakes[i].c) {
            is_colide = true
            break
        }
    }

    return is_colide
}

/**
 * ------------------------------------------------------------------------------
 * This is the game engine function.
 * It will handle all the task that the game needed
 * @returns It will not return anything i.e. return void
 * --------------------------------------------------------------------------------
 */
// Game engine function thal will handle all the logic and functionality releted to the snake and food
const gameEngine = () => {

    // Updating the snakes arrays as per the user key event
    if (isCollied()) {
        alert("Game Over")
        initializeGame()
        return
    }

    // Checking whether snake eaten food or not and updating the snakes array accordingly
    if ((pressed_key === "ArrowRight" && snakes[0].r == food.r && snakes[0].c - 1 == food.c) || 
        (pressed_key === "ArrowUp" && snakes[0].r == food.r + 1 && snakes[0].c == food.c) ||
        (pressed_key === "ArrowDown" && snakes[0].r == food.r - 1 && snakes[0].c == food.c) ||
        (pressed_key === "ArrowLeft" && snakes[0].r == food.r && snakes[0].c + 1 == food.c)) {
        
            snakes.unshift({r: snakes[0].r + movement.r, c: snakes[0].c + movement.c})
            // Placing food randomly with in the board
            food = {r: Math.round(2 +  (34 - 1) * Math.random()), c: Math.round(2 +  (34 - 1) * Math.random())}
            current_score += 1;
            currentScore.innerText = "Score - " + current_score

            if (current_score > high_score) {
                localStorage.setItem('high-score', current_score)
            }

    }

    // Movement of snakes
    // Updating the snakes body
    for (let i = snakes.length - 2; i >= 0; i--) {
        snakes[i + 1] = {...snakes[i]}
    }

    // Updating the snakes heads
    snakes[0].r += movement.r
    snakes[0].c += movement.c



    // Iterating each elements of snakes array and draw on the board with create element
    board.innerHTML = ""
    snakes.forEach((element, index) => {
        const snake_part = document.createElement('div')
        snake_part.style.gridRowStart = element.r
        snake_part.style.gridColumnStart = element.c
        if (index === 0) {
            snake_part.classList.add('snake-head')
            snake_part.innerText = "S"
        } else {
            snake_part.classList.add('snake-body')
        }

        board.appendChild(snake_part)
    });


    // Adding the food
    const snake_food = document.createElement('div')
    snake_food.style.gridRowStart = food.r
    snake_food.style.gridColumnStart = food.c
    snake_food.classList.add('snake-food')
    snake_food.innerHTML = "<img src='/snake-game-with-html-css-and-js/assets/images/mouse.png' alt='' srcset=''>"

    board.appendChild(snake_food)

}



/**
 * ---------------------------------------------------------------------------
 * Game Loop
 * --------------------------------------------------------------------------
 */
window.requestAnimationFrame(main)

/**
 * ---------------------------------------------------------------------------
 * Listening and handling keyDown event
 * --------------------------------------------------------------------------
 */
window.addEventListener('keydown', (e) => {
    const keyPress = e.key

    switch (keyPress) {
        case "ArrowUp":
            if (pressed_key != "ArrowDown") {
                movement.r = -1;    // Decreasing the row by 1 to move upward
                movement.c = 0;
                pressed_key = keyPress
            }
            break;

        case "ArrowDown":
            if (pressed_key != "ArrowUp") {
                movement.r = 1;     // Increasing the row by 1 to move downward
                movement.c = 0;
                pressed_key = keyPress
            }
            break;
            
        case "ArrowLeft":
            if (pressed_key != "ArrowRight") {
                movement.r = 0;
                movement.c = -1;    // Decreasing the column by 1 to move left
                pressed_key = keyPress
            }
            break;

        case "ArrowRight":
            if (pressed_key != "ArrowLeft") {
                movement.r = 0;
                movement.c = 1;     // Increasing the column by 1 to move right
                pressed_key = keyPress
            }
            break;
                            
        default:
            break;
    }

})


speedTextBox.addEventListener('change', (e) => {
    snake_speed = e.target.value
})
