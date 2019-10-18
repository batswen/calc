var output = document.getElementById("calc-output")
var result = document.getElementById("calc-result")
var input = "", parens = 0, error = false

function calc_show() {
    console.log(input)
}

function calc_clear() {
    output.innerHTML = "0"
    result.innerHTML = "0"
    input = ""
    error = false
    calc_show()
}


 function calc_error() {
     error = true
     output.innerHTML = "Error"
 }

function calc_concat(e) {
    var num = Number(output.innerHTML)
    if (error) {
        return
    }
    // Allow only one dot
    if (e == "." && output.innerHTML.indexOf(".") != -1) {
        calc_error()
    }
    // Add new element to output
    output.innerHTML = output.innerHTML + e
    input += e
    // Remove leading zeros
    while (output.innerHTML.charAt(0) == "0" && output.innerHTML.charAt(1) != ".") {
        output.innerHTML = output.innerHTML.slice(1)
    }
    if (output.innerHTML == "") {
        output.innerHTML = "0"
    }
    calc_show()
}

function calc_backspace() {
    if (error) {
        return
    }
    output.innerHTML = output.innerHTML.slice(0, -1)
    input = input.slice(0, -1)
    if (output.innerHTML == "") {
        output.innerHTML = "0"
    }
    calc_show()
}

function calc_operator(operator) {
    if (error) {
        return
    }
    if (operator == "(") {
        parens++
        input += "("
    } else if (operator == ")") {
        if (parens == 0) {
            return calc_error()
        }
        parens--
        input += ")"
    } else {
        input += operator
    }
    output.innerHTML = "0"
    calc_show()
}

function calc_eval() {
    if (error) {
        return
    }
    calc_show()
    if (input.length > 0) {
        var l = new Lexer(input)
        var i = new Interpreter(l)
        result.innerHTML = i.expr()
    }
    calc_clear()
}

calc_show()
