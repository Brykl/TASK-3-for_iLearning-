const secureRandom = require('secure-random');
const crypto = require('crypto');
const readline = require('readline');
const createTable = require('./tablet.js')
const chalk = require('chalk');


const rl =  readline.createInterface(process.stdin, process.stdout);

class Random {
    createKey() {  
       this.key = secureRandom(256).join("").toString('hex'); 
       this.key = crypto.createHash('sha3-256').update(this.key).digest('hex');
       return this.key;
    }
    makeHmac (step) {
        this.step = step;
        let hmac = crypto.createHmac('sha-256', this.key).update(this.step).digest('hex');
        return hmac;
    }
}   

class ComputerStep {
    createStep (countStep) {
        this.countStep = countStep;
        let step = Math.floor(Math.random() * this.countStep) + 1;
        return step;
    }
}

class Menu {
    createOrder (arr, computerStep) {
        console.log("Available moves:")
        arr.forEach((item, index2) => {
            console.log(chalk.green(`${index2 + 1}. - ${item}`));
        });
        console.log(chalk.yellow("0. - exit \n") + chalk.blue("?. - help"));
    }
    helpMenu (arr, computerStep) {
        console.log(chalk.blue(
            "This is a table of user's moves outcomes in response to computer's moves."))
        createTable(arr);
        exitMenu(arr, computerStep);
    }
    checkWinner (arr, userStep , computerStep) {
        this.arr = arr.length / 2;
        defineResult(this.arr, userStep, computerStep);
    }
    resultMenu (arr ,userStep , computerStep) {
        console.log(chalk.green('Your move: ' + arr[userStep - 1]));
        console.log(chalk.red('Computer move: ' + arr[computerStep - 1]));
        this.checkWinner(arr, userStep , computerStep)
        console.log('finish\n' + "HMAC key: " + key + 
        '\nhttps://www.devglan.com/online-tools/hmac-sha256-online' );
        rl.close();
    }
}

const countStep = process.argv.slice(2);

const computerStep = new ComputerStep();
const randomStep = computerStep.createStep(countStep.length);
const randomStepString = randomStep.toString();

const random = new Random();
const key = random.createKey();
const hmac = random.makeHmac(randomStepString)

const menuStatus = new Menu();

if(countStep.length % 2 != 0 && countStep.length > 1 
    && !checkIfDuplicateExists(countStep)){
        console.log('Generated HMAC:', hmac)
        menuStatus.createOrder(countStep, randomStep);
        inputMenu(countStep, randomStep);
} else if(checkIfDuplicateExists(countStep)){
        console.log("Error: you have written the same parameters");
        console.log("for example: node .\\index.js 1 2 3  - correct");
        console.log("for example: node .\\index.js 1 1 3  - not correct");
        rl.close();
} else if (countStep.length % 2 == 0 && countStep.length > 0){
        console.log("Error: you have written an even number of parameters");
        console.log("for example: node .\\index.js 1 2 3  - correct");
        console.log("for example: node .\\index.js 1 2 3 4 - not correct");
        rl.close();
} else if(countStep.length < 3) {
        console.log("Error: you have written less than 3 parameters");
        console.log("for example: node .\\index.js 1 2 3  - correct");
        console.log("for example: node .\\index.js 1  - not correct");
        rl.close();
}

function userInput(userStep, arr, computerStep) {
    if (userStep == '0') {
        rl.close();
    } else if (userStep == '?') {
        menuStatus.helpMenu(arr);
    } else if (arr.includes(arr[userStep - 1 ])) {
         menuStatus.resultMenu(arr, userStep, computerStep);

    } else {
        console.log("Try again\n" + "This number is not available");
        inputMenu(arr, computerStep, rl);
    }
}
function exitMenu (arr, computerStep) {
    rl.question('Enter ? for exit: ', userStep => {
        if(userStep == "?"){
            menuStatus.createOrder(countStep, randomStep);
            inputMenu(countStep, randomStep);
        }  else {
            exitMenu();
        }
        
    });
} 
function defineResult(arr, userStep, computerStep) {
    if (userStep  > computerStep && (userStep - computerStep) <= arr ) {
        console.log(chalk.red("You lose!"));
    } else if(userStep  > computerStep && (userStep - computerStep) > arr ) {
        console.log(chalk.green("You win!"));
    } else if (userStep < computerStep && (computerStep - userStep) <= arr) {
        console.log(chalk.green("You win!"));
    } else if(userStep < computerStep && (computerStep - userStep) > arr) {
        console.log(chalk.red("You lose!"));
    } else {
        console.log(chalk.yellow("Draw!"));
    }
}

function inputMenu(arr, computerStep) {
    rl.question('Enter your move: ', userStep => {
        userInput(userStep, arr, computerStep);
    });
}

function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
}





















