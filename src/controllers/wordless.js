import Game from "../modules/game.js";
import Input, { INPUT_CHANGE_EVENT, INPUT_SUBMIT_EVENT } from "./input.js";
import UI from "./ui.js";

const updateKeyHistory = (feedback) => {
  const keyHistory = wordless.store.getState().keyHistory;
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

const handleSubmitError = (error) => {
  if (/guess/i.test(error.name)) {
    const currentGuess = Game.getCurrentGuessNumber();

    UI.renderGuessFeedback(currentGuess);

    return;
  }

  console.error(error);

  setTimeout(() => {
    alert(error.message);
  }, 500);
};

const handleOnInputChange = (value) => {
  if (Game.isOver()) return;

  const currentGuess = Game.getCurrentGuessNumber();

  UI.renderLetters(currentGuess, value.split(""));
};

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

const startLoading = () => {
  wordless.store.setState({ ...wordless.store.getState(), loading: true });
  UI.startLoading();
};

const stopLoading = () => {
  wordless.store.setState({ ...wordless.store.getState(), loading: false });
  UI.stopLoading();
};

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
