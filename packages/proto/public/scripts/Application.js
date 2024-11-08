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

//   <template>
//   <div class="application">
//     <h2>
//       <slot name="title">Software Engineer at Google</slot>
//     </h2>
//     <dl>
//       <dt>Company:</dt>
//       <dd><slot name="company">Google</slot></dd>
//       <dt>Location:</dt>
//       <dd><slot name="location">Mountain View, CA</slot></dd>
//       <dt>Posted Date:</dt>
//       <dd><slot name="posted-date">Sept 1, 2024</slot></dd>
//       <dt>Applied Date:</dt>
//       <dd><slot name="applied-date">Sept 10, 2024</slot></dd>
//       <dt>Status:</dt>
//       <dd><slot name="status">Interview Scheduled</slot></dd>
//       <dt>Additional Info:</dt>
//       <dd><slot name="notes">Interview on Sept 25, 2024.</slot></dd>
//     </dl>
//   </div>
// </template>

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

    constructor(){
        super();
        shadow(this)
            .template(ApplicationElement.template)
            .styles(reset.styles, ApplicationElement.styles);
    }
}