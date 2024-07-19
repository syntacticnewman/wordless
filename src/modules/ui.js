import VirtualKeyboard from "../components/virtual-keyboard.js";
import GA from "../services/analytics.js";

//#region ===== Queries =====

/**
 * Returns the loading spinner.
 */
const querySpinner = () => document.querySelector(".spinner");

/**
 * Returns the About dialog.
 */
const queryAboutDialog = () => document.querySelector(".about-dialog");

/**
 * Returns the show about dialog button.
 */
const queryAboutDialogShowBtn = () =>
  document.querySelector(".about-dialog-show-btn");

/**
 * Returns the close about dialog button.
 */
const queryAboutDialogCloseBtn = () =>
  document.querySelector(".about-dialog-close-btn");

/**
 * Returns all rows.
 */
const queryAllRows = () => document.querySelectorAll(".row");

/**
 * Returns a single row by index.
 */
const queryRow = (index) => queryAllRows().item(index);

/**
 * Returns all boxes (letters) within a row.
 */
const queryBoxes = (row) => row.querySelectorAll(".box");

/**
 * Returns the first focusable element.
 */
const queryFirstFocusableElement = () => queryAboutDialogShowBtn();

/**
 * Returns the virtual keyboard component.
 */
const queryVirtualKeyboard = () => document.querySelector("virtual-keyboard");

/**
 * Returns all the virtual key from the virtual keyboard.
 */
const queryVirtualKeys = () =>
  queryVirtualKeyboard().shadowRoot.querySelectorAll(".virtual-key");

//#endregion Queries

//#region ===== Render =====

/**
 * Renders the given letters on the row given by the index.
 */
const renderLetters = (index, letters) => {
  const row = queryRow(index);

  // removes any previous error state
  row.classList.remove("guess--invalid");

  queryBoxes(row).forEach((box, i) => {
    if ("string" === typeof letters[i]) {
      box.textContent = letters[i];
      box.classList.add("letter");
    } else {
      box.textContent = "";
      box.classList.remove("letter");
    }
  });
};

/**
 * Renders the feedback for each letter by adding a class that
 * will show them in their corresponding color and a class for a flip animation.
 */
const renderLettersFeedback = (index, feedback) => {
  const row = queryRow(index);

  queryBoxes(row).forEach((box, i) => {
    if ("string" === typeof feedback[i].result) {
      box.classList.add("letter--flip", `letter--${feedback[i].result}`);
    }
  });
};

/**
 * Renders the feedback for an invalid guess by adding a class that will show it in red.
 */
const renderInvalidGuessFeedback = (index) => {
  const row = queryRow(index);

  row.classList.add("guess--invalid");
};

/**
 * Renders the feedback when game is over:
 * - If the player wins, adds a class with a nice choreography animation.
 * - If the player loses, does nothing.
 */
const renderGameOverFeedback = (index, win) => {
  if (!win) return; // TODO: feedback for losing?

  const row = queryRow(index);

  queryBoxes(row).forEach((box, i) => {
    box.style = `--i: ${i}`;
  });

  // wait for the flip animation to complete
  setTimeout(() => {
    row.classList.add("guess--correct");
  }, 500);
};

/**
 * Renders the feedback on each key of the virtual keyboard
 * by adding a class that will show them in their corresponding color.
 */
const renderVirtualKeysFeedback = (keyHistory) => {
  // wait for the flip animation to complete
  setTimeout(() => {
    queryVirtualKeys().forEach((virtualKey) => {
      if ("string" === typeof keyHistory[virtualKey.dataset.key]) {
        // clean previous feedback
        virtualKey.classList.remove("correct", "wrong", "incorrect");
        // set new feedback
        virtualKey.classList.add(keyHistory[virtualKey.dataset.key]);
      }
    });
  }, 500);
};

//#endregion Render

//#region ===== Modals =====

const initModals = () => {
  const aboutDialog = queryAboutDialog();
  const showAboutDialogButton = queryAboutDialogShowBtn();
  const closeAboutDialogButton = queryAboutDialogCloseBtn();

  showAboutDialogButton.addEventListener("click", () => {
    aboutDialog.showModal();
    GA.trackAboutDialog(true);
  });

  closeAboutDialogButton.addEventListener("click", () => {
    aboutDialog.close();
  });

  aboutDialog.addEventListener("close", () => {
    GA.trackAboutDialog(false);
  });
};

//#endregion Modals

//#region ===== Utils =====

/**
 * Animates the loading spinner.
 */
const startLoading = () => {
  const spinner = querySpinner();

  spinner.classList.add("spinner--loading");
};

/**
 * Stops the loading spinner.
 */
const stopLoading = () => {
  const spinner = querySpinner();

  spinner.classList.remove("spinner--loading");
};

/**
 * Focus element
 */
const focusElement = (element) => element.focus();

/**
 * Removes focus from given element.
 */
const removeFocus = (element) => element.blur();

/**
 * Removes the focus form the active focused element.
 */
const resetFocus = () => removeFocus(document.activeElement);

/**
 * Returns if the active focused element is null
 */
const isActiveElementNull = () => null === document.activeElement;

/**
 * Returns if the active focused element is the document body.
 */
const isActiveElementBody = () => "BODY" === document.activeElement.tagName;

/**
 * Returns if there is no active focused element.
 */
const noActiveElement = () => isActiveElementNull() || isActiveElementBody();

/**
 * Sets focus to the first focusable element in the UI.
 */
const focusFirstElement = () => focusElement(queryFirstFocusableElement());

/**
 * Returns if the focus is in the first element.
 */
const isFirstElementFocused = () =>
  queryFirstFocusableElement() === document.activeElement;

/**
 * Sets focus to the virtual keyboard.
 */
const focusVirtualKeyboard = () => focusElement(queryVirtualKeyboard());

/**
 * Returns if the virtual keyboard is focused.
 */
const isVirtualKeyBoardFocused = () =>
  queryVirtualKeyboard() === document.activeElement;

//#endregion Utils

//#region ===== Init =====

const init = () => {
  // register virtual keyboard component
  customElements.define("virtual-keyboard", VirtualKeyboard);
  // initialize UI modals
  initModals();
};

//#endregion Init

export default {
  focusFirstElement,
  focusVirtualKeyboard,
  init,
  isFirstElementFocused,
  isVirtualKeyBoardFocused,
  noActiveElement,
  renderGameOverFeedback,
  renderInvalidGuessFeedback,
  renderLetters,
  renderLettersFeedback,
  renderVirtualKeysFeedback,
  resetFocus,
  startLoading,
  stopLoading,
};
