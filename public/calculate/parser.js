import lexer from "./lexer.js";
import { tokens, token, isFun } from "./operations.js";

const containsParantheses = (_tokens) => {
  if (_tokens.length === 0 || _tokens.length === 1) return false;
  const lprCount = _tokens.filter((x) => x.type === tokens.LPR).length;
  const rprCount = _tokens.filter((x) => x.type === tokens.RPR).length;
  if (lprCount === 0 || rprCount === 0) return false;

  if (lprCount === rprCount) {
    return true;
  }
};

const getFirstPrTerm = (_tokens) => {
  for (let index = 0; index <= _tokens.length; index++) {
    if (containsParantheses(_tokens.slice(0, index))) {
      let statement = _tokens.slice(0, index);
      return statement;
    }
  }
};

const prepToBaseCase = (_tokens) => {
  replaceAllPr(_tokens);
  groupFunction(_tokens);
  flattenExponents(_tokens);
};

const replaceParantheses = (_tokens) => {
  const prTerm = getFirstPrTerm(_tokens);
  if (prTerm === undefined) {
    return _tokens;
  }
  const onlyTypes = prTerm.map((item) => item.type);
  const lprIndex = onlyTypes.indexOf(tokens.LPR);
  const rprIndex = onlyTypes.lastIndexOf(tokens.RPR);

  _tokens.splice(lprIndex, rprIndex - lprIndex);
  const innerToken = token(tokens.INNER, prTerm.slice(lprIndex + 1, rprIndex));
  if (containsParantheses(innerToken.value)) {
    prepToBaseCase(innerToken.value);
  }
  _tokens[lprIndex] = innerToken;
  return _tokens;
};

const replaceAllPr = (_tokens) => {
  while (containsParantheses(_tokens)) {
    replaceParantheses(_tokens);
  }
};

const flattenExponents = (_tokens) => {
  _tokens.forEach((_token, index) => {
    if (_token.type === tokens.POW) {
      const expToken = {
        type: tokens.POW,
        base: _tokens[index - 1],
        exp: _tokens[index + 1],
      };
      _tokens.splice(index - 1, 3);
      _tokens[index - 1] = expToken;
    }
  });
};

const groupFunction = (_tokens) => {
  _tokens.forEach((_token, index) => {
    if (_token.type === tokens.FUN) {
      const funToken = token(_token.value, _tokens[index + 1]);
      _tokens[index] = funToken;
      _tokens.splice(index + 1, 1);
    }
  });
  return _tokens;
};

const getAst = (_tokens) => {
  if (!Array.isArray(_tokens)) return _tokens;
  if (
    _tokens.length === 1 &&
    !isFun(_tokens[0].type) &&
    _tokens[0].type !== tokens.INNER
  )
    return _tokens;
  const getAstNode = (type = null, index) => {
    return {
      type,
      left: _tokens.slice(0, index),
      right: _tokens.slice(index + 1, _tokens.length),
    };
  };
  let astNode = {};
  _tokens.forEach((_token, index) => {
    if (_token.type === tokens.MUL) {
      astNode = getAstNode(tokens.MUL, index);
    }
    if (_token.type === tokens.DEL) {
      astNode = getAstNode(tokens.DEL, index);
    }
    if (_token.type === tokens.PLUS) {
      astNode = getAstNode(tokens.PLUS, index);
    }
    if (_token.type === tokens.MINUS) {
      astNode = getAstNode(tokens.MINUS, index);
    }
    if (isFun(_token.type)) {
      if (!_token.value.hasOwnProperty('left')) {
        _token.value = getAst(_token.value.value);
      }
    }
    if (_token.type === tokens.INNER) {
      _token.value = getAst(_token.value);
    }
  });
  if (Object.keys(astNode).length === 0) {
    return _tokens
  }
  if (astNode.hasOwnProperty('left') && astNode.hasOwnProperty('right')) {
    if (astNode.left.length !== 1) {
      astNode.left = getAst(astNode.left);
    }
    if (astNode.right.length !== 1) {
      astNode.right = getAst(astNode.right);
    }
  }
  return astNode;
};

const parser = (expression) => {
  let _tokens = lexer(expression);
  prepToBaseCase(_tokens);
  let ast = getAst(_tokens);
  return ast
};