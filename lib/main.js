const DOMNodeCollection = require("./dom_node_collection.js");
let isDocReady = false;
const callbackFns = [];

window.$d = (arg) => {
  switch(typeof arg) {
    case "object":
      if (arg instanceof HTMLElement) {
        return new DOMNodeCollection([arg]);
      }
      break;
    case "function":
      return pushCallbackFns(arg);
    case "string":
      return collectNodes(arg);
  }
};

const collectNodes = (selector) => {
  const nodes = document.querySelectorAll(selector);
  return new DOMNodeCollection(Array.from(nodes));
};

const pushCallbackFns = (func) => {
  if(isDocReady) {
    callbackFns.push(func)
  } else {
    func();
  }
};

const executeFns = (funcs) => {
  funcs.forEach((func) => {
    func.call();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  isDocReady = true;
  executeFns(callbackFns);
});