import {
  queryBoxes,
  queryRow,
  querySpinner,
  queryVirtualKeys,
} from "./queries.js";

/**
 * Animates the loading spinner.
 */
export const startLoading = () => {
  const spinner = querySpinner();

  spinner.classList.add("spinner--loading");
};

/**
 * Stops the loading spinner.
 */
export const stopLoading = () => {
  const spinner = querySpinner();

  spinner.classList.remove("spinner--loading");
};

/**
 * Renders the given letters on the row given by the index.
 */
export const renderLetters = (index, letters) => {
  const row = queryRow(index);

  // removes any previous error state
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
 * Renders the feedback for each letter by adding a class that
 * will show them in their corresponding color and a class for a flip animation.
 */
export const renderLettersFeedback = (index, feedback) => {
  const row = queryRow(index);

  queryBoxes(row).forEach((box, i) => {
    if ("string" === typeof feedback[i].result) {
      box.classList.add("letter--flip", `letter--${feedback[i].result}`);
    }
  });
};

/**
 * Renders the feedback for an invalid guess by adding a class that will show it in red.
 */
export const renderInvalidGuessFeedback = (index) => {
  const row = queryRow(index);

  row.classList.add("guess--invalid");
};

/**
 * Renders the feedback when game is over:
 * - if the player wins, adds a class with a nice choreography animation.
 * - if the player loses, does nothing.
 */
export const renderGameOverFeedback = (index, win) => {
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
 * Renders the feedback on each key of the virtual keyboard
 * by adding a class that will show them in their corresponding color.
 */
export const renderVirtualKeysFeedback = (keyHistory) => {
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
