import util from "util";
import { functions } from "./calculate/operations.js";

const logFullObject = (object) => {
  console.log(util.inspect(object, { depth: Infinity }));
};

const isFun = (type) => {
  return Object.keys(functions).includes(type);
};

export { logFullObject, isFun };
