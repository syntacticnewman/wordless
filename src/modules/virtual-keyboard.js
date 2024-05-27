const createKeyButton = (key) => {
  const btn = document.createElement("button");

  btn.classList.add("button", "key");

  if ("E" === key) {
    btn.textContent = "Enter";
    btn.dataset.key = "Enter";
    btn.classList.add("special");
  } else if ("B" === key) {
    btn.textContent = "Del";
    btn.dataset.key = "Backspace";
    btn.classList.add("special");
  } else {
    btn.textContent = key;
    btn.dataset.key = key;
  }

  return btn;
};

const createKeyRow = (keys) => {
  const keyRow = document.createElement("div");

  keyRow.classList.add("key-row");

  keyRow.append(...keys.split("").map(createKeyButton));

  return keyRow;
};

const render = (layout, parent, onClick) => {
  const keyboard = document.createElement("div");

  keyboard.classList.add("keyboard-layout");

  keyboard.append(...layout.split("\n").map(createKeyRow));

  keyboard.addEventListener("click", onClick);

  parent.appendChild(keyboard);
};

export default {
  render,
};
