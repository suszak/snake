let snakeArray = []; // snakeArray[0] -> eldest, snakeArray[snakeArray.length-1] ->  latest
let fruitsArray = [];
let table = null;
let scoreValue = 0;
let move = 4; // 1 -> up, 2 -> down, 3 -> left, 4 -> right
let flag = 0; // 0 -> pause, 1 -> start, 2 -> gameOver
let game; // game refresh interval
let fruit; // fruit generator interval
let currentMousePosition; // current mouse position
let mouseFlag = null; // show which border will we use, while mouse initialize
let mouseMoves = 0; // counts mouse moves (max 20);
let mouseInterval; // mouse interval
let mouseTimeout; // mouse timeout
const borderLeftArray = []; // array with left border values
    for(let i = 0; i <= 19; i++){
        borderLeftArray.push(i*20);
    }

const borderRightArray = []; // array with right border values
    for(let i = 0; i <= 19; i++){
        borderRightArray.push(19+i*20);
    }

const borderTopArray = []; // array with top border values
    for(let i = 0; i <= 19; i++){
        borderTopArray.push(i);
    }

const borderBottomArray = []; // array with bottom border values
    for(let i = 380; i <= 399; i++){
        borderBottomArray.push(i);
    }


// Initialize game:
gameBegin();


// Adding events
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("keydown", function(e) {
        if(e.keyCode === 32){
            if(flag === 1){
                pauseGame();
            } else if(flag === 0){
                gameRefresh();
            }
        }

        if(flag === 1){
            changeDirection(e);
            nextSteps();

            if (flag === 1){
                clearInterval(game);
                game = setInterval(nextSteps, 500);
            }
        }
    });

    const modal = document.querySelector(".snake-modal");
    const buttons = modal.querySelectorAll(".button");

    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", function(e){
        if(modal.getAttribute("style") === "display:block"){
            if(e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 27){
                closeModal();
            }
        }
    });
});


// This function generates random starting position
function generateStartPosition(){
    let startPools = [];
    snakeArray = [];

    for (let i = 42; i < 357; i++){
            temp = String(i)[String(i).length-1];
            if(Number(temp) > 2 && Number(temp) < 7){
                startPools.push(i);
            }
    }

    const firstPool = Math.floor(Math.random()*startPools.length);
    
    snakeArray.push(startPools[firstPool]-1);
    snakeArray.push(startPools[firstPool]);
}


// This function changes snakeArray depends on current move
function nextSteps(){
    const firstElement = snakeArray[snakeArray.length-1];
    const pools = document.querySelectorAll(".snake-game-table-pool");

    if(!wallCollision(firstElement) && !myselfCollision(firstElement)){
        if(currentMousePosition === firstElement){
            pools[currentMousePosition].classList.remove("snake-game-table-mouse");
            mouseMoves = 0;
            scoreValue += 2;
            clearInterval(mouseInterval);
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(function(){
                mouseFlag = generateMouse();
            }, 10000);
        }

        if(currentMousePosition === snakeArray[snakeArray.length-2]){
            pools[currentMousePosition].classList.remove("snake-game-table-mouse");
            mouseMoves = 0;
            scoreValue += 2;
            clearInterval(mouseInterval);
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(function(){
                mouseFlag = generateMouse();
            }, 10000);
        }

        switch (move) {
            case 1:
                if(fruitsArray.indexOf(firstElement) === -1){
                    snakeArray.shift();
                    snakeArray.push(firstElement-20);
                } else {
                    pools[firstElement].classList.remove("snake-game-table-fruit");
                    fruitsArray.splice(fruitsArray.indexOf(firstElement), 1);
                    snakeArray.push(firstElement-20);
                    scoreValue++;
                }
                break;
            case 2:
                if(fruitsArray.indexOf(firstElement) === -1){
                    snakeArray.shift();
                    snakeArray.push(firstElement+20);
                } else {
                    pools[firstElement].classList.remove("snake-game-table-fruit");
                    fruitsArray.splice(fruitsArray.indexOf(firstElement), 1);
                    snakeArray.push(firstElement+20);
                    scoreValue++;
                }
                break;
            case 3:
                if(fruitsArray.indexOf(firstElement) === -1){
                    snakeArray.shift();
                    snakeArray.push(firstElement-1);
                } else {
                    pools[firstElement].classList.remove("snake-game-table-fruit");
                    fruitsArray.splice(fruitsArray.indexOf(firstElement), 1);
                    snakeArray.push(firstElement-1);
                    scoreValue++;
                }
                break;
            case 4:
                if(fruitsArray.indexOf(firstElement) === -1){
                    snakeArray.shift();
                    snakeArray.push(firstElement+1);
                } else {
                    pools[firstElement].classList.remove("snake-game-table-fruit");
                    fruitsArray.splice(fruitsArray.indexOf(firstElement), 1);
                    snakeArray.push(firstElement+1);
                    scoreValue++;
                }
                break;
        }   
        gameStep();
    }
}


// This function generetes elements like: table, rows, pools (our game place)
function firstStep(){
    table = document.querySelector(".snake-game-table");
    let iterator = 0;
    let rows = document.querySelectorAll(".snake-game-table-row");

    for (let i = 0; i < 20; i++){
        const row = document.createElement("div");
        row.classList.add("snake-game-table-row");

        for(let j = 0; j < 20; j++){
            const pool = document.createElement("div");
            pool.classList.add("snake-game-table-pool");

            if (snakeArray.indexOf(iterator) !== -1){
                pool.id = "snake";
                if(snakeArray[snakeArray.length-1] === iterator){
                    pool.id = "snakeFirst";
                }
            }
            
            row.appendChild(pool);
            iterator++;
        }
        
        if (flag === 2){
            table.replaceChild(row, rows[i]);
        } else {
            table.append(row);
        }
    }

    const score = document.querySelector("#score");
    score.innerText = "Score: "+ scoreValue;
}


