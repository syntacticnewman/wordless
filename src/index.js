import Store from "./services/store.js";
import VirtualKeyboard from "./components/virtual-keyboard.js";
import Wordless from "./controllers/wordless.js";

window.wordless = {
  store: Store,
  async start() {
    // register virtual keyboard component
    customElements.define("virtual-keyboard", VirtualKeyboard);
    // initialize store
    wordless.store.init({ keyHistory: {}, loading: false });
    // start the game
    await Wordless.start();
  },
};

document.addEventListener("DOMContentLoaded", () => wordless.start());
