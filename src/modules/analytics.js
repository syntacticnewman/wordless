const CATEGORY = {
  GAME_PLAY: "gameplay",
};

const track = (eventName, params = {}) => {
  gtag("event", eventName, params);
};

const getEventParams = ({ category, label, value } = {}) => {
  const params = {};

  if (category) {
    params.event_category = category;
  }

  if (label) {
    params.event_label = label;
  }

  if (value) {
    params.value = value;
  }

  return params;
};

const trackGuessSubmission = (guessValue, guessNumber) =>
  track(
    "guess_submission",
    getEventParams({
      category: CATEGORY.GAME_PLAY,
      label: guessValue,
      value: guessNumber,
    })
  );

const trackGameOver = (isAWin, numberOfTries) => {
  track(
    "game_over",
    getEventParams({
      category: CATEGORY.GAME_PLAY,
      label: isAWin ? "win" : "lose",
      value: numberOfTries,
    })
  );
};

export default { trackGuessSubmission, trackGameOver };
