import Buffer from "../services/buffer.js";
import { isBackSpace, isEnter, isLetter } from "../modules/keyboard.js";

export const INPUT_CHANGE_EVENT = "winputchange";
export const INPUT_SUBMIT_EVENT = "winputsubmit";

/**
 * Dispatches an input change custom event.
 */
const notifyInputChange = () => {
  document.dispatchEvent(
    new CustomEvent(INPUT_CHANGE_EVENT, { detail: Buffer.getValue() })
  );
};

/**
 * Dispatches an input submit custom event.
 */
const notifyInputSubmit = () => {
  document.dispatchEvent(
    new CustomEvent(INPUT_SUBMIT_EVENT, { detail: Buffer.getValue() })
  );
};

/**
 * Removes all the contents of the input buffer.
 */
const clear = () => {
  Buffer.flush();
};

/**
 * Checks if element is a virtual key.
 */
const isVirtualKey = (element) => element.classList.contains("virtual-key");

/**
 * Removes focus from given element.
 */
const removeFocus = (element) => element.blur();

/**
 * When a letter key is pressed,
 * it will add the letter to the input buffer
 * and dispatch an input change event.
 */
const processLetterKey = (key, virtual) => {
  // When the key pressed is a physical key
  // and previous focused key is virtual,
  // remove the focus of that key element.
  if (!virtual && isVirtualKey(document.activeElement)) {
    removeFocus(document.activeElement);
  }

  Buffer.push(key);

  notifyInputChange();
};

/**
 * When the Backspace key is pressed,
 * it will remove the last character entered in the input buffer
 * and dispatch an input change event.
 */
const processBackspaceKey = () => {
  Buffer.pop();

  notifyInputChange();
};

/**
 * When the Enter key is pressed,
 * it will dispatch a input submit event
 * except if the Enter key was pressed while focusing a virtual key.
 */
const processEnterKey = (virtual) => {
  // If the physical Enter key is pressed over a focused virtual key,
  // do nothing, as the virtual key will be processed on its own.
  // This prevents accidental premature submission of a guess
  // while entering letters on the virtual keyboard.
  if (!virtual && isVirtualKey(document.activeElement)) {
    return;
  }

  notifyInputSubmit();
};

/**
 * Processes the key pressed depending on whether is a letter,
 * the Enter key or the Backspace key.
 */
const processKey = (key, virtual = false) => {
  if (isLetter(key)) {
    processLetterKey(key, virtual);
  } else if (isBackSpace(key)) {
    processBackspaceKey();
  } else if (isEnter(key)) {
    processEnterKey(virtual);
  }
};

/**
 * Registers the event handlers for the virtual keyboard
 * and the physical keyboard when keys are pressed,
 * to handle user input.
 */
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
