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

let primaryDisplayText = "";
let secondaryDisplayText = "";

const primaryDisplay = document.querySelector("#primary-display");
const secondaryDisplay = document.querySelector("#secondary-display")
const numbers = document.querySelector("#numbers");
const operators = document.querySelector("#operators");
const calculateButton = document.querySelector("#calculate");
const clearButton = document.querySelector("#clear");
const deleteButton = document.querySelector("#delete")

function roundDecimals(number) {
    number = `${number}`;
    let trailingZeroes = "";
    if (number.includes(".")) {
        //For typing zeroes after decimal point
        let afterDecimal = number.split(".")[1];
        afterDecimal = afterDecimal.slice(0, 7);
        numDecimals = afterDecimal.length;
        let isZero = true;
        while (isZero) {
        if (afterDecimal.slice(-1) == "0") {
            trailingZeroes += afterDecimal.slice(-1);
            afterDecimal = afterDecimal.slice(0,-1);
        }
        else isZero = false;
        }
        if (trailingZeroes.length == numDecimals) trailingZeroes = "." + trailingZeroes;
    }
    if (number && !number.endsWith(".")) return `${Math.round(number * 10000000) / 10000000}` + trailingZeroes;
    else return number;
}

function truncateDisplayText(text, length) {
    length -= 3;
    text = text.trim();
    let truncatedText = (text.length <= length) ? text : "..." + text.slice(text.length - length)
    return truncatedText;
}

function updateDisplay(isCalculate=false) {
    if (isCalculate) {
        secondaryDisplayText = primaryDisplayText;
        secondaryDisplay.textContent = truncateDisplayText(secondaryDisplayText, 18);
        primaryDisplayText = roundDecimals(answer);
    }
    else {
        primaryDisplayText = roundDecimals(expression.operand1) + " " + BUTTON_MAP[expression.operator] + " " + roundDecimals(expression.operand2);
    }
    primaryDisplay.textContent = truncateDisplayText(primaryDisplayText, 13);
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
    if(expression.isResult && !expression.operator) clear();

    let operand = (!expression.operator) ? "operand1": "operand2";

    if (expression[operand].length <= 9) {
        if (e.target.id == "decimal") {
            if (!expression[operand].includes(".")) {
                if(!expression[operand]) expression[operand] += "0" + BUTTON_MAP[e.target.id];
                else expression[operand] += BUTTON_MAP[e.target.id];
            }
        }
        else expression[operand] += BUTTON_MAP[e.target.id];
    }

    updateDisplay();
    e.stopPropagation();
});

operators.addEventListener("click", (e)=>{
    if (expression.operand1 && !expression.operand2) expression.operator = e.target.id;
    else if (expression.operand1 && expression.operand2) {
        calculate();
        updateDisplay(isCalculate=true);
        expression.operator = e.target.id;
    }

    updateDisplay();
    e.stopPropagation();
});

calculateButton.addEventListener("click", (e) => {
    if (expression.operator && expression.operand2) {
        calculate();
        updateDisplay(isCalculate=true);
    }

    e.stopPropagation();
});

clearButton.addEventListener("click", (e) => clear());

deleteButton.addEventListener("click", (e) => {
    if (!expression.isResult) {
         if (expression.operand2) expression.operand2 = expression.operand2.slice(0, -1);
        else if (expression.operator) expression.operator = "";
        else if (expression.operand1) expression.operand1 = expression.operand1.slice(0, -1);
    }
    updateDisplay();
});
