import {define, Form, InputArray, html, css, shadow} from "@calpoly/mustang";

export class ApplicationCard extends HTMLElement {
    static uses = define({
        "mu-form": Form.Element,
        "input-array": InputArray.Element
    });

    get src() {
        return this.getAttribute("src");
    }

    static template = html`
        <template>
            <div class="container">
                <div class="application-header">
                    <h1>
                        <slot name="title">Application Title</slot>
                    </h1>
                    <div class="details">
                        <span><slot name="applicationName">Application Name</slot></span>
                        <span><slot name="status">Status</slot></span>
                        <span><slot name="appliedDate">Applied Date</slot></span>
                    </div>
                </div>

                <div class="application-body">
                    <div class="application-details">
                        <h2>Application Details</h2>
                        <p><strong>Address:</strong> <slot name="address">Street Address</slot></p>
                        <p><strong>City:</strong> <slot name="city">City</slot></p>
                        <p><strong>State:</strong> <slot name="state">State</slot></p>
                    </div>

                    <div class="items">
                        <h2>Items</h2>
                        <ul>
                            <slot name="items">
                                <li>Example Item</li>
                            </slot>
                        </ul>
                    </div>
                </div>

                <div class="application-notes">
                    <h3>Notes</h3>
                    <p>
                        <slot name="notes">Add any notes here.</slot>
                    </p>
                </div>
            </div>
        </template>`;

    static styles = css`
      :host {
        display: contents;
        margin-bottom: 20px;
      }
      :host([mode="edit"]) {
        --display-view-none: none;
        --display-editor-none: block;
      }
      :host([mode="view"]) {
        --display-view-none: block;
        --display-editor-none: none;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 8px;
      }

      .application-header {
        text-align: center;
        margin-bottom: 20px;
        color: var(--color-text);
      }

      .details {
        display: flex;
        justify-content: center;
        gap: 20px;
        color: var(--color-text);
      }

      .application-body {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        margin-bottom: 20px;
      }

      .application-details, .items {
        width: 45%;
        color: var(--color-text);
      }

      .items ul {
        list-style-position: inside;
        line-height: 1.6;
        color: var(--color-text);
      }

      .application-notes {
        margin-top: 20px;
        padding-left: 20px;
        border: 2px solid;
        color: var(--color-text);
      }
    `;

    constructor() {
        super();
        shadow(this)
            .template(ApplicationCard.template)
            .styles(ApplicationCard.styles);
        this.setAttribute("mode", "view");
        this.addEventListener("mu-form:submit", (event) =>
            this.submit(this.src, event.detail)
        );
        this.editButton.addEventListener("click", () => {
            this.mode = this.mode === "edit" ? "view" : "edit";
        });
    }

    connectedCallback() {
        if (this.src) this.hydrate(this.src);
    }

    get form() {
        return this.shadowRoot.querySelector("mu-form.edit");
    }
    get editButton() {
        return this.shadowRoot.getElementById("edit");
    }

    get mode() {
        return this.getAttribute("mode");
    }

    set mode(m) {
        this.setAttribute("mode", m);
    }

    hydrate(url) {
        fetch(url)
            .then((res) => {
                if (res.status !== 200) throw `Status: ${res.status}`;
                return res.json();
            })
            .then((json) => {
                this.renderSlots(json);
                this.form.init = json;
            })
            .catch((error) =>
                console.log(`Failed to render data ${url}:`, error)
            );
    }

    submit(url, json) {
        fetch(url, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(json)
        })
            .then((res) => res.json())
            .then((json) => {
                this.renderSlots(json);
                this.form.init = json;
                this.mode = "view";
            })
            .catch((error) => console.log("Failed to submit data:", error));
    }

    renderSlots(json) {
        const entries = Object.entries(json);

        const toSlot = ([key, value]) => {
            if (Array.isArray(value)) {
                const listElement = document.createElement("ul");
                value.forEach((item) => {
                    const listItem = document.createElement("li");

                    if (typeof item === "object" && item !== null) {
                        listItem.textContent = `${item.name} - $${item.price}`;
                    } else {
                        listItem.textContent = item;
                    }
                    listElement.appendChild(listItem);
                });
                listElement.setAttribute("slot", key);
                return listElement;
            }

            const spanElement = document.createElement("span");
            spanElement.textContent = String(value);
            spanElement.setAttribute("slot", key);
            return spanElement;
        };

        const fragment = document.createDocumentFragment();
        entries.map(toSlot).forEach((el) => fragment.appendChild(el));

        this.replaceChildren(fragment);
    }
}

customElements.define('application-card', ApplicationCard);
