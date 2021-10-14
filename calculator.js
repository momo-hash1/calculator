let input_info = {
    value: [],
    isResult: false,
};

function appendValue(value) {
    if (input_info.value.length !== 30) {
        input_info.value.push(value);
        document.querySelector('#input_numbers').innerHTML = '<p>' + input_info.value.join('') + '</p>';
    }
}

function calculator(str) {
    let opIndex, op;
    if (str.includes('+')) {
        opIndex = str.indexOf('+');
        op = str[opIndex];
    }else if (str.includes('-')) {
        opIndex = str.indexOf('-');
        op = str[opIndex];
    }else if (str.includes('*')) {
        opIndex = str.indexOf('*');
        op = str[opIndex];
    }else if (str.includes('/')) {
        opIndex = str.indexOf('/');
        op = str[opIndex];
    }
    
    let a = +str.substr(0, opIndex);
    let b = +str.substr(opIndex + 1, str.length);
    console.log(a, b);

    switch (op) {
        case '+':
            input_info.value.length = 0;
            input_info.value.push(a + b);
            return a + b;
        case '-':
            input_info.value.length = 0;
            input_info.value.push(a - b);
            return a - b;
        case '/':
            input_info.value.length = 0;
            input_info.value.push(a / b);
            return a / b;
        case '*':
            input_info.value.length = 0;
            input_info.value.push(a * b);
            return a * b;
    }
}

for (const el of document.querySelectorAll('.number_buttons')) {
    el.addEventListener('click', event => {
        input_info.isResult = false;
        event.preventDefault;
        appendValue(event.target.id);
    });
}

document.querySelector('.null').addEventListener('click', event => {
    input_info.isResult = false;
    event.preventDefault;
    appendValue(event.target.id);
})

document.querySelectorAll('.operation_buttons').forEach(button => {
    button.addEventListener('click', event => {
        input_info.isResult = false;
        let curent_op = event.target.id;
        if (input_info.value.includes(curent_op) !== true) {
            appendValue(event.target.id);
        } 
    });
});

document.querySelector('#clear').addEventListener('click', () => {
    if (input_info.isResult == true) {
        input_info.value.length = 0;
        document.querySelector('#input_numbers').innerHTML =  '<p></p>';
    }else{
        input_info.value.pop();
    }
    document.querySelector('#input_numbers').innerHTML =  '<p>' + document.querySelector('#input_numbers').textContent.slice(0, -1) + '</p>';
})

document.querySelector('.result_button').addEventListener('click', () => {
    input_info.isResult = true;
    document.querySelector('#input_numbers').innerHTML = '<p>' + calculator(input_info.value.join('')) + '</p>';
})