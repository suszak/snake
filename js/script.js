let snakeArray = []; // snakeArray[0] -> eldest, snakeArray[snakeArray.length-1] ->  latest
let table = null;
let flag = 4;
let game;

generateStartPosition();
gameStep();

gameRefresh();
document.addEventListener("keydown", changeDirection);



function generateStartPosition(){
    const startPools = [33,34,35,36,37,
                        43,44,45,46,47,
                        53,54,55,56,57,
                        63,64,65,66,67,
                        73,74,75,76,77];

    const firstPool = Math.floor(Math.random()*startPools.length);
    
    snakeArray.push(startPools[firstPool]-1);
    snakeArray.push(startPools[firstPool]);
}

function nextSteps(){
    const firstElement = snakeArray[snakeArray.length-1];

    switch (flag) {
        case 1:
            snakeArray.shift();
            snakeArray.push(firstElement-10);
            break;
        case 2:
            snakeArray.shift();
            snakeArray.push(firstElement+10);
            break;
        case 3:
            snakeArray.shift();
            snakeArray.push(firstElement-1);
            break;
        case 4:
            snakeArray.shift();
            snakeArray.push(firstElement+1);
            break;
    }
    gameStep();
}

function gameStep(){
    table = document.querySelector(".snake-game-table");
    let iterator = 0;
    let state;
    if(document.querySelectorAll(".snake-game-table-row").length === 0){
        state = 0;
    } else {
        state = 1;
    }

    for (let i = 0; i < 10; i++){
        const row = document.createElement("div");
        row.classList.add("snake-game-table-row");

        for(let j = 0; j < 10; j++){
            const pool = document.createElement("div");
            pool.classList.add("snake-game-table-pool");

            if (snakeArray.indexOf(iterator) !== -1){
                pool.id = "snake";
            }

            row.appendChild(pool);
            iterator++;
        }
        

        if(state === 0){
            table.append(row);
        } else if (state === 1) {
            const oldRow = table.querySelectorAll(".snake-game-table-row")[i];
            table.replaceChild(row, oldRow);
        }
    }
}

function changeDirection(e){
    switch (e.keyCode) {
        case 38: 
        // up
            if(flag !== 2)
            flag = 1;
            break;
        case 40:
        // down
            if(flag !== 1)
            flag = 2;
            break;    
        case 37: 
        // left
            if(flag !== 4)
            flag = 3;
            break;
        case 39: 
        // right
            if(flag !== 3)
            flag = 4;
            break;
    }
}

function gameRefresh(){
    game = setInterval(nextSteps, 1000);
}