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

export default {
  flush,
  getValue,
  pop,
  push,
};
