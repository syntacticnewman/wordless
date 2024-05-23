import API from "./services/api.js";

const REQUIRED_WORD_LENGTH = 5;

let wordOfTheDay = "";
let status = "idle";
let guesses = 0;
let currentGuess = "";
let isValidWord = false;
let gameIsOver = false;
let isWordOfTheDay = false;

const getState = () => {
  return {
    status,
    guesses,
    currentGuess,
    isValidWord,
    gameIsOver,
    isWordOfTheDay,
  };
};

const handleStatus = async (action) => {
  status = "loading";

  try {
    await action();
    status = "ready";
  } catch (e) {
    status = "error";
  }
};

const init = async () => {
  await handleStatus(async () => {
    wordOfTheDay = await API.fetchWordOfTheDay();
  });
};

const validateWord = async (word) => {
  if (word.length < REQUIRED_WORD_LENGTH) {
    return false;
  }

  let isValid = false;

  await handleStatus(async () => {
    isValid = await API.validateWord(word);
  });

  return isValid;
};

const submitGuess = async (guess) => {
  // TODO: if game is over, do nothing

  currentGuess = guess;

  isValidWord = await validateWord(guess);

  if (isValidWord) {
    // TODO: compare current guess with the word of the day
    // - if current guess is equal to the word of the day, then the game is over and the player wins
    // - else
    //   - if no more guesses, then the game is over and the player looses
    //   - else increment the number of guesses by one and reset the current guess
  }
};

export default { getState, init, submitGuess };
