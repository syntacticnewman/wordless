import Game from "../modules/game.js";
import Keyboard from "../modules/keyboard.js";

const handleOnBufferChange = (buffer) => {
  console.log("Keyboard.buffer->", buffer.getValue());
  // TODO: render buffer in UI
};

const handleOnEnter = async (buffer) => {
  console.log("Keyboard.Enter->", buffer.getValue());

  await Game.submitGuess(buffer.getValue(), {
    onSuccess() {
      // clean up
      buffer.flush();
      // TODO: if game is over and player wins show feedback
      // TODO: else move to next guess row
    },
    onError(error) {
      // TODO: show feedback for error
      console.error(error);
    },
  });

  console.log("Game.state->", Game.getState());
};

const onGameInit = async () => {
  console.log("Game.state->", Game.getState());

  Keyboard.init({
    onBufferChange: handleOnBufferChange,
    onEnter: handleOnEnter,
  });
};

export const gameStart = () => {
  Game.init({ onInit: onGameInit });
};
