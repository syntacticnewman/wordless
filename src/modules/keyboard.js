export const layout = {
  en: "qwertyuiop\nasdfghjkl\nEzxcvbnmB",
};

export const isLetter = (key) => /^[A-Za-z\u00f1\u00d1]$/.test(key);

export const isBackSpace = (key) => key === "Backspace";

export const isEnter = (key) => key === "Enter";
