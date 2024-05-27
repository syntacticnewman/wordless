import Buffer from "../services/buffer.js";
import VirtualKeyboard from "../modules/virtual-keyboard.js";
import { en } from "../services/keyboard-layout.js";

const isLetter = (key) => /^[A-Za-z\u00f1\u00d1]$/.test(key);

const isBackSpace = (key) => key === "Backspace";

const isEnter = (key) => key === "Enter";

const processKey = (onInput, onEnter) => (key) => {
  if (isLetter(key)) {
    Buffer.push(key);
    onInput(Buffer);
  } else if (isBackSpace(key)) {
    Buffer.pop();
    onInput(Buffer);
  } else if (isEnter(key)) {
    onEnter(Buffer);
  }
};

const handleKey = (onInput, onEnter) => (event) => {
  event.preventDefault();

  processKey(onInput, onEnter)(event.key);
};

const handleVirtualKey = (onInput, onEnter) => (event) => {
  event.preventDefault();

  if (event.target instanceof HTMLButtonElement) {
    processKey(onInput, onEnter)(event.target.dataset.key);
  }
};

const init = ({ onInput, onEnter }) => {
  VirtualKeyboard.render(
    en,
    document.querySelector(".virtual-keyboard"),
    handleVirtualKey(onInput, onEnter)
  );
  document.addEventListener("keyup", handleKey(onInput, onEnter));
};

export default {
  init,
};
