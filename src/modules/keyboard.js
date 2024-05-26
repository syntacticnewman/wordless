import Buffer from "../services/buffer.js";

const isLetter = (key) => /^[A-Za-z\u00f1\u00d1]$/.test(key);

const isBackSpace = (key) => key === "Backspace";

const isEnter = (key) => key === "Enter";

const handleKey = (onBufferChange, onEnter) => (event) => {
  event.preventDefault();

  const key = event.key;

  if (isLetter(key)) {
    Buffer.push(key);
    onBufferChange(Buffer);
  } else if (isBackSpace(key)) {
    Buffer.pop();
    onBufferChange(Buffer);
  } else if (isEnter(key)) {
    onEnter(Buffer);
  }
};

const init = ({ onBufferChange, onEnter }) => {
  document.addEventListener("keyup", handleKey(onBufferChange, onEnter));
};

export default {
  init,
};
