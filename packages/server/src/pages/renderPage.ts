import {
    PageParts,
    renderWithDefaults
  } from "@calpoly/mustang/server";
  
const defaults = {
    stylesheets: [
      "/styles/reset.css",
      "/styles/tokens.css",
      "/styles/page.css"
    ],
    styles: [],
    scripts: [
      `import { define } from "@calpoly/mustang";
      import { ApplicationElement } from "/scripts/application.js";
  
      define({
        "application-element": ApplicationElement
      });
      `
    ],
    googleFontURL:
      "https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&display=swap",
    imports: {
      "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
    }
};
  
export default function renderPage(page: PageParts) {
    return renderWithDefaults(page, defaults);
  }