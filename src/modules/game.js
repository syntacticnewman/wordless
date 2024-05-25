import API from "../services/api.js";
import {
  GameOverError,
  GuessInvalidError,
  GuessLengthError,
} from "./game-errors.js";

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

const getCurrentGuessNumber = () => getState().guesses;

const isOver = () => getState().gameOver;

const hasPlayerWon = () => getState().win;

const isEqualString = (a, b) =>
  String(a).toLowerCase() === String(b).toLowerCase();

const isSecretWord = (guess) => isEqualString(guess, $secretWord);

const validateGuess = async (guess) => {
  if (gameOver) {
    throw new GameOverError();
  }

  if (guess.length < REQUIRED_GUESS_LENGTH) {
    throw new GuessLengthError(REQUIRED_GUESS_LENGTH);
  }

  const isValid = await API.validateWord(guess);

  if (!isValid) {
    throw new GuessInvalidError(guess);
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

const provideFeedback = (guess) => {
  const feedback = [];
  const secretLetters = $secretWord.toLowerCase().split("");

  const removeSecretLetter = (letter) => {
    secretLetters.splice(secretLetters.indexOf(letter), 1);
  };

  for (let i = 0; i < guess.length; i++) {
    const currentLetter = guess.charAt(i);

    // letter is in the correct position
    if (isEqualString(currentLetter, $secretWord.charAt(i))) {
      feedback.push("correct");
      removeSecretLetter(currentLetter);
      continue;
    }

    // letter is present but in the wrong position
    if (secretLetters.includes(currentLetter)) {
      feedback.push("wrong");
      removeSecretLetter(currentLetter);
      continue;
    }

    // letter is not in the word at all
    feedback.push("incorrect");
  }

  return feedback;
};

const submitGuess = async (guess, { onSuccess, onError }) => {
  try {
    await validateGuess(guess);
    processGuess(guess);
    onSuccess(provideFeedback(guess));
  } catch (error) {
    onError(error);
  }
};

const init = async ({ onInit }) => {
  $secretWord = await API.fetchWordOfTheDay();
  onInit();
};

export default {
  getCurrentGuessNumber,
  getState,
  hasPlayerWon,
  init,
  isOver,
  submitGuess,
};
