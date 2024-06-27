const defaultLanguage = "en"; // English

const LAYOUT = {
  en: "qwertyuiop\nasdfghjkl\nBzxcvbnmE",
};

// This icon was designed by https://iconduck.com/designers/arturo-wibawa
const backspaceIcon = `<svg fill="none" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="var(--black)" stroke-linecap="round" stroke-width="2"><path d="m17 15-6-6m6 0-6 6"/><path d="M7.4 4.8A2 2 0 0 1 9 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-1.6-.8l-4.5-6a2 2 0 0 1 0-2.4z" stroke-linejoin="round"/></g></svg>`;

const createVirtualKey = (key) => {
  const virtualKey = document.createElement("button");

  virtualKey.classList.add("virtual-key");

  switch (key) {
    case /* Enter */ "E":
      virtualKey.dataset.key = "Enter";
      virtualKey.textContent = "Enter";
      virtualKey.classList.add("enter-key");
      break;

    case /* Backspace */ "B":
      virtualKey.dataset.key = "Backspace";
      virtualKey.ariaLabel = "Delete";
      virtualKey.innerHTML = backspaceIcon;
      virtualKey.classList.add("backspace-key");
      break;

    default: /* letter */
      virtualKey.dataset.key = key;
      virtualKey.textContent = key;
  }

  return virtualKey;
};

const createKeyRow = (keys) => {
  const keyRow = document.createElement("div");

  keyRow.classList.add("key-row");

  keyRow.append(...keys.split("").map(createVirtualKey));

  return keyRow;
};

const createKeyboardLayout = (layout) => {
  const keyboardLayout = document.createElement("div");

  keyboardLayout.classList.add("keyboard-layout");

  keyboardLayout.append(...layout.split("\n").map(createKeyRow));

  return keyboardLayout;
};

const createVirtualKeyboard = (layout) => {
  const virtualKeyboard = document.createElement("div");

  virtualKeyboard.classList.add("virtual-keyboard");

  virtualKeyboard.appendChild(createKeyboardLayout(layout));

  virtualKeyboard.addEventListener("click", (event) => {
    event.preventDefault();

    const virtualKey = event.target.closest(".virtual-key");

    if (virtualKey) {
      document.dispatchEvent(
        new CustomEvent("virtualkeypressed", {
          detail: {
            key: virtualKey.dataset.key,
          },
        })
      );
    }
  });

  return virtualKeyboard;
};

const addFocusTrap = (root) => {
  const allKeys = root.querySelectorAll(".virtual-key");
  const firstKey = allKeys.item(0);
  const lastKey = allKeys.item(allKeys.length - 1);

  firstKey.addEventListener("keydown", (event) => {
    if ("Tab" === event.key && event.shiftKey) {
      event.preventDefault();
      lastKey.focus();
    }
  });

  lastKey.addEventListener("keydown", (event) => {
    if ("Tab" === event.key && !event.shiftKey) {
      event.preventDefault();
      firstKey.focus();
    }
  });
};

const addArrowKeysNavigation = (root) => {
  const allKeys = root.querySelectorAll(".virtual-key");

  const getNextKey = (current) => {
    for (let i = 0; i < allKeys.length; i++) {
      if (current === allKeys.item(i)) {
        return allKeys.item((i + 1) % allKeys.length);
      }
    }

    return null;
  };

  const getPrevKey = (current) => {
    for (let i = 0; i < allKeys.length; i++) {
      if (current === allKeys.item(i)) {
        return allKeys.item((i - 1 + allKeys.length) % allKeys.length);
      }
    }

    return null;
  };

  const getNextRowKey = (current) => {
    const parentRow = current.closest(".key-row");

    if (!parentRow || !parentRow.nextSibling) return null;

    const currentIndex = Array.from(parentRow.children).findIndex(
      (key) => current === key
    );

    // safe guard
    if (-1 === currentIndex) return null;

    const nextRow = parentRow.nextSibling;

    if (currentIndex >= nextRow.children.length) {
      return nextRow.children[nextRow.children.length - 1];
    } else {
      return nextRow.children[currentIndex];
    }
  };

  const getPrevRowKey = (current) => {
    const parentRow = current.closest(".key-row");

    if (!parentRow || !parentRow.previousSibling) return null;

    const currentIndex = Array.from(parentRow.children).findIndex(
      (key) => current === key
    );

    // safe guard
    if (-1 === currentIndex) return null;

    const prevRow = parentRow.previousSibling;

    if (currentIndex >= prevRow.children.length) {
      return prevRow.children[prevRow.children.length - 1];
    } else {
      return prevRow.children[currentIndex];
    }
  };

  root.addEventListener("keydown", (event) => {
    let nextKey = null;

    switch (event.key) {
      case "ArrowRight":
        nextKey = getNextKey(root.activeElement);
        break;
      case "ArrowLeft":
        nextKey = getPrevKey(root.activeElement);
        break;
      case "ArrowDown":
        nextKey = getNextRowKey(root.activeElement);
        break;
      case "ArrowUp":
        nextKey = getPrevRowKey(root.activeElement);
        break;
      default:
        return;
    }

    if (nextKey) {
      event.preventDefault();
      nextKey.focus();
    }
  });
};

class VirtualKeyboard extends HTMLElement {
  constructor() {
    super();

    this.language = document.documentElement.lang;

    // use the layout in the document's language or the layout in English as a fallback
    this.layout = LAYOUT[this.language] ?? LAYOUT[defaultLanguage];

    this.root = this.attachShadow({ mode: "open" });

    this.loadCSS();
  }

  loadCSS() {
    const stylesLink = document.createElement("link");

    stylesLink.setAttribute("rel", "stylesheet");
    stylesLink.setAttribute("href", "src/components/virtual-keyboard.css");

    this.root.appendChild(stylesLink);
  }

  connectedCallback() {
    this.root.appendChild(createVirtualKeyboard(this.layout));
    addFocusTrap(this.root);
    addArrowKeysNavigation(this.root);
  }
}

export default VirtualKeyboard;
