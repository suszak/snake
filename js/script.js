let snakeArray = []; // snakeArray[0] -> eldest, snakeArray[snakeArray.length-1] ->  latest
let fruitsArray = [];
let table = null;
let move = 4; // 1 -> up, 2 -> down, 3 -> left, 4 -> right
let flag = 0; // 0 -> pause, 1 -> start, 2 -> gameOver
let game; // game refresh interval
let fruit; // fruit generator interval
const borderLeftArray = [];
    for(let i = 0; i <= 19; i++){
        borderLeftArray.push(i*20);
    }

const borderRightArray = [];
    for(let i = 0; i <= 19; i++){
        borderRightArray.push(19+i*20);
    }

gameBegin();

// Adding events
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("keydown", function(e) {
        if(e.keyCode === 32){
            if(flag === 1){
                pauseGame();
            } else if(flag === 0){
                gameRefresh();
            } else if(flag === 2){
                move = 4;
                fruitsArray = [];
                snakeArray = [];
                gameBegin();
                pauseGame();
            }
        }
    });

    document.addEventListener("keydown", function(e) {
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

    console.log(buttons);
    for(let i = 0; i < buttons.length; i++){
        console.log(buttons[i]);
        buttons[i].addEventListener("click", closeModal);
    }
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
        switch (move) {
            case 1:
                if(fruitsArray.indexOf(firstElement) === -1){
                    snakeArray.shift();
                    snakeArray.push(firstElement-20);
                } else {
                    pools[firstElement].classList.remove("snake-game-table-fruit");
                    fruitsArray.splice(fruitsArray.indexOf(firstElement), 1);
                    snakeArray.push(firstElement-20);
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
    score.innerText = "Score: "+(snakeArray.length-2);
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
    score.innerText = "Score: "+(snakeArray.length-2);
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

// This function checks if you hit a wall
function wallCollision(firstElement){
    switch (move){
        case 1:
            if(firstElement < 20){
                pauseGame();
                document.querySelector("#state").innerHTML = "<p style='color:red'>Game over</p><p>Press spacebar</p>";
                document.querySelector(".snake-game").setAttribute("style", "filter:blur(5px)");
                document.querySelector(".snake-modal").setAttribute("style", "display:block");
                flag = 2;
                return 1;
            }
            break;
        case 2:
            if(firstElement > 379){
                pauseGame();
                document.querySelector("#state").innerHTML = "<p style='color:red'>Game over</p><p>Press spacebar</p>";
                document.querySelector(".snake-game").setAttribute("style", "filter:blur(5px)");
                document.querySelector(".snake-modal").setAttribute("style", "display:block");
                flag = 2;
                return 1;
            }
            break;
        case 3:
            if(borderLeftArray.indexOf(firstElement) !== -1){
                pauseGame();
                document.querySelector("#state").innerHTML = "<p style='color:red'>Game over</p><p>Press spacebar</p>";
                document.querySelector(".snake-game").setAttribute("style", "filter:blur(5px)");
                document.querySelector(".snake-modal").setAttribute("style", "display:block");
                flag = 2;  
                return 1;
            }
            break;
        case 4:
            if(borderRightArray.indexOf(firstElement) !== -1){
                pauseGame();
                document.querySelector("#state").innerHTML = "<p style='color:red'>Game over</p><p>Press spacebar</p>";
                document.querySelector(".snake-game").setAttribute("style", "filter:blur(5px)");
                document.querySelector(".snake-modal").setAttribute("style", "display:block");
                flag = 2;  
                return 1;
            }
            break;
    }
    return 0;
}

// This function checks if u hit yourself
function myselfCollision(firstElement){
    if(snakeArray.indexOf(firstElement) !== (snakeArray.length-1) && snakeArray.indexOf(firstElement) !== -1){
        pauseGame();
        document.querySelector("#state").innerHTML = "<p style='color:red'>Game over</p><p>Press spacebar</p>";
        alert("Game over!\nIf you want to restart game - press spacebar!");
        flag = 2;  
        return 1;
    } else {
        return 0
    };
}

// This function closes modal and restarts game
function closeModal(){
    document.querySelector(".snake-game").setAttribute("style", "filter:none");
    document.querySelector(".snake-modal").setAttribute("style", "display:none");
    console.log("zamknięte!");
}

// This function creates interval (game running)
function gameRefresh(){
    game = setInterval(nextSteps, 500);
    flag = 1;
    fruit = setInterval(generateFruit, 5000);
    document.querySelector("#state").innerText = "Running";
}

// This function clears interval (pausing game)
function pauseGame(){
    clearInterval(game);
    flag = 0;
    clearInterval(fruit);
    document.querySelector("#state").innerText = "Paused";
}

function gameBegin(){
    generateStartPosition();
    firstStep();
}