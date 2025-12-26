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

// let INV_BUTTON_MAP = {}
// for(item in BUTTON_MAP) INV_BUTTON_MAP[BUTTON_MAP[item]] = item;

const NUMBERS = "0123456789.";
const OPERATORS = "/*-+"
const OTHER_VALID_KEYS = ["=", "Enter", "Backspace", "Delete"];

const OPERATION_MAP = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "/": (a, b) => a / b,
    "*": (a, b) => a * b,
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
        primaryDisplayText = roundDecimals(expression.operand1) + " " + expression.operator + " " + roundDecimals(expression.operand2);
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

function calculateEvent () {
    if (expression.operator && expression.operand2) {
        calculate();
        updateDisplay(isCalculate=true);
    }
}

function backspace () {
     if (!expression.isResult) {
         if (expression.operand2) expression.operand2 = expression.operand2.slice(0, -1);
        else if (expression.operator) expression.operator = "";
        else if (expression.operand1) expression.operand1 = expression.operand1.slice(0, -1);
    }
    updateDisplay();
}

function operatorEntry (operator) {
    expression.isResult = false;
    if (expression.operand1 && !expression.operand2) expression.operator = operator;
    else if (expression.operand1 && expression.operand2) {
        calculate();
        updateDisplay(isCalculate=true);
        expression.operator = operator;
    }
    updateDisplay();
}

function numberEntry (number) {
    if(expression.isResult && !expression.operator) clear();

    let operand = (!expression.operator) ? "operand1": "operand2";

    if (expression[operand].length <= 9) {
        if (number == ".") {
            if (!expression[operand].includes(".")) {
                if(!expression[operand]) expression[operand] += "0" + number;
                else expression[operand] += number;
            }
        }
        else expression[operand] += number;
    }

    updateDisplay();
}

numbers.addEventListener("click", (e)=>{
    e.target.blur(); // unfocus button to avoid accidental trigger on pressing "Enter" key
    numberEntry(BUTTON_MAP[e.target.id]);
    e.stopPropagation();
});

operators.addEventListener("click", (e)=>{
    e.target.blur(); // unfocus button to avoid accidental trigger on pressing "Enter" key
    operatorEntry(BUTTON_MAP[e.target.id]);
    e.stopPropagation();
});

calculateButton.addEventListener("click", (e) => {
    e.target.blur();
    calculateEvent()
    e.stopPropagation();
});

clearButton.addEventListener("click", (e) => {
    e.target.blur();
    clear();
    e.stopPropagation();
});

deleteButton.addEventListener("click", (e) => {
    e.target.blur();
    backspace();
    e.stopPropagation();
});

//Keyboard support
document.addEventListener("keydown", (e)=>
{
    if (NUMBERS.includes(e.key) || OPERATORS.includes(e.key) || OTHER_VALID_KEYS.includes(e.key)) {
        if (e.key == "=" || e.key =="Enter") calculateEvent();
        else if (e.key == "Backspace" || e.key == "Delete") backspace();
        else if (OPERATORS.includes(e.key)) operatorEntry(e.key);
        else if (NUMBERS.includes(e.key)) numberEntry(e.key);
    }
    e.stopPropagation();
})
