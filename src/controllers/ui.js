/**
 * Selects all the guess rows.
 */
const queryAllRows = () => document.querySelectorAll(".guess.row");

/**
 * Selects a single guess or by index.
 */
const queryRow = (index) => queryAllRows().item(index);

/**
 * Selects all boxes (letters) within a guess row.
 */
const queryBoxes = (row) => row.querySelectorAll(".box");

/**
 * Selects all the virtual key from the virtual keyboard.
 */
const queryVirtualKeys = () =>
  document
    .querySelector("virtual-keyboard")
    .shadowRoot.querySelectorAll(".virtual-key");

/**
 * Renders the letter as user is typing on the current guess row given by the index.
 */
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

/**
 * Renders the feedback for each letter,
 * whether is correct (green), incorrect (gray) or wrong (yellow) by flipping the card.
 */
const renderLettersFeedback = (index, feedback) => {
  const row = queryRow(index);

  queryBoxes(row).forEach((box, i) => {
    if ("string" === typeof feedback[i].result) {
      box.classList.add("letter--flip", `letter--${feedback[i].result}`);
    }
  });
};

/**
 * Renders the invalid guess feedback by highlighting it in red.
 */
const renderInvalidGuessFeedback = (index) => {
  const row = queryRow(index);

  row.classList.add("guess--invalid");
};

/**
 * Renders feedback when user wins by adding a nice choreography animation to the guess.
 */
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

/**
 * Selects the loader spinner.
 */
const querySpinner = () => document.querySelector(".spinner");

/**
 * Animates the loader spinner.
 */
const startLoading = () => {
  const spinner = querySpinner();

  spinner.classList.add("spinner--loading");
};

/**
 * Stops animation on the loader spinner.
 */
const stopLoading = () => {
  const spinner = querySpinner();

  spinner.classList.remove("spinner--loading");
};

/**
 * Renders the feedback on each key of the virtual keyboard.
 */
const renderVirtualKeysFeedback = (keyHistory) => {
  // wait for the flip animation to complete
  setTimeout(() => {
    queryVirtualKeys().forEach((virtualKey) => {
      if ("string" === typeof keyHistory[virtualKey.dataset.key]) {
        // clean previous feedback
        virtualKey.classList.remove("correct", "wrong", "incorrect");
        // set new feedback
        virtualKey.classList.add(keyHistory[virtualKey.dataset.key]);
      }
    });
  }, 500);
};

export default {
  renderGameOverFeedback,
  renderInvalidGuessFeedback,
  renderLetters,
  renderLettersFeedback,
  renderVirtualKeysFeedback,
  startLoading,
  stopLoading,
};
