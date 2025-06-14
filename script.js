//Refence display elemet
const display = document.getElementById('display');

//Track if we have  perfomed a calculation
let justCalculated = false;

function isOperator(char){
    return ['+','-','*','/'] .includes(char);
}

function getLastchar(){
    display.value.slice(-1);
}

function safeEval(expression){
    try {
        let jsExpression = expression
        .replace(/x/g, '*')
        .replace(/÷/g, '/')

        if(!/^[0-9+\-*/.()]+$/.test(jsExpression)){
            throw new Error('invalid characters in expression');
        }

        const result = Function(' "use strict"; return ('+ jsExpression +')')();

        if (!isFinite(result)) {
            throw new Error('Invalid calculation result');
        }

        return result;
    } catch (error) {
        console.error('calculation error:', error);
        return'Error';
    }
  
}

function appendToDisplay(value) {
    console.log('Button pressed:', value);

    let  currentValue = display.value;

    if (justCalculated && !isNaN(value)) {
        display.value = value;
        justCalculated = false;
        return;
    }

    if (justCalculated && isOperator(value)){
        display.value = currentValue + value;
        justCalculated = false;
        return;
    }

    //handles operator
    if (isOperator(value)){
        //Dont allow operator as first char (except for minus)
        if (currentValue === '0' && value !== '-'){
           return;//do nothing 
        }
       
    //if the last character is already an operator, replace it
    if (isOperator(getLastchar())){
        display.value = currentValue.slice(0, -1) +value;
    } else{
        display.value = currentValue + value;
        }
    } else if ( !isNaN(value)){
        if (currentValue === '0'){
            display.value =value;
        } else{
            display.value = currentValue + value;
        }
    } else if ( value === '.') {
        if(currentValue === '0'){
            display.value = currentValue +value;
        } else {
            //get the last number in the display after our last operator
            let parts = currentValue.split('/[+\-*/');
            let lastNumber = parts[parts.length - 1];

            //only add decimal if number doesn't already have one
            if(!lastNumber.includes('.')){
                display.value = currentValue + value;
            }

        }
    }else {
        display.value = currentValue + value;
    }

    //Reset the justCalculated flag when user starts typing
    justCalculated = false;

    console.log('Display updated to:', display.value);
}

function clearDisplay() {
    console.log('Clear button pressed.');

    display.value = '0';
    justCalculated = false;

    display.style.backgroundColor = '#f0f0f0';
    setTimeout(() => {
        display.style.backgroundColor = '';
    }, 150);
}

function deleteLast() {
    console.log('Backspace button pressed.');

    let currentValue = display.value;

    //If theres only one character or its 0, reset to 0
    if (currentValue.length <= 1 || currentValue === '0') {
        display.value = '0';
    } else {
        display.value = currentValue.slice(0, -1);
    }

}

function calculate() {
    let expression = display.value;

    //dont calc if the display is 0 or empty
    if (expression === '0' || expression === ''){
        return;
    }

    //dont calc if expression ends with operator
    if (isOperator(getLastchar())){
        return;
    }

    let result = safeEval(expression);

    if (result === 'Error') {
        display.value = 'Error';
        setTimeout(() =>{
            clearDisplay()
        }, 2000);
    }  else{
        if (Number.isInteger(result)) {
            display.value = result. toString();
        } else {
            display.value = parseFloat(result.tofixed(10)).toString();
        }

        justCalculated = true;
    }

    display.style.backgroundColor = '#e8f5e8';
    setTimeout(() => {
        display.style.backgroundColor = '';
    }, 300);
         
}

document.addEventListener('keydown', function(event) {
    console.log('key pressed', event.key);

    if (event.key >= '0' && event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (event.key === '+') {
        appendToDisplay('+');
    } else if (event.key === '-') {
        appendToDisplay('-')
    } else if (event.key === '*') {
        appendToDisplay('*') 
    } else if (event.key === '/') {
        appendToDisplay('/')
    }
    else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape'|| event.key === 'c' || event.key === 'C') {
        clearDisplay(); 
    } else if (event.key === 'Backspace') {
        deleteLast();
    }
})

document.addEventListener('DOMContentloaded', function() {
    console.log('Calculator loaded successfully');
    console.log('Display element',display);

    if (display) {
        console.log('Current display value: ', display.value);
    } else {
        console.log('Display element not found');
    }
})