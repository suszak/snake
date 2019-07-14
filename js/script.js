let gameArray = [];
let table = null;
let flag = 4;

gameArray = firstStep(gameArray);
gameStep();

document.addEventListener("keydown", changeDirection);



function firstStep(arr){
    const startPool = [33,34,35,36,37,
                       43,44,45,46,47,
                       53,54,55,56,57,
                       63,64,65,66,67,
                       73,74,75,76,77];

    const firstPool = Math.floor(Math.random()*startPool.length);
    
    for(let i = 0; i < 100; i++){
        if(i === startPool[firstPool]) {
            arr[i] = 1;
            arr[i-1] = 1;
        } else {
            arr[i] = 0;
        }
    }
    return arr;
}

function gameStep(){
    table = document.querySelector(".snake-game-table");
    let iterator = 0;

    for (let i = 0; i < 10; i++){
        const row = document.createElement("div");
        row.classList.add("snake-game-table-row");

        for(let j = 0; j < 10; j++){
            const pool = document.createElement("div");
            pool.classList.add("snake-game-table-pool");

            if (gameArray[iterator] === 1){
                pool.id = "snake";
            }

            row.appendChild(pool);
            iterator++;
        }
    
        table.append(row);

    }
}

function changeDirection(e){
    switch (e.keyCode) {
        case 38: 
        // up
            flag = 1;
            break;
        case 40:
        // down
            flag = 2;
            break;    
        case 37: 
        // left
            flag = 3;
            break;
        case 39: 
        // right
            flag = 4;
            break;
    }
}