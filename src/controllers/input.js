import Buffer from "../services/buffer.js";
import * as Keyboard from "../modules/keyboard.js";
import UI from "../modules/ui.js";

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
 * When a letter key is pressed,
 * add the letter to the input buffer
 * and dispatch an input change event.
 */
const processLetterKey = (key, virtualKey) => {
  // When the letter key pressed is a physical key
  // and the virtual keyboard was focused,
  // remove the focus.
  if (!virtualKey && UI.isVirtualKeyBoardFocused()) {
    UI.resetFocus();
  }

  Buffer.push(key);

  notifyInputChange();
};

/**
 * When the Backspace key is pressed,
 * remove the last character entered in the input buffer
 * and dispatch an input change event.
 */
const processBackspaceKey = () => {
  Buffer.pop();

  notifyInputChange();
};

/**
 * When the Enter key is pressed, dispatch an input submit event.
 */
const processEnterKey = (virtualEnterKey) => {
  // always process the virtual Enter key
  if (virtualEnterKey) {
    notifyInputSubmit();
  }

  // process physical Enter key if there is no focused element
  if (UI.noActiveElement()) {
    notifyInputSubmit();
  }
};

/**
 * Processes the key pressed depending on whether is a letter,
 * the Enter key or the Backspace key.
 */
const processKey = (key, virtualKey = false) => {
  if (Keyboard.isLetter(key)) {
    processLetterKey(key, virtualKey);
  } else if (Keyboard.isBackSpace(key)) {
    processBackspaceKey();
  } else if (Keyboard.isEnter(key)) {
    processEnterKey(virtualKey);
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
