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
  connectedCallback() {
    const language = document.documentElement.lang;

    let layout = LAYOUT[language];

    if ("undefined" === typeof layout) {
      console.warn(
        `Language '${language}' not supported. Falling back to '${defaultLanguage}' language.`
      );

      layout = LAYOUT[defaultLanguage];
    }

    this.appendChild(createVirtualKeyboard(layout));
  }
}

export default VirtualKeyboard;
