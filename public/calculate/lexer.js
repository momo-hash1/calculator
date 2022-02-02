import { tokens, token} from "./operations";

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
      yield token(tokens.BINOP, "+");
    }
    if (currentChar === "-") {
      yield token(tokens.BINOP, "-");
    }
    if (currentChar === "*") {
      yield token(tokens.BINOP, "*");
    }
    if (currentChar === "/") {
      yield token(tokens.BINOP, "/");
    }
    if (currentChar === "^") {
      yield token(tokens.BINOP, "^");
    }
    if (currentChar === "(") {
      yield token(tokens.LPR, "(");
    }
    if (currentChar === ")") {
      yield token(tokens.RPR, ")");
    }
    if (!isNaN(parseInt(currentChar))) {
      yield token(
        tokens.NUM,
        parseInt(findValue((char) => !isNaN(parseInt(char))))
      );
    }
    if (currentChar.match(/[a-z]/)) {
      yield token(tokens.FUN, findValue((char) => char.match(/[a-z]/)))
    }

    ++pos;
  }
}

export default nextToken