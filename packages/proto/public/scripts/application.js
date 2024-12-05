import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class ApplicationElement extends HTMLElement {
    static template = html`
        <template>
            <div class="application">
                <h1><slot name="title">Software Engineer</slot></h1>
                <p>Company:
                    <slot name="company">Google</slot>
                </p>
                <p>Location:
                    <slot name="location">Mountain View, CA</slot>
                </p>
                <p>Status:
                    <slot name="status">Interview Scheduled</slot>
                </p>
            </div>
        </template>
    `;

    static styles = css`
        * {
            color: var(--color-text);
            font-family: Afacad Flux, Manrope, sans-serif;
            font-size: var(--font-size-base);
        }

        .application {
            margin-bottom: 20px; 
            display: block;
        }

        .application h1 {
            font-weight: bold;
        }

        .application p {
            color: var(--color-text);
            padding-left: 10px; 
        }
    `;

    constructor() {
        super();
        shadow(this)
            .template(ApplicationElement.template)
            .styles(reset.styles, ApplicationElement.styles);
    }

    get src() {
        return this.getAttribute('src');
    }

    connectedCallback() {
        if (this.src) this.hydrate(this.src);
    }

    hydrate(url) {
        fetch(url)
            .then((res) => {
                if (res.status !== 200) throw `Status: ${res.status}`;
                return res.json();
        })
        .then((json) => this.renderSlots(json))
        .catch((error) =>
            console.log(`Failed to render data ${url}:`, error)
        );
    }

    renderSlots(json) {
        const entries = Object.entries(json);
        const toSlot = ([key, value]) =>
          html`<span slot="${key}">${value}</span>`
      
        const fragment = entries.map(toSlot);
        this.replaceChildren(...fragment);
    }
}