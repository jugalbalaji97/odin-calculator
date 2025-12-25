const BUTTON_MAP = {
    "zero": "0",
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
    "add": "+",
    "subtract": "-",
    "divide": "/",
    "multiply": "*",
    "decimal": ".",
    "":"", //for updating display when operator is not assigned
};

const OPERATION_MAP = {
    "add": (a, b) => a + b,
    "subtract": (a, b) => a - b,
    "divide": (a, b) => a / b,
    "multiply": (a, b) => a * b,
};

let expression = {
    "operand1": "",
    "operator": "",
    "operand2": "",
    "isResult": false
};

let answer = 0;

const primaryDisplay = document.querySelector("#primary-display");
const secondaryDisplay = document.querySelector("#secondary-display")
const numbers = document.querySelector("#numbers");
const operators = document.querySelector("#operators");
const calculateButton = document.querySelector("#calculate");
const clearButton = document.querySelector("#clear");

function updateDisplay(isCalculate=false) {
    if (isCalculate) {
        secondaryDisplay.textContent = primaryDisplay.textContent;
        primaryDisplay.textContent = answer;
    }
    else {
        primaryDisplay.textContent = expression.operand1 + " " + BUTTON_MAP[expression.operator] + " " + expression.operand2;
    }
}

function calculate() {
    answer = OPERATION_MAP[expression.operator](Number
        (expression.operand1), Number(expression.operand2));
    expression.operand1 = `${answer}`;
    expression.operator = "";
    expression.operand2 = "";
    expression.isResult = true;
}

function clear() {
    expression.operand1 = "";
    expression.operator = "";
    expression.operand2 = "";
    expression.isResult = false;
    primaryDisplay.textContent = "";
    secondaryDisplay.textContent = "";
}

numbers.addEventListener("click", (e)=>{
    if (!expression.operator) {
        if(expression.isResult){
            clear();
            expression.operand1 = BUTTON_MAP[e.target.id];
        }
        else expression.operand1 += BUTTON_MAP[e.target.id];
    }
    else expression.operand2 += BUTTON_MAP[e.target.id];

    updateDisplay();
});

operators.addEventListener("click", (e)=>{
    if (expression.operand1 && !expression.operand2) expression.operator = e.target.id;
    else if (expression.operand1 && expression.operand2) {
        answer = calculate();
        updateDisplay(isCalculate=true);
        expression.operator = e.target.id;
        updateDisplay();
    }

    updateDisplay();
});

calculateButton.addEventListener("click", (e) => {
    if (expression.operator && expression.operand2) {
        calculate();
        updateDisplay(isCalculate=true);
    }
    e.stopPropagation();
});

clearButton.addEventListener("click", (e) => clear());
