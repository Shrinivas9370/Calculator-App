

const Functions = ['%', 'CE', 'C', 'Cut', '1/x', 'x²', '√x', '÷', 7, 8, 9, '×', 4, 5, 6, '-', 1, 2, 3, '+', '+/-', 0, '.', '='];
const operation = ['%', '1/x', 'x²', '√x', '+/-', '+', '-', '÷', '×'];

let setcount = 0;
let counterfor = 0;
let userquery = '';
let evaluation;

const display = document.getElementById('display-content');
const resultofquery = document.getElementById('Input-integers');
const operations = document.getElementById('operations-cont');

// Dynamically create calculator buttons
for (let index = 0; index < Functions.length; index++) {
    if (index % 4 === 0) {
        var newDivCont = document.createElement("div");
        newDivCont.classList.add('divcontainer');
        operations.appendChild(newDivCont);
    }
    let lastele = operations.lastElementChild;
    var newDiv = document.createElement('div');
    newDiv.classList.add('operations');
    var newBtn = document.createElement('button');
    newBtn.textContent = Functions[index];

    if (['÷', '×', '-', '+', '%', '1/x', 'x²', '√x', '+/-'].includes(Functions[index])) {
        newBtn.classList.add('operator');
    }
    if (['C', 'CE', 'Cut'].includes(Functions[index])) {
        newBtn.classList.add('clear');
    }
    if (Functions[index] === '=') {
        newBtn.classList.add('equal');
    }

    lastele.appendChild(newDiv);
    newDiv.appendChild(newBtn);
}

function Evaluation() {
    try {
        evaluation = eval(userquery);
        if (evaluation === Infinity || isNaN(evaluation)) {
            throw new Error("Invalid calculation");
        }
        resultofquery.innerHTML = evaluation;
        display.innerHTML = userquery.replace(/\*/g, '×').replace(/\//g, '÷') + '=';
        userquery = evaluation.toString();
    } catch {
        resultofquery.innerHTML = "Error";
        display.innerHTML = userquery.replace(/\*/g, '×').replace(/\//g, '÷') + '=';
        userquery = '';
    }
    counterfor += 1;
}

function Handler(evalValue, displayValue) {
    if (userquery == '0') {
        resultofquery.innerHTML = displayValue;
        userquery = evalValue;
        display.innerHTML = '';
    } else if (resultofquery.innerHTML == userquery && display.innerHTML.includes('=') && !operation.includes(displayValue)) {
        userquery = '';
        resultofquery.innerHTML = '';
        userquery = evalValue;
        display.innerHTML = '';
        resultofquery.innerHTML = userquery;
    } else if (display.innerHTML.includes('=') && operation.includes(displayValue)) {
        userquery = resultofquery.innerHTML + evalValue;
        display.innerHTML = userquery.replace(/\*/g, '×').replace(/\//g, '÷');
        setcount = 1;
    } else {
        userquery += evalValue;
        if (operation.includes(displayValue)) {
            display.innerHTML = userquery.replace(/\*/g, '×').replace(/\//g, '÷');
            setcount += 1;

            if ((userquery.match(/[+\-*/%]/g) || []).length > 1) {
                try {
                    evaluation = userquery.slice(0, -1);
                    resultofquery.innerHTML = eval(evaluation);
                    display.innerHTML = (resultofquery.innerHTML + displayValue).replace(/\*/g, '×').replace(/\//g, '÷');
                } catch {
                    resultofquery.innerHTML = "Error";
                }
            }
        } else {
            if (setcount > 0) {
                resultofquery.innerHTML = '';
                setcount -= 1;
            }
            resultofquery.innerHTML += displayValue;
        }
    }
}

// Attach click listeners to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.innerHTML;
        let evalValue = value;

        // Replace displayed operators with eval equivalents
        if (value === '×') evalValue = '*';
        if (value === '÷') evalValue = '/';

        if (value === 'CE') {
            userquery = '0';
            if (display.innerHTML.includes('=')) display.innerHTML = '';
            resultofquery.innerHTML = '0';
        } else if (value === 'C') {
            resultofquery.innerHTML = '0';
            display.innerHTML = '';
            userquery = '0';
        } else if (value === 'Cut') {
            if (display.innerHTML.includes('=') && counterfor > 0) {
                display.innerHTML = '';
            } else {
                userquery = userquery.slice(0, -1);
                resultofquery.innerHTML = resultofquery.innerHTML.slice(0, -1);
                if (!userquery) {
                    userquery = '0';
                    resultofquery.innerHTML = '0';
                }
            }
        } else if (value === '+/-') {
            let current = parseFloat(resultofquery.innerHTML) || 0;
            resultofquery.innerHTML = current * (-1);
            userquery = `${current * (-1)}`;
            display.innerHTML = `negate(${current})`;
        } else if (value === 'x²') {
            resultofquery.innerHTML = Math.pow(parseFloat(resultofquery.innerHTML), 2);
            display.innerHTML = `(${parseFloat(Math.sqrt(resultofquery.innerHTML))})²`;
        } else if (value === '1/x') {
            display.innerHTML = `1/(${resultofquery.innerHTML})`;
            resultofquery.innerHTML = 1 / parseFloat(resultofquery.innerHTML);
        } else if (value === '√x') {
            display.innerHTML = `√(${parseFloat(resultofquery.innerHTML)})`;
            resultofquery.innerHTML = Math.sqrt(parseFloat(resultofquery.innerHTML));
        } else if (value === '%') {
            resultofquery.innerHTML = parseFloat(resultofquery.innerHTML) / 100;
        } else if (value === '=') {
            Evaluation();
        } else {

            let endchar = userquery.charAt(userquery.length - 1);
            if ((value === '.' && endchar === value) || (resultofquery.innerHTML.includes('.') && value === '.')) return;

            else {
                if (operation.includes(endchar) && operation.includes(value)) {
                    return
                }
                Handler(evalValue, value);
            }
        }
    });
});

