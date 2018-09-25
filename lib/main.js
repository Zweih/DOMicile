const DOMNodeCollection = require("./dom_node_collection.js");

const xmlHttp = new XMLHttpRequest();
const callbackFns = [];
let isDocReady = false;

xmlHttp.onreadystatechange = (func) => {
  if (this.readyState == 4 && this.status == 200) {
    func(this.responseText);
  }
};

const defaultRequest = {
  type: "GET",
  url: window.location.href,
  async: true,
  success: () => {},
  error: () => {},
  data: {},
};

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

window.$d.extend = (first, ...targets) => {
  targets.map( (target) => {
    let x;

    for(x in target) {
      first[x] = target[x];
    }
  });

  return first;
};

window.$d.ajax = (options) => {
  const newRequest = Object.assign({}, defaultRequest, options);
  xmlHttp.open(
    newRequest.type,
    newRequest.url,
    newRequest.async,
    newRequest.success,
    newRequest.error,
    newRequest.data,
  );

  xmlHttp.send(JSON.stringify(options.data));
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