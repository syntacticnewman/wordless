const queryAllRows = () => document.querySelectorAll(".guess.row");

const queryRow = (index) => queryAllRows().item(index);

const queryBoxes = (row) => row.querySelectorAll(".box");

const renderLetters = (index, letters) => {
  const row = queryRow(index);

  if (row) {
    // remove previous error state
    row.classList.remove("guess--invalid");

    queryBoxes(row).forEach((box, index) => {
      if ("string" === typeof letters[index]) {
        box.textContent = letters[index];
        box.classList.add("letter");
      } else {
        box.textContent = "";
        box.classList.remove("letter");
      }
    });
  }
};

const renderLettersFeedback = (index, feedback) => {
  const row = queryRow(index);

  if (row) {
    queryBoxes(row).forEach((box, index) => {
      if ("string" === typeof feedback[index]) {
        box.classList.add("letter--flip", `letter--${feedback[index]}`);
      }
    });
  }
};

const renderGuessFeedback = (index) => {
  const row = queryRow(index);

  if (row) {
    row.classList.add("guess--invalid");
  }
};

export default {
  renderGuessFeedback,
  renderLetters,
  renderLettersFeedback,
};
