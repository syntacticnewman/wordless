export const BUFFER_MAX_LENGTH = 5;

let buffer = "";

const push = (str) => {
  if (buffer.length < BUFFER_MAX_LENGTH) {
    buffer += String(str).toLowerCase();
  }
};

const pop = () => {
  if (buffer.length > 0) {
    buffer = buffer.substring(0, buffer.length - 1);
  }
};

const flush = () => {
  buffer = "";
};

const getValue = () => buffer;

const toArray = () => buffer.split("");

const isEmpty = () => 0 === buffer.length;

export default {
  flush,
  getValue,
  isEmpty,
  pop,
  push,
  toArray,
};
