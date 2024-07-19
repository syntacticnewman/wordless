/**
 * Returns the loading spinner.
 */
export const querySpinner = () => document.querySelector(".spinner");

/**
 * Returns the About dialog.
 */
export const queryAboutDialog = () => document.querySelector(".about-dialog");

/**
 * Returns the "?" (show about dialog) button.
 */
export const queryAboutDialogShowBtn = () =>
  document.querySelector(".about-dialog-show-btn");

/**
 * Returns the "X" (close about dialog) button.
 */
export const queryAboutDialogCloseBtn = () =>
  document.querySelector(".about-dialog-close-btn");

/**
 * Returns all guess rows.
 */
const queryAllRows = () => document.querySelectorAll(".row");

/**
 * Returns a single guess row by index.
 */
export const queryRow = (index) => queryAllRows().item(index);

/**
 * Returns all boxes (letters) within a guess row.
 */
export const queryBoxes = (row) => row.querySelectorAll(".box");

/**
 * Returns the virtual keyboard component.
 */
export const queryVirtualKeyboard = () =>
  document.querySelector("virtual-keyboard");

/**
 * Returns all the virtual key within the virtual keyboard.
 */
export const queryVirtualKeys = () =>
  queryVirtualKeyboard().shadowRoot.querySelectorAll(".virtual-key");

/**
 * Returns the first focusable element.
 */
export const queryFirstFocusableElement = () => queryAboutDialogShowBtn();
