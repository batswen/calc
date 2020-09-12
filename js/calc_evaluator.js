/*
    Based on "Let’s Build A Simple Interpreter" by Ruslan Spivak
    https://ruslanspivak.com/lsbasi-part1/

    Translated from Python source
*/

const EOF = 0, NUMBER = 1, PLUS = 2, MINUS = 3, MUL = 4, DIV = 5, LPAREN = 10, RPAREN = 11,
    EXP = 20, SQRT = 21, MOD = 22

class Lexer {
    constructor(source) {
        this.source = source
        this.pos = 0
        this.chr = this.source.charAt(this.pos)
    }
    error(msg) {
        alert("Lexer > error: "+msg)
    }
    getNextChar() {
        this.pos++
        if (this.pos >= this.source.length) {
            this.chr = undefined
        } else {
            this.chr = this.source.charAt(this.pos)
        }
    }
    getNumber() {
        let result = ""
        while (this.chr != undefined && this.chr >= "0" && this.chr <= "9") {
            result += this.chr
            this.getNextChar()
        }
        if (this.chr != undefined && this.chr === ".") {
            result += "."
            this.getNextChar()
            while (this.chr != undefined && this.chr >= "0" && this.chr <= "9") {
                result += this.chr
                this.getNextChar()
            }
        }
        return Number(result)
    }
    getNextToken() {
        while (this.chr != undefined) {
            if (this.chr >= "0" && this.chr <= "9" || this.chr === ".") {
                return { type: NUMBER, value: this.getNumber() }
            }
            if (this.chr === "+") {
                this.getNextChar()
                return { type: PLUS, value: "+" }
            }
            if (this.chr === "-") {
                this.getNextChar()
                return { type: MINUS, value: "-" }
            }
            if (this.chr === "*") {
                this.getNextChar()
                return { type: MUL, value: "*" }
            }
            if (this.chr === "/") {
                this.getNextChar()
                return { type: DIV, value: "/" }
            }
            if (this.chr === "(") {
                this.getNextChar()
                return { type: LPAREN, value: "(" }
            }
            if (this.chr === ")") {
                this.getNextChar()
                return { type: RPAREN, value: ")" }
            }
            if (this.chr === "^") {
                this.getNextChar()
                return { type: EXP, value: "^" }
            }
            if (this.chr === "@") {
                this.getNextChar()
                return { type: SQRT, value: "Sqrt" }
            }
            if (this.chr === "%") {
                this.getNextChar()
                return { type: MOD, value: "%" }
            }
            this.error("getNextToken(): unknown token")
        }
        return { type: EOF, value: "" }
    }
}

class Interpreter {
    constructor(lexer) {
        this.lexer = lexer
        this.token = this.lexer.getNextToken()
    }
    error(msg) {
        alert("Interpreter > error: "+msg)
    }
    eat(tokentype) {
        if (this.token.type === tokentype) {
            this.token = this.lexer.getNextToken()
        } else {
            this.error("Wrong tokentype (expected: "+tokentype+", found: "+this.token.type+")")
        }
    }
    /*
    * number | ( expr )
    */
    factor() {
        let token = this.token, result
        if (token.type === NUMBER) {
            this.eat(NUMBER)
            result = token.value
        } else if (token.type === LPAREN) {
            this.eat(LPAREN)
            result = this.expr()
            this.eat(RPAREN)
        }
        return result
    }
    /**
    ** factor (*|/|^|%) factor
    */
    term() {
        let result = this.factor()
        while (this.token.type === MUL || this.token.type === DIV ||
            this.token.type === EXP || this.token.type === MOD) {
            if (this.token.type === MUL) {
                this.eat(MUL)
                result *= this.factor()
            } else if (this.token.type === DIV) {
                this.eat(DIV)
                result /= this.factor()
            } else if (this.token.type === EXP) {
                this.eat(EXP)
                result = Math.pow(result, this.factor())
            } else {
                this.eat(MOD)
                result %= this.factor()
            }
        }
        return result
    }
    /**
     ** term (+|-) term
     **/
    expr() {
        let result = this.term()
        while (this.token.type === PLUS || this.token.type === MINUS) {
            if (this.token.type === PLUS) {
                this.eat(PLUS)
                result = result + this.term()
            } else {
                this.eat(MINUS)
                result -= this.term()
            }
        }
        return result
    }
}
