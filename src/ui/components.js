import VirtualKeyboard from "../components/virtual-keyboard.js";

export const loadCustomComponents = () => {
  // define <virtual-keyboard> component
  customElements.define("virtual-keyboard", VirtualKeyboard);
};
