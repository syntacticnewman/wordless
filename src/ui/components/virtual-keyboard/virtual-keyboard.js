import { LAYOUT, defaultLanguage } from "./i18n.js";
import { createVirtualKeyboard, addKeyboardNavigation } from "./utils.js";

class VirtualKeyboard extends HTMLElement {
  constructor() {
    super();

    this.layout = this.getLayout(document.documentElement.lang);

    // setting `delegatesFocus` to true fixes issue with Firefox
    // to remove the focus when `document.activeElement.blur()` is called.
    this.root = this.attachShadow({ mode: "open", delegatesFocus: true });

    this.loadCSS("src/ui/components/virtual-keyboard/styles.css");
  }

  connectedCallback() {
    this.root.appendChild(createVirtualKeyboard(this.layout));
    addKeyboardNavigation(this.root);
  }

  getLayout(language) {
    // use the language provided or the default language (English) as a fallback to choose the correct layout.
    return LAYOUT[language] ?? LAYOUT[defaultLanguage];
  }

  loadCSS(url) {
    const stylesLink = document.createElement("link");

    stylesLink.setAttribute("rel", "stylesheet");
    stylesLink.setAttribute("href", url);

    this.root.appendChild(stylesLink);
  }
}

export default VirtualKeyboard;
