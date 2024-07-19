import { queryFirstFocusableElement, queryVirtualKeyboard } from "./queries.js";

/**
 * Returns the active element.
 */
const getActiveElement = () => document.activeElement;

/**
 * Set focus to the given element.
 */
const focusElement = (element) => element.focus();

/**
 * Removes focus from given element.
 */
const removeFocus = (element) => element.blur();

/**
 * Removes the focus form the active focused element.
 */
export const resetFocus = () => removeFocus(getActiveElement());

/**
 * Returns if the active focused element is null.
 */
const isActiveElementNull = () => null === getActiveElement();

/**
 * Returns if the active focused element is the document body.
 */
const isActiveElementBody = () => "BODY" === getActiveElement().tagName;

/**
 * Returns if there is no active focused element.
 */
export const noActiveElement = () =>
  isActiveElementNull() || isActiveElementBody();

/**
 * Sets focus to the first focusable element in the UI.
 */
export const focusFirstElement = () =>
  focusElement(queryFirstFocusableElement());

/**
 * Returns if the focus is in the first element.
 */
export const isFirstElementFocused = () =>
  queryFirstFocusableElement() === getActiveElement();

/**
 * Sets focus to the virtual keyboard.
 */
export const focusVirtualKeyboard = () => focusElement(queryVirtualKeyboard());

/**
 * Returns if the virtual keyboard is focused.
 */
export const isVirtualKeyBoardFocused = () =>
  queryVirtualKeyboard() === getActiveElement();
