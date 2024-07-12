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
      category: "gameplay",
      label: guessValue,
      value: guessNumber,
    })
  );

export default { trackGuessSubmission };
