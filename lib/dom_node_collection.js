class DOMNodeCollection {
  constructor($htmlArr) {
    this.$htmlArr = $htmlArr;
  }

  html(string = null) {
    if (string && typeof string === "string") {
      this.$htmlArr.forEach( (el) => {
        el.innerHTML = string;
      });
    } else {
      return this.$htmlArr[0];
    }
  }

  empty() {
    this.html('');
  }

  append(arg) {
    let thing = arg;

    if (arg instanceof HTMLElement) {
      thing = arg.outerHTML;
    } else if (arg instanceof DOMNodeCollection) {
      this.$htmlArr.forEach((node) => {
        arg.$htmlArr.forEach((childNode) => {
          node.appendChild(childNode.cloneNode(true));
        });
      });
      return undefined;
    } else if (arg instanceof Object) {
      thing = "";

      for (let i = 0; i < arg.length; i++) {
        thing += arg[i].outerHTML;
      }
    }

    this.$htmlArr.forEach( (el) => {
      el.innerHTML += thing;
    });
  }

  // return a DOMNodeCollection of ALL children of all nodes in the array
  children() {
    const array = [];

    this.$htmlArr.forEach( (el) => {
      Array.from(el.children).forEach( (child) => {
        array.push(child);
      });
    });

    return new DOMNodeCollection(array);
  }

  parent() {
    const array = [];

    this.$htmlArr.forEach( (el) => {
      const parent = el.parentElement;

      if (!parent.visited) {
        array.push(el.parentElement);
        parent.visited = true;
      }
    });

    return new DOMNodeCollection(array);
  }

  find(selector) {
    const arr = [];

    this.$htmlArr.forEach( (el) => {
      Array.from(el.querySelectorAll(selector)).forEach( (node) => {
        arr.push(node);
      });
    });

    return new DOMNodeCollection(arr);
  }

  remove() {
    this.each((child) => {
      const parent = child.parentElement;
      parent.removeChild(child);
    });
  }

  // ex: $("ul").on("click", () => {...})
  on(e, callback) {
    this.each((child) => {
      child.addEventListener(e, callback);
      const eKey = `jqliteEvents-${e}`;
      if (typeof child[eKey] === "undefined") {
        child[eKey] = [];
      }
      child[eKey].push(callback);
    });
  }

  off(e) {
    this.each((child) => {
      const eKey = `jqliteEvents-${e}`;
      if (child[eKey]) {
        child[eKey].forEach((cb) => {
          child.removeEventListener(e, cb);
        });
      }
    });
  }

  each(callback) {
    this.$htmlArr.forEach(callback);
  }
}

module.exports = DOMNodeCollection;
