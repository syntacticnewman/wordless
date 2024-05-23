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

export default {
  queryRow,
  renderLetters,
};
