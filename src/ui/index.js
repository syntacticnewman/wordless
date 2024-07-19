import { loadCustomComponents } from "./components/index.js";
import { initModals } from "./modals/index.js";

const init = () => {
  initModals();
  loadCustomComponents();
};

export default { init };
