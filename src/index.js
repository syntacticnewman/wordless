import Game from "./game.js";

document.addEventListener("DOMContentLoaded", async () => {
  await Game.init();

  await Game.submitGuess("smart");

  console.log(Game.getState());
});
