export class GameOverError extends Error {
  constructor() {
    super("Game Over!");

    this.name = "GameOverError";
  }
}

export class GuessLengthError extends Error {
  constructor(requiredLength) {
    super(`Guess must be ${requiredLength} letters.`);

    this.name = "GuessLengthError";
  }
}

export class GuessInvalidError extends Error {
  constructor(guess) {
    super(`Guess '${guess}' is not in the word list.`);

    this.name = "GuessInvalidError";
  }
}
