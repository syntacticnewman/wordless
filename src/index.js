import Wordless from "./controllers/wordless.js";
import GA from "./modules/analytics.js";
import UI from "./modules/ui.js";
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

document.addEventListener("DOMContentLoaded", () => {
  // load UI components
  UI.init(GA);
  // start wordless
  wordless.start();
});
