// src/pages/recipe.ts
import renderPage from "./renderPage";
// @ts-ignore
import { css, html } from "@calpoly/mustang/server";
import { Application } from "../models/application";

export class ApplicationPage {
    data: Application;

    constructor(data: Application) {
        this.data = data;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["/styles/application_layout.css"],
            scripts: [
                `import { define } from "@calpoly/mustang";
                 import { ApplicationCard } from "/scripts/application-card.js";

                 define({
                   "application-card": ApplicationCard
                 });`
            ]
        });
    }

    renderBody() {
        const { id, title, company, appliedDate, status, method, notes } = this.data;

        return html`
            <body>
                <main class="application-page">
                    <application-card
                        src="/api/applications/${this.data.id}"
                        mode="view">
                    </application-card>
                </main>
            </body>
        `;
    }
}
