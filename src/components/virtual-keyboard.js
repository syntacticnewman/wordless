const defaultLanguage = "en"; // English

const LAYOUT = {
  en: "qwertyuiop\nasdfghjkl\nEzxcvbnmB",
};

const createVirtualKey = (key) => {
  const virtualKey = document.createElement("button");

  virtualKey.classList.add("virtual-key");

  switch (key) {
    case /* Enter */ "E":
      virtualKey.textContent = "Enter";
      virtualKey.dataset.key = "Enter";
      virtualKey.classList.add("special");
      break;

    case /* Backspace */ "B":
      virtualKey.textContent = "Del";
      virtualKey.dataset.key = "Backspace";
      virtualKey.classList.add("special");
      break;

    default: /* letter */
      virtualKey.textContent = key;
      virtualKey.dataset.key = key;
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

    if ("BUTTON" === event.target.tagName) {
      document.dispatchEvent(
        new CustomEvent("virtualkeypressed", {
          detail: {
            key: event.target.dataset.key,
          },
        })
      );
    }
  });

  return virtualKeyboard;
};

class VirtualKeyboard extends HTMLElement {
  constructor() {
    super();

    this.language = document.documentElement.lang;

    // use the layout in the document's language or the layout in English as a fallback
    this.layout = LAYOUT[this.language] ?? LAYOUT[defaultLanguage];

    this.root = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.root.appendChild(createVirtualKeyboard(this.layout));
  }
}

export default VirtualKeyboard;
