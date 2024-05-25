const queryAllRows = () => document.querySelectorAll(".guess.row");

const queryRow = (index) => queryAllRows().item(index);

const queryBoxes = (row) => row.querySelectorAll(".box");

const renderLetters = (index, letters) => {
  const row = queryRow(index);

  // remove previous error state
  row.classList.remove("guess--invalid");

  queryBoxes(row).forEach((box, i) => {
    if ("string" === typeof letters[i]) {
      box.textContent = letters[i];
      box.classList.add("letter");
    } else {
      box.textContent = "";
      box.classList.remove("letter");
    }
  });
};

const renderLettersFeedback = (index, feedback) => {
  const row = queryRow(index);

  queryBoxes(row).forEach((box, i) => {
    if ("string" === typeof feedback[i]) {
      box.classList.add("letter--flip", `letter--${feedback[i]}`);
    }
  });
};

const renderGuessFeedback = (index) => {
  const row = queryRow(index);

  row.classList.add("guess--invalid");
};

const renderGameOverFeedback = (index, win) => {
  if (!win) return; // TODO: feedback for losing?

  const row = queryRow(index);

  queryBoxes(row).forEach((box, i) => {
    box.style = `--i: ${i}`;
  });

  // wait for the flip animation to complete
  setTimeout(() => {
    row.classList.add("guess--correct");
  }, 500);
};

export default {
  renderGameOverFeedback,
  renderGuessFeedback,
  renderLetters,
  renderLettersFeedback,
};
