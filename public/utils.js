import { functions } from "./calculate/operations.js";

const isFun = (type) => {
  return Object.keys(functions).includes(type);
};

export { logFullObject, isFun };
