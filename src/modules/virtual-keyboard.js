const createVirtualKey = (key) => {
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

const create = (layout) => {
  const virtualKeyboard = document.createElement("div");

  virtualKeyboard.classList.add("virtual-keyboard");

  virtualKeyboard.appendChild(createKeyboardLayout(layout));

  return virtualKeyboard;
};

export default {
  create,
};
