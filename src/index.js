import Store from "./services/store.js";
import Wordless from "./controllers/wordless.js";

window.wordless = {
  store: Store,
  async start() {
    wordless.store.init({ loading: false });
    await Wordless.start();
  },
};

document.addEventListener("DOMContentLoaded", () => wordless.start());
