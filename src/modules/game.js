import API from "../services/api.js";
import {
  GameOverError,
  GuessInvalidError,
  GuessLengthError,
} from "./game-errors.js";

const REQUIRED_GUESS_LENGTH = 5;
const MAX_NUMBER_OF_GUESSES = 6;

let $secretWord = "";

let numberOfGuesses = 0;
let gameOver = false;
let win = false;

const getState = () => ({
  numberOfGuesses,
  gameOver,
  win,
});

const getCurrentGuessNumber = () => getState().numberOfGuesses;

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
  if (numberOfGuesses < MAX_NUMBER_OF_GUESSES) {
    numberOfGuesses++;

    if (isSecretWord(guess)) {
      gameOver = true;
      win = true;
      return;
    }

    if (numberOfGuesses === MAX_NUMBER_OF_GUESSES) {
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

  // feedback for letters in the correct position
  for (let i = 0; i < guess.length; i++) {
    if (isEqualString(guess.charAt(i), $secretWord.charAt(i))) {
      feedback.push({ letter: guess.charAt(i), result: "correct" });
      removeSecretLetter(guess.charAt(i));
    } else {
      feedback.push({ letter: guess.charAt(i), result: "incorrect" });
    }
  }

  // feedback for letters in the wrong position
  for (let i = 0; i < guess.length; i++) {
    // ignore current letter if is already correct
    if ("correct" == feedback[i].result) continue;

    if (secretLetters.includes(guess.charAt(i))) {
      feedback[i].result = "wrong";
      removeSecretLetter(guess.charAt(i));
    }
  }

  return feedback;
};

const submitGuess = async (guess) => {
  await validateGuess(guess);

  processGuess(guess);

  return provideFeedback(guess);
};

const init = async () => {
  $secretWord = await API.fetchWordOfTheDay();
};

export default {
  getCurrentGuessNumber,
  getState,
  hasPlayerWon,
  init,
  isOver,
  submitGuess,
};
