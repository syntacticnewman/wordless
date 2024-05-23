import Game from "../modules/game.js";
import Keyboard from "../modules/keyboard.js";
import UI from "../modules/ui.js";

const handleOnBufferChange = (buffer) => {
  if (Game.isOver()) return;

  const index = Game.getCurrentGuessNumber();
  const currentRow = UI.queryRow(index);

  UI.renderLetters(currentRow, buffer.toArray());
};

const handleOnEnter = async (buffer) => {
  if (Game.isOver()) return;

  await Game.submitGuess(buffer.getValue(), {
    onSuccess() {
      buffer.flush();

      if (Game.isOver()) {
        if (Game.hasPlayerWon()) {
          alert("Congratulations! You won! 🥳");
        } else {
          alert("Game Over! You loose! 🥺");
        }
      }
    },
    onError(error) {
      alert(error.message);
      console.error(error);
    },
  });
};

const onGameInit = async () => {
  Keyboard.init({
    onBufferChange: handleOnBufferChange,
    onEnter: handleOnEnter,
  });
};

export const gameStart = () => {
  Game.init({ onInit: onGameInit });
};
