const isLetter = (key) => /^[A-Za-z\u00f1\u00d1]$/.test(key);

const isBackSpace = (key) => "Backspace" === key;

const isEnter = (key) => "Enter" === key;

const isEsc = (key) => "Escape" === key;

const isTab = (key) => "Tab" === key;

export default {
  isLetter,
  isBackSpace,
  isEnter,
  isEsc,
  isTab,
};
