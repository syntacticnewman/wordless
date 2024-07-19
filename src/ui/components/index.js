import VirtualKeyboard from "./virtual-keyboard/index.js";

export const loadCustomComponents = () => {
  // define <virtual-keyboard> component
  customElements.define("virtual-keyboard", VirtualKeyboard);
};
