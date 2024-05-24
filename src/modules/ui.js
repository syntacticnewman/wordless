const queryAllRows = () => document.querySelectorAll(".guess.row");

const queryRow = (index) => queryAllRows()[index];

const queryBoxes = (node) => node.querySelectorAll(".box");

const renderLetters = (node, letters) => {
  const boxes = Array.from(queryBoxes(node));

  boxes.forEach((box, index) => {
    if (typeof letters[index] === "string") {
      box.textContent = letters[index];
      box.classList.add("letter");
    } else {
      box.textContent = "";
      box.classList.remove("letter");
    }
  });
};

const renderFeedback = (node, feedback) => {
  Array.from(queryBoxes(node)).forEach((box, index) => {
    if (typeof feedback[index] === "string") {
      box.classList.replace("letter", `letter--${feedback[index]}`);
    }
  });
};

export default {
  queryRow,
  renderFeedback,
  renderLetters,
};
