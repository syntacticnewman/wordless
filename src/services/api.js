const API_URL = "https://words.dev-apis.com";

const apiEndpoint = (path) => `${API_URL}/${path}`;

const fetchWordOfTheDay = async () => {
  const response = await fetch(apiEndpoint("word-of-the-day"));
  const { word } = await response.json();

  return word;
};

const validateWord = async (word) => {
  const response = await fetch(apiEndpoint("validate-word"), {
    method: "POST",
    body: JSON.stringify({ word }),
  });

  const { validWord } = await response.json();

  return validWord;
};

export default {
  fetchWordOfTheDay,
  validateWord,
};
