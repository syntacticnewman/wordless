import { backspaceIcon } from "./icons/backspace-icon.js";

/**
 * Creates the button for the virtual key.
 */
const createVirtualKey = (key) => {
  const virtualKey = document.createElement("button");

  virtualKey.classList.add("virtual-key");

  switch (key) {
    case /* Enter */ "E":
      virtualKey.dataset.key = "Enter";
      virtualKey.textContent = "Enter";
      virtualKey.classList.add("enter-key");
      break;

    case /* Backspace */ "B":
      virtualKey.dataset.key = "Backspace";
      virtualKey.ariaLabel = "Delete";
      virtualKey.innerHTML = backspaceIcon;
      virtualKey.classList.add("backspace-key");
      break;

    default: /* letter */
      virtualKey.dataset.key = key;
      virtualKey.textContent = key;
  }

  return virtualKey;
};

/**
 * Creates the container row for the virtual keys.
 * @example Q W E R T Y
 */
const createKeyRow = (keys) => {
  const keyRow = document.createElement("div");

  keyRow.classList.add("key-row");

  keyRow.append(...keys.split("").map(createVirtualKey));

  return keyRow;
};

/**
 * Creates the container layout for the keyboard rows.
 * @example
 * Q W E R T Y
 *  A S D F
 *   Z X C
 */
const createKeyboardLayout = (layout) => {
  const keyboardLayout = document.createElement("div");

  keyboardLayout.classList.add("keyboard-layout");

  keyboardLayout.append(...layout.split("\n").map(createKeyRow));

  return keyboardLayout;
};

/**
 * Creates the main container for the Virtual Keyboard
 * and sets up the event listener fo click events.
 */
export const createVirtualKeyboard = (layout) => {
  const virtualKeyboard = document.createElement("div");

  virtualKeyboard.classList.add("virtual-keyboard");

  virtualKeyboard.appendChild(createKeyboardLayout(layout));

  virtualKeyboard.addEventListener("click", (event) => {
    event.preventDefault();

    const virtualKey = event.target.closest(".virtual-key");

    if (virtualKey) {
      document.dispatchEvent(
        new CustomEvent("virtualkeypressed", {
          detail: {
            key: virtualKey.dataset.key,
          },
        })
      );
    }
  });

  return virtualKeyboard;
};

export const addKeyboardNavigation = (root) => {
  /**
   * All virtual keys in the virtual keyboard.
   */
  const allKeys = root.querySelectorAll(".virtual-key");

  /**
   * Returns the index of a key in the array of keys.
   */
  const findKeyIndex = (keys, currentKey) =>
    Array.from(keys).findIndex((key) => currentKey === key);

  /**
   * Returns the next key (with circular array indexing) from the given index.
   */
  const nextKey = (keys, index) => keys[(index + 1) % keys.length];

  /**
   * Returns the previous key (with circular array indexing) from the given index.
   */
  const prevKey = (keys, index) =>
    keys[(index - 1 + keys.length) % keys.length];

  /**
   * When Tab, returns the next key, or the previous while the Shift key is hold.
   */
  const getNextKey = (current, shiftKey) => {
    if (shiftKey) {
      return prevKey(allKeys, findKeyIndex(allKeys, current));
    } else {
      return nextKey(allKeys, findKeyIndex(allKeys, current));
    }
  };

  /**
   * When ArrowRight, returns the key to the right in the same row.
   */
  const getRightKey = (current) => {
    const keys = current.parentNode.children;

    return nextKey(keys, findKeyIndex(keys, current));
  };

  /**
   * When ArrowLeft, returns the key to the left in the same row.
   */
  const getLeftKey = (current) => {
    const keys = current.parentNode.children;

    return prevKey(keys, findKeyIndex(keys, current));
  };

  /**
   * When ArrowDown, returns the key below from the next row.
   */
  const getBottomKey = (current) => {
    const row = current.parentNode;

    if (!row.nextSibling) return null;

    const i = findKeyIndex(row.children, current);
    const nextRow = row.nextSibling;

    if (i >= nextRow.children.length) {
      return nextRow.children[nextRow.children.length - 1];
    } else {
      return nextRow.children[i];
    }
  };

  /**
   * When ArrowUp, returns the key above from the previous row.
   */
  const getTopKey = (current) => {
    const row = current.parentNode;

    if (!row.previousSibling) return null;

    const i = findKeyIndex(row.children, current);
    const prevRow = row.previousSibling;

    if (i >= prevRow.children.length) {
      return prevRow.children[prevRow.children.length - 1];
    } else {
      return prevRow.children[i];
    }
  };

  root.addEventListener("keydown", (event) => {
    let nextKey = null;

    switch (event.key) {
      case "Tab":
        nextKey = getNextKey(root.activeElement, event.shiftKey);
        break;
      case "ArrowRight":
        nextKey = getRightKey(root.activeElement);
        break;
      case "ArrowLeft":
        nextKey = getLeftKey(root.activeElement);
        break;
      case "ArrowDown":
        nextKey = getBottomKey(root.activeElement);
        break;
      case "ArrowUp":
        nextKey = getTopKey(root.activeElement);
        break;
      default:
        return;
    }

    if (nextKey) {
      event.preventDefault();
      nextKey.focus();
    }
  });
};
