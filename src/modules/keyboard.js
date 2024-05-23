import buffer from "../services/buffer.js";

const isLetter = (key) => /^[A-Za-z\u00f1\u00d1]$/.test(key);

const isBackSpace = (key) => key === "Backspace";

const isEnter = (key) => key === "Enter";

const handleKey = (onBufferChange, onEnter) => (event) => {
  event.preventDefault();

  const key = event.key;

  if (isLetter(key)) {
    buffer.push(key);
    onBufferChange(buffer);
  } else if (isBackSpace(key)) {
    buffer.pop();
    onBufferChange(buffer);
  } else if (isEnter(key)) {
    onEnter(buffer);
  }
};

const init = ({ onBufferChange, onEnter }) => {
  document.addEventListener("keyup", handleKey(onBufferChange, onEnter));
};

export default {
  init,
};
