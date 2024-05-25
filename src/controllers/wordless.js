import Game from "../modules/game.js";
import Keyboard from "../modules/keyboard.js";
import UI from "../modules/ui.js";

const handleOnSubmitSuccess = (buffer, feedback) => {
  buffer.flush();

  const previousGuess = Game.getCurrentGuessNumber() - 1;

  UI.renderLettersFeedback(previousGuess, feedback);

  if (Game.isOver()) {
    setTimeout(() => {
      if (Game.hasPlayerWon()) {
        alert("Congratulations! You won! 🥳");
      } else {
        alert("Game Over! You loose! 🥺");
      }
    }, 500);
  }
};

const handleOnSubmitError = (error) => {
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

  await Game.submitGuess(buffer.getValue(), {
    onSuccess: (feedback) => handleOnSubmitSuccess(buffer, feedback),
    onError: (error) => handleOnSubmitError(error),
  });
};

const onInit = () => {
  Keyboard.init({
    onBufferChange: (buffer) => handleOnBufferChange(buffer),
    onEnter: (buffer) => handleOnEnter(buffer),
  });
};

export const gameStart = () => Game.init({ onInit });
