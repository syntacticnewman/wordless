const defaultLanguage = "en"; // English

const LAYOUT = {
  en: "qwertyuiop\nasdfghjkl\nEzxcvbnmB",
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

    this.appendChild(VirtualKeyboard.create(layout));
  }

  static create(layout) {
    const virtualKeyboard = document.createElement("div");

    virtualKeyboard.classList.add("virtual-keyboard");

    virtualKeyboard.appendChild(VirtualKeyboard.createKeyboardLayout(layout));

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
  }

  static createKeyboardLayout(layout) {
    const keyboardLayout = document.createElement("div");

    keyboardLayout.classList.add("keyboard-layout");

    keyboardLayout.append(
      ...layout.split("\n").map(VirtualKeyboard.createKeyRow)
    );

    return keyboardLayout;
  }

  static createKeyRow(keys) {
    const keyRow = document.createElement("div");

    keyRow.classList.add("key-row");

    keyRow.append(...keys.split("").map(VirtualKeyboard.createVirtualKey));

    return keyRow;
  }

  static createVirtualKey(key) {
    const btn = document.createElement("button");

    btn.classList.add("virtual-key");

    switch (key) {
      case /* Enter */ "E":
        btn.textContent = "Enter";
        btn.dataset.key = "Enter";
        btn.classList.add("special");
        break;

      case /* Backspace */ "B":
        btn.textContent = "Del";
        btn.dataset.key = "Backspace";
        btn.classList.add("special");
        break;

      default: /* letter */
        btn.textContent = key;
        btn.dataset.key = key;
    }

    return btn;
  }
}

export default VirtualKeyboard;
