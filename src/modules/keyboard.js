export const isLetter = (key) => /^[A-Za-z\u00f1\u00d1]$/.test(key);

export const isBackSpace = (key) => "Backspace" === key;

export const isEnter = (key) => "Enter" === key;

export const isEsc = (key) => "Escape" === key;

export const isTab = (key) => "Tab" === key;
