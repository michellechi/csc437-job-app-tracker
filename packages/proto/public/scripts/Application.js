import { css, html, shadow } from "@calpoly/mustang";

export class ApplicationElement extends HTMLElement {
    static template = html`
        <template>
            
        </template>
    `;

    static styles = css``;

    constructor(){
        super();
        shadow(this)
            .template(ApplicationElement.template)
            .styles(ApplicationElement.styles);
    }
}