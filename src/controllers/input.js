import Buffer from "../services/buffer.js";
import * as Keyboard from "../modules/keyboard.js";
import UI from "../modules/ui.js";

//#region ===== Events =====

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

//#endregion Events

//#region ===== Processors =====

/**
 * When a letter key is pressed,
 * adds the letter to the input buffer,
 * then dispatches the input change event.
 */
const processLetterKey = (key, virtualKey) => {
  // If the virtual keyboard was focused, and a physical key is pressed,
  // then resets the focus.
  if (UI.isVirtualKeyBoardFocused() && !virtualKey) {
    UI.resetFocus();
  }

  Buffer.push(key);

  notifyInputChange();

  return true;
};

/**
 * When the Backspace key is pressed,
 * removes the last character entered from the input buffer,
 * then dispatches an input change event.
 */
const processBackspaceKey = () => {
  Buffer.pop();

  notifyInputChange();

  return true;
};

/**
 * When the Enter key is pressed,
 * dispatches an input submit event.
 */
const processEnterKey = (virtualEnterKey) => {
  // always process the virtual Enter key
  if (virtualEnterKey) {
    notifyInputSubmit();
    return true;
  }

  // process physical Enter key if there is no focused element
  if (UI.noActiveElement()) {
    notifyInputSubmit();
    return true;
  }

  return false;
};

/**
 * When the Tab key is pressed,
 * if there's no an actual element focused,
 * then set the focus to the first focusable element in the UI.
 */
const processTabKey = () => {
  if (UI.noActiveElement()) {
    UI.focusFirstElement();
    return true;
  }

  return false;
};

/**
 * When the Esc key is pressed,
 * remove the focus on the active element.
 */
const processEscKey = () => {
  UI.resetFocus();

  return true;
};

/**
 * Processes the key pressed depending on whether is a letter,
 * the Enter key or the Backspace key.
 */
const processKey = (key, virtualKey = false) => {
  if (Keyboard.isLetter(key)) {
    return processLetterKey(key, virtualKey);
  } else if (Keyboard.isBackSpace(key)) {
    return processBackspaceKey();
  } else if (Keyboard.isEnter(key)) {
    return processEnterKey(virtualKey);
  } else if (Keyboard.isTab(key)) {
    return processTabKey();
  } else if (Keyboard.isEsc(key)) {
    return processEscKey();
  }

  return false;
};

//#endregion Processors

//#region ===== Utils =====

/**
 * Removes all the contents of the input buffer.
 */
const clear = () => {
  Buffer.flush();
};

//#endregion Utils

//#region ===== Init =====

/**
 * Registers the event handlers for the virtual keyboard
 * and the physical keyboard when keys are pressed,
 * to handle user input.
 */
const init = () => {
  // physical keyboard
  document.addEventListener("keydown", (event) => {
    const handled = processKey(event.key);

    if (handled) {
      event.preventDefault();
    }
  });

  // virtual keyboard
  document.addEventListener("virtualkeypressed", (event) => {
    processKey(event.detail.key, true);
  });
};

//#endregion Init

export default { init, clear };
