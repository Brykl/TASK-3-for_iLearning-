const Table = require('cli-table');
const clc = require('cli-color');

function createTable (input) {
const table = new Table({
    head: [clc.red('Computer')+ clc.white(' \\ ') + clc.green("User"),
     ...input.map(item => clc.green(item))],
});

for(let i = 0; i < input.length; i++){
    table.push([clc.red(input[i])])
    for(let j = 0; j < input.length; j++){
    table[i].push(defineResult((input.length % 2), j, i))
    }
    
}

function defineResult(arr, userStep, computerStep) {
    if (userStep  > computerStep && (userStep - computerStep) <= arr ) {
        return clc.red("Lose")
    } else if(userStep  > computerStep && (userStep - computerStep) > arr ) {
        return clc.green("Win"); 
    } else if (userStep < computerStep && (computerStep - userStep) <= arr) { 
        return clc.green("Win"); 
    } else if(userStep < computerStep && (computerStep - userStep) > arr) {
        return clc.red("Lose");
    } else {
        return clc.white("Draw");
    }
}
console.log(table.toString());
}

module.exports = createTable;