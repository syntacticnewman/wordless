import GA from "../services/analytics.js";
import { initAboutModal } from "./modals.js";
import { loadCustomComponents } from "./components.js";

const init = () => {
  // initialize modals
  initAboutModal({
    onShow: () => GA.trackAboutDialog(true),
    onClose: () => GA.trackAboutDialog(false),
  });

  // load custom components
  loadCustomComponents();
};

export default { init };
