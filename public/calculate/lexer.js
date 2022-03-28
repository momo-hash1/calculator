import { tokens, token } from "./operations.js";

function* tokenGenerator(text) {
  let pos = 0;
  let currentChar = "";

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
    if (currentChar === "+") {
      yield token(tokens.PLUS, "+");
    }
    if (currentChar === "-") {
      if (!isNaN(parseInt(text[pos - 1]))) {
        yield token(tokens.MINUS, "-");
      }
    }
    if (currentChar === tokens.MUL) {
      yield token(tokens.MUL, "*");
    }
    if (currentChar === tokens.DEL) {
      yield token(tokens.DEL, "/");
    }
    if (currentChar === tokens.POW) {
      yield token(tokens.POW, "^");
    }
    if (currentChar === tokens.LPR) {
      yield token(tokens.LPR, "(");
    }
    if (currentChar === tokens.RPR) {
      yield token(tokens.RPR, ")");
    }
    if (!isNaN(parseInt(currentChar))) {
      const prevPos = pos;
      const _token = token(
        tokens.NUM,
        findValue((char) => !isNaN(parseInt(char)))
      );
      if (text[prevPos - 1] === tokens.MINUS && isNaN(parseInt(text[prevPos - 2]))) {
        _token.value = parseInt(_token.value)
        _token.value = -_token.value;
      }
      if (text[pos+1] === tokens.DOT) {
        pos += 2
        const nextValue = findValue((char) => !isNaN(parseInt(char)))
        _token.value = _token.value.concat('.',nextValue)
        _token.value = parseFloat(_token.value)
      }else{
        _token.value = parseInt(_token.value)
      }
      
      yield _token;
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
const lexer = (expression) => {
  let lexerTokens = [...tokenGenerator(expression)];
  return lexerTokens;
};

export default lexer;
