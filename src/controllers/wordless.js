import Game from "../modules/game.js";
import Keyboard from "../modules/keyboard.js";
import UI from "../modules/ui.js";

const handleSubmitSuccess = (buffer, feedback) => {
  buffer.flush();

  const previousGuess = Game.getCurrentGuessNumber() - 1;

  UI.renderLettersFeedback(previousGuess, feedback);

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

const handleOnBufferChange = (buffer) => {
  if (Game.isOver()) return;

  const currentGuess = Game.getCurrentGuessNumber();

  UI.renderLetters(currentGuess, buffer.toArray());
};

const handleOnEnter = async (buffer) => {
  if (Game.isOver()) return;

  startLoading();

  try {
    const feedback = await Game.submitGuess(buffer.getValue());
    handleSubmitSuccess(buffer, feedback);
  } catch (error) {
    handleSubmitError(error);
  } finally {
    stopLoading();
  }
};

const startLoading = () => {
  wordless.store.setState({ loading: true });
  UI.startLoading();
};

const stopLoading = () => {
  wordless.store.setState({ loading: false });
  UI.stopLoading();
};

const start = async () => {
  startLoading();

  try {
    await Game.init();

    Keyboard.init({
      onBufferChange: (buffer) => handleOnBufferChange(buffer),
      onEnter: (buffer) => handleOnEnter(buffer),
    });
  } catch (e) {
    console.error(e);
  } finally {
    stopLoading();
  }
};

export default { start };
