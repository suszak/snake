let gameArray = [];

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
    for (let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            
        }
    }
}