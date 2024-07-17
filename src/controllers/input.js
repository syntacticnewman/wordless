import Buffer from "../services/buffer.js";
import Keyboard from "../modules/keyboard.js";
import UI from "../modules/ui.js";

//#region ===== Utils =====

/**
 * Removes all the contents of the input buffer.
 */
const clear = () => {
  Buffer.flush();
};

//#endregion Utils

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

//#region ===== Handlers =====

/**
 * When a letter key is pressed,
 * adds the letter to the input buffer,
 * then dispatches the input change event.
 */
const handleLetterKey = (key, virtualKey) => {
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
const handleBackspaceKey = () => {
  Buffer.pop();

  notifyInputChange();

  return true;
};

/**
 * When the Enter key is pressed,
 * dispatches an input submit event.
 */
const handleEnterKey = (virtualEnterKey) => {
  // only handle the Enter key when:
  // - is virtual
  // - or is physical but there's no focused element
  if (virtualEnterKey || UI.noActiveElement()) {
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
const handleTabKey = () => {
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
const handleEscKey = () => {
  UI.resetFocus();

  return true;
};

/**
 * Handles the key pressed.
 */
const handleKey = (key, virtualKey = false) => {
  if (Keyboard.isLetter(key)) {
    return handleLetterKey(key, virtualKey);
  } else if (Keyboard.isBackSpace(key)) {
    return handleBackspaceKey();
  } else if (Keyboard.isEnter(key)) {
    return handleEnterKey(virtualKey);
  } else if (Keyboard.isTab(key)) {
    return handleTabKey();
  } else if (Keyboard.isEsc(key)) {
    return handleEscKey();
  }

  return false;
};

//#endregion Handlers

//#region ===== Init =====

/**
 * Registers the event handlers for the virtual keyboard
 * and the physical keyboard when keys are pressed,
 * to handle user input.
 */
const init = () => {
  // physical keyboard
  document.addEventListener("keydown", (event) => {
    const handled = handleKey(event.key);

    if (handled) {
      event.preventDefault();
    }
  });

  // virtual keyboard
  document.addEventListener("virtualkeypressed", (event) => {
    handleKey(event.detail.key, true);
  });
};

//#endregion Init

export default { init, clear };
