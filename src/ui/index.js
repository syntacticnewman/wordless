import GA from "../services/analytics.js";
import { loadCustomComponents } from "./components/index.js";
import { initAboutModal } from "./modals.js";

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
