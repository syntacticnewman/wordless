import Buffer from "../services/buffer.js";
import { isBackSpace, isEnter, isLetter } from "../modules/keyboard.js";

export const INPUT_CHANGE_EVENT = "winputchange";
export const INPUT_SUBMIT_EVENT = "winputsubmit";

const isActiveElementVirtual = () =>
  document.activeElement.classList.contains("virtual-key");

const removeActiveElementFocus = () => document.activeElement.blur();

const notifyInputChange = () => {
  document.dispatchEvent(
    new CustomEvent(INPUT_CHANGE_EVENT, { detail: Buffer.getValue() })
  );
};

const notifyInputSubmit = () => {
  document.dispatchEvent(
    new CustomEvent(INPUT_SUBMIT_EVENT, { detail: Buffer.getValue() })
  );
};

const processLetterKey = (key, virtual) => {
  // When the key pressed is a physical key
  // and previous focused key is virtual,
  // remove the focus of that key element.
  if (!virtual && isActiveElementVirtual()) {
    removeActiveElementFocus();
  }

  Buffer.push(key);

  notifyInputChange();
};

const processBackspaceKey = () => {
  Buffer.pop();

  notifyInputChange();
};

const processEnterKey = (virtual) => {
  // If the physical Enter key is pressed over a focused virtual key,
  // do nothing, as the virtual key will be processed on its own.
  // This prevents accidental premature submission of a guess
  // while entering letters on the virtual keyboard.
  if (!virtual && isActiveElementVirtual()) {
    return;
  }

  notifyInputSubmit();
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

const clear = () => {
  Buffer.flush();
};

const init = () => {
  // virtual keyboard
  document.addEventListener("virtualkeypressed", (event) => {
    processKey(event.detail.key, true);
  });

  // physical keyboard
  document.addEventListener("keyup", (event) => {
    event.preventDefault();
    processKey(event.key);
  });
};

export default { init, clear };
