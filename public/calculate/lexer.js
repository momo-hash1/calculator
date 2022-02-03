import { tokens, token } from "./operations";

function* nextToken(text) {
  let pos = 0;
  let currentChar = "";

  const skipWhiteSpace = () => {
    while (currentChar === " ") {
      ++pos;
    }
  };

  const findValue = (predicate) => {
    let currentStr = text.slice(pos, text.length);
    let value = "";
    for (let index = 0; index < currentStr.length; index++) {
      if (predicate(currentStr[index])) {
        value += currentStr[index];
      } else {
        break;
      }
    }
    pos += value.length > 1 ? value.length - 1 : 0;
    return value;
  };
  while (pos < text.length) {
    currentChar = text[pos];
    if (currentChar === " ") {
      skipWhiteSpace();
      continue;
    }
    if (currentChar === "+") {
      yield token(tokens.PLUS, "+", tokens.BINARY);
    }
    if (currentChar === "-") {
      yield token(tokens.MINUS, "-", tokens.BINARY);
    }
    if (currentChar === "*") {
      yield token(tokens.MUL, "*", tokens.BINARY);
    }
    if (currentChar === "/") {
      yield token(tokens.DEL, "/", tokens.BINARY);
    }
    if (currentChar === "^") {
      yield token(tokens.POW, "^", tokens.BINARY);
    }
    if (currentChar === "(") {
      yield token(tokens.LPR, "(");
    }
    if (currentChar === ")") {
      yield token(tokens.RPR, ")");
    }
    if (currentChar === ".") {
      yield token(tokens.DOT, ".");
    }
    if (!isNaN(parseInt(currentChar))) {
      yield token(
        tokens.NUM,
        findValue((char) => !isNaN(parseInt(char)))
      );
    }
    if (currentChar.match(/[a-z]/)) {
      yield token(
        tokens.FUN,
        findValue((char) => char.match(/[a-z]/))
      );
    }

    ++pos;
  }
}

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}

const covertNumber = (lexerTokens) => {
  lexerTokens.forEach((token, index) => {
    if (token.type === tokens.DOT) {
      lexerTokens[index - 1].value = parseFloat(
        lexerTokens[index - 1].value.concat(".", lexerTokens[index + 1].value)
      );

      lexerTokens.splice(index, 2);
    }
  });
  lexerTokens.forEach((token, index) => {
    if (!isNaN(parseInt(token.value))) {
      if (!isFloat(token.value) ) {
        lexerTokens[index].value = parseInt(token.value);
      }
    }
  });
  return lexerTokens;
};
console.log(covertNumber([...nextToken("20.0005+83*20.30")]));

export default nextToken;
