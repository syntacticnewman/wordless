import API from "../services/api.js";

const REQUIRED_GUESS_LENGTH = 5;
const MAX_GUESSES = 6;

let $secretWord = "";

let guesses = 0;
let gameOver = false;
let win = false;

const getState = () => ({
  guesses,
  gameOver,
  win,
});

const isSecretWord = (guess) =>
  String(guess).toLowerCase() === String($secretWord).toLowerCase();

const validateGuess = async (guess) => {
  if (gameOver) {
    throw new Error("Game Over!");
  }

  if (guess.length < REQUIRED_GUESS_LENGTH) {
    throw new Error(`Word must be ${REQUIRED_GUESS_LENGTH} letters.`);
  }

  const isValid = await API.validateWord(guess);

  if (!isValid) {
    throw new Error(`Word '${guess}' is not in the word list.`);
  }
};

const processGuess = (guess) => {
  if (guesses < MAX_GUESSES) {
    guesses++;

    if (isSecretWord(guess)) {
      gameOver = true;
      win = true;
      return;
    }

    if (guesses === MAX_GUESSES) {
      gameOver = true;
    }
  }
};

const submitGuess = async (guess, { onSuccess, onError }) => {
  try {
    await validateGuess(guess);
    processGuess(guess);
    onSuccess();
  } catch (error) {
    onError(error);
  }
};

const init = async ({ onInit }) => {
  $secretWord = await API.fetchWordOfTheDay();
  onInit();
};

export default { getState, submitGuess, init };
