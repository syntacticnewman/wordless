import VirtualKeyboard from "../components/virtual-keyboard.js";

//#region ===== Queries =====

/**
 * Selects the loading spinner.
 */
const querySpinner = () => document.querySelector(".spinner");

/**
 * Selects all rows (guesses).
 */
const queryAllRows = () => document.querySelectorAll(".guess.row");

/**
 * Selects a single row by index.
 */
const queryRow = (index) => queryAllRows().item(index);

/**
 * Selects all boxes (letters) within a row (guess).
 */
const queryBoxes = (row) => row.querySelectorAll(".box");

/**
 * Selects all the virtual key from the virtual keyboard.
 */
const queryVirtualKeys = () =>
  document
    .querySelector("virtual-keyboard")
    .shadowRoot.querySelectorAll(".virtual-key");

//#endregion

//#region ===== Render =====

/**
 * Renders the letter as the user types on the current row (guess) index.
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
 * Renders the feedback color for each letter with a flip animation.
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
 * Renders feedback when game is over.
 * If the player wins adds a nice choreography animation.
 * If the player loses, does nothing.
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

//#endregion

//#region ===== Loading =====

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

//#endregion

//#region ===== Modals =====

const initModals = (GA) => {
  const aboutDialog = document.querySelector(".about-dialog");
  const aboutShowButton = document.querySelector(".about-dialog-show-btn");
  const aboutCloseButton = document.querySelector(".about-dialog-close-btn");

  aboutShowButton.addEventListener("click", () => {
    aboutDialog.showModal();
    GA.trackAboutDialog(true);
  });

  aboutCloseButton.addEventListener("click", () => {
    aboutDialog.close();
  });

  aboutDialog.addEventListener("close", () => {
    GA.trackAboutDialog(false);
  });
};

//#endregion

//#region ===== Init =====

const init = (GA) => {
  // register virtual keyboard component
  customElements.define("virtual-keyboard", VirtualKeyboard);
  // initialize UI modals
  initModals(GA);
};

//#endregion

export default {
  init,
  renderGameOverFeedback,
  renderInvalidGuessFeedback,
  renderLetters,
  renderLettersFeedback,
  renderVirtualKeysFeedback,
  startLoading,
  stopLoading,
};
