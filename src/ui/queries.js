/**
 * Returns the loading spinner.
 */
export const querySpinner = () => document.querySelector(".spinner");

/**
 * Returns the About modal.
 */
export const queryAboutModal = () => document.querySelector(".about-modal");

/**
 * Returns the "?" (show about modal) button.
 */
export const queryShowAboutModalBtn = () =>
  document.querySelector(".about-modal-show-btn");

/**
 * Returns the "X" (close about modal) button.
 */
export const queryCloseAboutModalBtn = () =>
  document.querySelector(".about-modal-close-btn");

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
export const queryFirstFocusableElement = () => queryShowAboutModalBtn();
