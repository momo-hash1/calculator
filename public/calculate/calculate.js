import parser from "./parser.js";
import { tokens, functions, operations } from "./operations.js";
import { logFullObject, isFun } from "../utils.js";

const evaluate = (tree) => {
  let result;
  if (tree.type === tokens.NUM) {
    return tree;
  }
  if (tree.type === tokens.INNER) {
    tree = tree.value;
  }
  if (isFun(tree.type)) {
    if (tree.value.type !== tokens.NUM && typeof tree.value !== "number") {
      const value = evaluate(tree.value);
      if (value.value.hasOwnProperty("err")) {
        return value;
      }
      return {
        type: tokens.NUM,
        value: functions[tree.type](value.value),
      };
    } else {
      let value = tree.value.value;
      if (typeof tree.value === "number") {
        value = tree.value;
      }
      if (value.hasOwnProperty("err")) {
        return value;
      }
      result = { type: tokens.NUM, value: functions[tree.type](value) };
      return result;
    }
  }
  const left = evaluate(tree.left);
  const right = evaluate(tree.right);
  result = {
    type: tokens.NUM,
    value: operations[tree.type](left.value, right.value),
  };
  if (left.value.hasOwnProperty("err")) {
    return left;
  }
  if (right.value.hasOwnProperty("err")) {
    return right;
  }

  return result;
};

const calculate = (expression) => {
  let tree = parser(expression);
  tree = Array.isArray(tree) ? tree[0] : tree;
  return evaluate(tree).value;
};

export default calculate;
