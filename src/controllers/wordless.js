import Game from "../modules/game.js";
import Input, { INPUT_CHANGE_EVENT, INPUT_SUBMIT_EVENT } from "./input.js";
import UI from "./ui.js";

/**
 * Updates the key history to keep track of the letters the user has submitted
 * to show them in their corresponding color in the virtual keyboard.
 */
const updateKeyHistory = (feedback) => {
  const keyHistory = wordless.store.getState().keyHistory;
  // This order helps to avoid collisions with feedback,
  // for example, a letter can be correct and wrong at the same time
  // when a word has that letter more than once.
  const order = {
    correct: 2,
    wrong: 1,
    incorrect: 0,
  };

  feedback.forEach(({ letter, result }) => {
    if ("undefined" === typeof keyHistory[letter]) {
      keyHistory[letter] = result;
      return;
    }

    if (order[keyHistory[letter]] < order[result]) {
      keyHistory[letter] = result;
    }
  });

  wordless.store.setState({ ...wordless.store.getState(), keyHistory });

  return keyHistory;
};

/**
 * When guess submission is successful, clean the input buffer,
 * then render the feedback for each letter both in the board and the virtual keyboard,
 * finally if game is over, alert if player won or lost.
 */
const handleSubmitSuccess = (feedback) => {
  Input.clear();

  const previousGuess = Game.getCurrentGuessNumber() - 1;

  UI.renderLettersFeedback(previousGuess, feedback);

  const keyHistory = updateKeyHistory(feedback);

  UI.renderVirtualKeysFeedback(keyHistory);

  if (Game.isOver()) {
    UI.renderGameOverFeedback(previousGuess, Game.hasPlayerWon());

    // wait for animations to complete
    setTimeout(() => {
      if (Game.hasPlayerWon()) {
        alert("Congratulations! You win! 🥳");
      } else {
        alert("Game Over! You lose! 🥺");
      }
    }, 1000);
  }
};

/**
 * When submission results in an error and is related to the guess,
 * render the invalid guess feedback, otherwise alert for any other unhandled error.
 */
const handleSubmitError = (error) => {
  if (/guess/i.test(error.name)) {
    const currentGuess = Game.getCurrentGuessNumber();

    UI.renderInvalidGuessFeedback(currentGuess);

    return;
  }

  console.error(error);

  setTimeout(() => {
    alert(error.message);
  }, 500);
};

/**
 * Displays the letters as user is typing in the correct guess row.
 */
const handleOnInputChange = (value) => {
  if (Game.isOver()) return;

  const currentGuess = Game.getCurrentGuessNumber();

  UI.renderLetters(currentGuess, value.split(""));
};

/**
 * Submits the guess and handles success and error scenarios.
 */
const handleOnInputSubmit = async (value) => {
  if (Game.isOver() || !value || wordless.store.getState().loading) {
    return;
  }

  startLoading();

  try {
    const feedback = await Game.submitGuess(value);
    handleSubmitSuccess(feedback);
  } catch (error) {
    handleSubmitError(error);
  } finally {
    stopLoading();
  }
};

/**
 * Updates the store with loading state set to be true and shows the loading indicator.
 */
const startLoading = () => {
  wordless.store.setState({ ...wordless.store.getState(), loading: true });
  UI.startLoading();
};

/**
 * Updates the store with loading state set to be false and hides the loading indicator.
 */
const stopLoading = () => {
  wordless.store.setState({ ...wordless.store.getState(), loading: false });
  UI.stopLoading();
};

/**
 * Registers the event handlers for user input and initializes the game.
 */
const start = async () => {
  Input.init();

  document.addEventListener(INPUT_CHANGE_EVENT, (event) => {
    handleOnInputChange(event.detail);
  });

  document.addEventListener(INPUT_SUBMIT_EVENT, (event) => {
    handleOnInputSubmit(event.detail);
  });

  startLoading();

  try {
    await Game.init();
  } catch (e) {
    console.error(e);
  } finally {
    stopLoading();
  }
};

export default { start };
