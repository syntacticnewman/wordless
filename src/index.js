import Store from "./services/store.js";
import UI from "./ui/index.js";
import Wordless from "./controllers/wordless.js";

window.wordless = { store: Store };

document.addEventListener("DOMContentLoaded", async () => {
  // load UI components
  UI.init();

  // initialize store
  Store.init({ keyHistory: {}, loading: false });

  // start the game
  await Wordless.start();
});
