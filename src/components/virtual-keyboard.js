const defaultLanguage = "en"; // English

const LAYOUT = {
  en: "qwertyuiop\nasdfghjkl\nEzxcvbnmB",
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

class VirtualKeyboard extends HTMLElement {
  constructor() {
    super();

    this.language = document.documentElement.lang;

    // use the layout in the document's language or the layout in English as a fallback
    this.layout = LAYOUT[this.language] ?? LAYOUT[defaultLanguage];

    this.root = this.attachShadow({ mode: "open" });

    // load CSS
    const stylesLink = document.createElement("link");

    stylesLink.setAttribute("rel", "stylesheet");
    stylesLink.setAttribute("href", "src/components/virtual-keyboard.css");

    this.root.appendChild(stylesLink);
  }

  connectedCallback() {
    this.root.appendChild(createVirtualKeyboard(this.layout));
  }
}

export default VirtualKeyboard;
