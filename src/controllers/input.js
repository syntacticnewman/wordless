import Buffer from "../services/buffer.js";
import { isBackSpace, isEnter, isLetter } from "../modules/keyboard.js";

let _onInput = (buffer) => console.info("Buffer.onChange->", buffer.getValue());
let _onEnter = (buffer) => console.info("Buffer.onEnter->", buffer.getValue());

const isActiveElementVirtual = () =>
  document.activeElement.classList.contains("virtual-key");

const removeActiveElementFocus = () => document.activeElement.blur();

const processLetterKey = (key, virtual) => {
  // When the key pressed is a physical key
  // and previous focused key is virtual,
  // remove the focus of that key element.
  if (!virtual && isActiveElementVirtual()) {
    removeActiveElementFocus();
  }

  Buffer.push(key);

  _onInput(Buffer);
};

const processBackspaceKey = () => {
  Buffer.pop();

  _onInput(Buffer);
};

const processEnterKey = (virtual) => {
  // If the physical Enter key is pressed over a focused virtual key,
  // do nothing, as the virtual key will be processed on its own.
  // This prevents accidental premature submission of a guess
  // while entering letters on the virtual keyboard.
  if (!virtual && isActiveElementVirtual()) {
    return;
  }

  _onEnter(Buffer);
};

const processKey = (key, virtual = false) => {
  if (isLetter(key)) {
    processLetterKey(key, virtual);
  } else if (isBackSpace(key)) {
    processBackspaceKey();
  } else if (isEnter(key)) {
    processEnterKey(virtual);
  }
};

const init = ({ onInput, onEnter }) => {
  // virtual keyboard
  document.addEventListener("virtualkeypressed", (event) => {
    processKey(event.detail.key, true);
  });

  // physical keyboard
  document.addEventListener("keyup", (event) => {
    event.preventDefault();
    processKey(event.key);
  });

  // subscribers
  // TODO: implement an observer pattern for this?
  _onInput = "function" === typeof onInput ? onInput : _onInput;
  _onEnter = "function" === typeof onEnter ? onEnter : _onEnter;
};

export default { init };
