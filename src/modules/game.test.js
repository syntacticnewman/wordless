import API from "../services/api.js";
import Game from "./game.js";

const $fakeSecretWord = "music";

QUnit.module("GameModule", (hooks) => {
  const originalFetchWordOfTheDay = API.fetchWordOfTheDay;
  const originalValidateWord = API.validateWord;

  const mockFetchWordOfTheDay = async () => {
    mockFetchWordOfTheDay.called = true;
    return $fakeSecretWord;
  };

  const mockValidateWord = async () => {
    mockValidateWord.called = true;
    return true;
  };

  hooks.beforeEach(() => {
    mockFetchWordOfTheDay.called = false;
    mockValidateWord.called = false;
    API.fetchWordOfTheDay = mockFetchWordOfTheDay;
    API.validateWord = mockValidateWord;
  });

  hooks.afterEach(() => {
    API.fetchWordOfTheDay = originalFetchWordOfTheDay;
    API.validateWord = originalValidateWord;
  });

  QUnit.module("init()", () => {
    QUnit.test("calls the API to fetch the word of the day", async (assert) => {
      await Game.init();

      assert.true(API.fetchWordOfTheDay.called);
    });
  });

  QUnit.module("getState()", () => {
    QUnit.test("returns the game initial state", (assert) => {
      assert.deepEqual(Game.getState(), {
        gameOver: false,
        numberOfGuesses: 0,
        win: false,
      });
    });
  });

  QUnit.module("hasPlayerWon()", () => {
    QUnit.test("returns false when the game starts", (assert) => {
      assert.false(Game.hasPlayerWon());
    });
  });

  QUnit.module("getCurrentGuessNumber()", () => {
    QUnit.test("returns 0 when the game starts", (assert) => {
      assert.equal(Game.getCurrentGuessNumber(), 0);
    });
  });

  QUnit.module("isOver()", () => {
    QUnit.test("returns false when the game starts", (assert) => {
      assert.false(Game.isOver());
    });
  });

  QUnit.module("submitGuess()", (hooks) => {
    hooks.beforeEach(async () => {
      await Game.init();
    });

    hooks.afterEach(() => {
      Game.__reset__();
    });

    QUnit.test("calls the API to validate word", async (assert) => {
      const guess = "silly";

      await Game.submitGuess(guess);

      assert.true(API.validateWord.called);
    });

    QUnit.test(
      "throws error if guess is not five characters",
      async (assert) => {
        assert.rejects(Game.submitGuess("abc"), /GuessLengthError/);
      }
    );

    QUnit.test("throws error if guess is not a valid word", async (assert) => {
      API.validateWord = async () => false;

      assert.rejects(Game.submitGuess("abcde"), /GuessInvalidError/);

      API.validateWord = mockValidateWord;
    });

    QUnit.test("returns feedback", async (assert) => {
      const guess = "punch";

      const feedback = await Game.submitGuess(guess);

      assert.deepEqual(feedback, [
        { letter: "p", result: "incorrect" },
        { letter: "u", result: "correct" },
        { letter: "n", result: "incorrect" },
        { letter: "c", result: "wrong" },
        { letter: "h", result: "incorrect" },
      ]);
    });

    QUnit.test("increments the guess number on each guess", async (assert) => {
      assert.equal(Game.getCurrentGuessNumber(), 0);
      await Game.submitGuess("silly");
      assert.equal(Game.getCurrentGuessNumber(), 1);
      await Game.submitGuess("silly");
      assert.equal(Game.getCurrentGuessNumber(), 2);
      await Game.submitGuess("silly");
      assert.equal(Game.getCurrentGuessNumber(), 3);
      await Game.submitGuess("silly");
      assert.equal(Game.getCurrentGuessNumber(), 4);
      await Game.submitGuess("silly");
      assert.equal(Game.getCurrentGuessNumber(), 5);
      await Game.submitGuess("silly");
      assert.equal(Game.getCurrentGuessNumber(), 6);
    });

    QUnit.test("ends game as lost", async (assert) => {
      assert.false(Game.isOver());
      assert.false(Game.hasPlayerWon());

      // player attempts 6 guesses
      await Game.submitGuess("silly");
      await Game.submitGuess("silly");
      await Game.submitGuess("silly");
      await Game.submitGuess("silly");
      await Game.submitGuess("silly");
      await Game.submitGuess("silly");

      assert.true(Game.isOver());
      assert.false(Game.hasPlayerWon());
    });

    QUnit.test("ends game as won", async (assert) => {
      assert.false(Game.isOver());
      assert.false(Game.hasPlayerWon());

      // player guesses on the 3rd try
      await Game.submitGuess("silly");
      await Game.submitGuess("daily");
      await Game.submitGuess("music");

      assert.true(Game.isOver());
      assert.true(Game.hasPlayerWon());
    });

    QUnit.test(
      "throws error after submission when game is over",
      async (assert) => {
        await Game.submitGuess("silly"); // attempt 1
        await Game.submitGuess("silly"); // attempt 2
        await Game.submitGuess("silly"); // attempt 3
        await Game.submitGuess("silly"); // attempt 4
        await Game.submitGuess("silly"); // attempt 5
        await Game.submitGuess("silly"); // attempt 6

        assert.rejects(
          Game.submitGuess("silly") /* attempt 7 */,
          /GameOverError/
        );
      }
    );
  });
});
