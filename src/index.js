import Wordless from "./controllers/wordless.js";
import Store from "./services/store.js";

window.wordless = {
  store: Store,
  async start() {
    // initialize store
    wordless.store.init({ keyHistory: {}, loading: false });
    // start the game
    await Wordless.start();
  },
};

document.addEventListener("DOMContentLoaded", wordless.start);