// This function changes pools id (snake or default pool)
function gameStep(){
    table = document.querySelector(".snake-game-table");
    let pools = table.querySelectorAll(".snake-game-table-pool");

    for(let i = 0; i < pools.length; i++){
        if(snakeArray.indexOf(i) !== -1){
            pools[i].id = "snake";

            if(snakeArray[snakeArray.length-1] === i){
                pools[i].id = "snakeFirst";
            }
        } else {
            pools[i].id = null;
        }
    }

    const score = document.querySelector("#score");
    score.innerText = "Score: "+ scoreValue;
}

// This function reads keyCode, and change our flag(move), which tell us about direction of snake
function changeDirection(e){
    switch (e.keyCode) {
        case 38: 
        // up
            if(move !== 2)
            move = 1;
            break;
        case 40:
        // down
            if(move !== 1)
            move = 2;
            break;    
        case 37: 
        // left
            if(move !== 4)
            move = 3;
            break;
        case 39: 
        // right
            if(move !== 3)
            move = 4;
            break;
    }
}

// This function generates random poll, which will be fruit
function generateFruit(){
    if(fruitsArray.length < 5){
        let randomPool;

        do{
            randomPool = Math.floor(Math.random()*400);
        }while(snakeArray.includes(randomPool))

        fruitsArray.push(randomPool);
        const pools = document.querySelectorAll(".snake-game-table-pool");
        pools[randomPool].classList.add("snake-game-table-fruit");
    }
}

// This function generates mouse, which is moving through the table
function generateMouse(){
    const rand = Math.floor(Math.random()*4);
    const pos = Math.floor(Math.random()*20);
    mouseMoves = 1;
    
    switch (rand){
        case 0:
            currentMousePosition = borderTopArray[pos];
            break;
        case 1:
            currentMousePosition = borderLeftArray[pos];
            break;
        case 2:
            currentMousePosition = borderBottomArray[pos];
            break;
        case 3:
            currentMousePosition = borderRightArray[pos];
            break;
    }
    mouseInterval = setInterval(moveMouse, 500);

    const pools = document.querySelectorAll(".snake-game-table-pool");
    pools[currentMousePosition].classList.add("snake-game-table-mouse");

    return rand;
}

// This function moves mouse through the table
function moveMouse(){
    const pools = document.querySelectorAll(".snake-game-table-pool");
    pools[currentMousePosition].classList.remove("snake-game-table-mouse");

    if (mouseMoves < 20){ 
        switch (mouseFlag){
            case 0:
                currentMousePosition += 20;
                break;
            case 1:
                currentMousePosition++;
                break;
            case 2:
                currentMousePosition -= 20;
                break;
            case 3:
                currentMousePosition--;
                break;
        }
        pools[currentMousePosition].classList.add("snake-game-table-mouse");
        mouseMoves++;  
    } else {
        mouseMoves = 0;
        clearInterval(mouseInterval);
        mouseTimeout = setTimeout(function(){
            mouseFlag = generateMouse();
        }, 10000);
    }
}

// This function checks if you hit a wall
function wallCollision(firstElement){
    switch (move){
        case 1:
            if(firstElement < 20){
                gameOver();
                return 1;
            }
            break;
        case 2:
            if(firstElement > 379){
               gameOver();
                return 1;
            }
            break;
        case 3:
            if(borderLeftArray.indexOf(firstElement) !== -1){
                gameOver(); 
                return 1;
            }
            break;
        case 4:
            if(borderRightArray.indexOf(firstElement) !== -1){
                gameOver();  
                return 1;
            }
            break;
    }
    return 0;
}

// This function checks if u hit yourself
function myselfCollision(firstElement){
    if(snakeArray.indexOf(firstElement) !== (snakeArray.length-1) && snakeArray.indexOf(firstElement) !== -1){
        gameOver(); 
        return 1;
    } else {
        return 0
    };
}

// This function closes modal and restarts game
function closeModal(){
    document.querySelector(".snake-game").setAttribute("style", "filter:none");
    document.querySelector(".snake-modal").setAttribute("style", "display:none");
    move = 4;
    fruitsArray = [];
    snakeArray = [];
    gameBegin();
    pauseGame();
}

// This function creates interval (game running)
function gameRefresh(){
    mouseTimeout = setTimeout(function(){
        mouseFlag = generateMouse();
    }, 10000);
    game = setInterval(nextSteps, 500);
    flag = 1;
    fruit = setInterval(generateFruit, 5000);
    document.querySelector("#state").innerText = "Running";
}

// This function clears interval (pausing game)
function pauseGame(){
    clearInterval(game);
    clearTimeout(mouseTimeout);
    clearInterval(mouseInterval);
    flag = 0;
    clearInterval(fruit);
    document.querySelector("#state").innerText = "Paused";
}

// This function is called when player lost game
function gameOver(){
    pauseGame();
    document.querySelector("#modalScore").innerText = "Final score: "+scoreValue;
    document.querySelector(".snake-game").setAttribute("style", "filter:blur(2px)");
    document.querySelector(".snake-modal").setAttribute("style", "display:block");
    flag = 2;
}

// This function initializes game
function gameBegin(){
    generateStartPosition();
    firstStep();
}