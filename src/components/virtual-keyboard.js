const defaultLanguage = "en"; // English

const LAYOUT = {
  en: "qwertyuiop\nasdfghjkl\nBzxcvbnmE",
};

// Designed by https://iconduck.com/designers/arturo-wibawa
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

const addKeyboardNavigation = (root) => {
  /**
   * All virtual keys in the virtual keyboard.
   */
  const allKeys = root.querySelectorAll(".virtual-key");

  /**
   * Returns the index of a key in the array of keys.
   */
  const findKeyIndex = (keys, currentKey) =>
    Array.from(keys).findIndex((key) => currentKey === key);

  /**
   * Returns the next key (with circular array indexing) from the given index.
   */
  const nextKey = (keys, index) => keys[(index + 1) % keys.length];

  /**
   * Returns the previous key (with circular array indexing) from the given index.
   */
  const prevKey = (keys, index) =>
    keys[(index - 1 + keys.length) % keys.length];

  /**
   * When Tab, returns the next key, or the previous one if Shift is pressed.
   */
  const getNextKey = (current, shiftKey) => {
    if (shiftKey) {
      return prevKey(allKeys, findKeyIndex(allKeys, current));
    } else {
      return nextKey(allKeys, findKeyIndex(allKeys, current));
    }
  };

  /**
   * When ArrowRight, returns the key to the right in the same row.
   */
  const getRightKey = (current) => {
    const keys = current.parentNode.children;

    return nextKey(keys, findKeyIndex(keys, current));
  };

  /**
   * When ArrowLeft, returns the key to the left in the same row.
   */
  const getLeftKey = (current) => {
    const keys = current.parentNode.children;

    return prevKey(keys, findKeyIndex(keys, current));
  };

  /**
   * When ArrowDown, returns the key below from the next row.
   */
  const getBottomKey = (current) => {
    const row = current.parentNode;

    if (!row.nextSibling) return null;

    const i = findKeyIndex(row.children, current);
    const nextRow = row.nextSibling;

    if (i >= nextRow.children.length) {
      return nextRow.children[nextRow.children.length - 1];
    } else {
      return nextRow.children[i];
    }
  };

  /**
   * When ArrowUp, returns the key above from the previous row.
   */
  const getTopKey = (current) => {
    const row = current.parentNode;

    if (!row.previousSibling) return null;

    const i = findKeyIndex(row.children, current);
    const prevRow = row.previousSibling;

    if (i >= prevRow.children.length) {
      return prevRow.children[prevRow.children.length - 1];
    } else {
      return prevRow.children[i];
    }
  };

  root.addEventListener("keydown", (event) => {
    let nextKey = null;

    switch (event.key) {
      case "Tab":
        nextKey = getNextKey(root.activeElement, event.shiftKey);
        break;
      case "ArrowRight":
        nextKey = getRightKey(root.activeElement);
        break;
      case "ArrowLeft":
        nextKey = getLeftKey(root.activeElement);
        break;
      case "ArrowDown":
        nextKey = getBottomKey(root.activeElement);
        break;
      case "ArrowUp":
        nextKey = getTopKey(root.activeElement);
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

    // Use the layout in the document's language or the layout in English as a fallback.
    this.layout = LAYOUT[this.language] ?? LAYOUT[defaultLanguage];

    // Setting `delegatesFocus` to true helps in Firefox to remove focus
    // when `document.activeElement.blur()` is called.
    this.root = this.attachShadow({ mode: "open", delegatesFocus: true });

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
    addKeyboardNavigation(this.root);
  }
}

export default VirtualKeyboard;
