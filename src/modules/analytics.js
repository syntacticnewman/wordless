const CATEGORY = {
  GAME_PLAY: "game_play",
  ABOUT_GAME: "about_game",
};

const isUndefined = (val) => "undefined" === typeof val;

const track = (eventName, eventParams = {}) => {
  gtag("event", eventName, eventParams);
};

const getEventParams = ({ category, label, value } = {}) => {
  const params = {};

  if (!isUndefined(category)) {
    params.event_category = category;
  }

  if (!isUndefined(label)) {
    params.event_label = label;
  }

  if (!isUndefined(value)) {
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

const trackAboutDialog = (isOpen) => {
  track(
    "about_dialog",
    getEventParams({
      category: CATEGORY.ABOUT_GAME,
      label: "open",
      value: Number(isOpen),
    })
  );
};

export default { trackGuessSubmission, trackGameOver, trackAboutDialog };
