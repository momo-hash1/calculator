import { tokens, token } from "./operations";

function* tokenGenerator(text) {
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

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

const convertNumber = (lexerTokens) => {
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
      if (!isFloat(token.value)) {
        lexerTokens[index].value = parseInt(token.value);
      }
    }
  });
  return lexerTokens;
};

const lexer = (expression) => {
  let lexerTokens = [...tokenGenerator(expression)]
  lexerTokens = convertNumber(lexerTokens)
  lexerTokens = convertNegative(lexerTokens)
  return lexerTokens
}

const convertNegative = (lexerTokens) => {
  lexerTokens.forEach((token, index) => {
    const prevIndex = index - 2 < 0 ? 0 : index - 2;
    if (token.binary) {
      if (!lexerTokens[prevIndex].binary) {
        lexerTokens[index + 1].value = -lexerTokens[index + 1].value;
      }
    }
  });
  lexerTokens.forEach((_, index) => {
    if (index > 0) {
      if (lexerTokens[index - 1].binary === lexerTokens[index].binary) {
        lexerTokens.splice(index, 1);
      }
    }
  });
  return lexerTokens;
};

export default lexer;
