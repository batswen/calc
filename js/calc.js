let output = document.getElementById("calc-output")
let result = document.getElementById("calc-result")
let input = "", parens = 0, error = false, operator = ""

function calc_show() {
    console.log(input)
}

function calc_clear(clearResult) {
    output.innerHTML = "0"
    if (clearResult) {
        result.innerHTML = "0"
    }
    input = ""
    error = false
    //calc_show()
}

function calc_error() {
    error = true
    output.innerHTML = "Error"
}

function calc_concat(e) {
    let num = Number(output.innerHTML)
    if (error) {
        return
    }
    if (operator !== "") {
        input += operator
        operator = ""
    }
    // Allow only one dot
    if (e === "." && output.innerHTML.indexOf(".") !== -1) {
        calc_error()
    }
    // Add new element to output
    output.innerHTML = output.innerHTML + e
    input += e
    // Remove leading zeros
    while (output.innerHTML.charAt(0) === "0" && output.innerHTML.charAt(1) !== ".") {
        output.innerHTML = output.innerHTML.slice(1)
    }
    if (output.innerHTML === "") {
        output.innerHTML = "0"
    }
    //calc_show()
}

function calc_backspace() {
    if (error) {
        return
    }
    if (operator === "") {
        output.innerHTML = output.innerHTML.slice(0, -1)
        input = input.slice(0, -1)
        if (output.innerHTML === "") {
            output.innerHTML = "0"
        }
    } else {
        operator = operator.slice(0, -1)
    }
    //calc_show()
}

function calc_operator(op) {
    if (error) {
        return
    }
    if (input === "") {
        if (result.innerHTML !== "") {
            input = result.innerHTML
        } else {
            error = true
            return
        }
    }
    if (op === "(") {
        parens++
        operator += "("
    } else if (op === ")") {
        if (parens === 0) {
            return calc_error()
        }
        parens--
        operator += ")"
    } else {
        operator += op
    }
    output.innerHTML = "0"
    //calc_show()
}

function calc_eval() {
    if (error) {
        return
    }
    if (operator !== "") {
        input += operator
        operator = ""
    }
    //calc_show()
    if (input.length > 0) {
        let l = new Lexer(input)
        let i = new Interpreter(l)
        result.innerHTML = i.expr()
    }
    calc_clear(false)
}
