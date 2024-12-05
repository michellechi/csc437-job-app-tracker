import { css, html, shadow, Events } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import headings from "./styles/headings.css.js";

export class RegistrationForm extends HTMLElement {
    static template = html`<template>
    <form>
      <slot name="title">
        <h3>Sign up to create a Username and Password</h3>
      </slot>
      <label>
        <span>
          <slot name="username">Username</slot>
        </span>
        <input name="username" autocomplete="off" />
      </label>
      <label>
        <span>
          <slot name="password">Password</slot>
        </span>
        <input type="password" name="password" />
      </label>
      <slot name="submit">
        <button type="submit">Sign Up</button>
      </slot>
    </form>
  </template>`;

    static styles = css`
    :host {
      display: block;
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      font-family: 'Arial', sans-serif;
    }

    form {
      display: grid;
      grid-column: 1/-1;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    label span {
      font-weight: bold;
      font-size: 1.1em;
      color: #333;
    }

    input {
      padding: 10px;
      font-size: 1em;
      border: 1px solid #ccc;
      border-radius: 5px;
      transition: all 0.3s ease;
    }

    input:focus {
      border-color: #0056b3;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 86, 179, 0.5);
    }

    ::slotted(*[slot="title"]),
    slot[name="title"] > * {
      text-align: center;
      font-size: 1.5em;
      font-weight: bold;
      color: #0056b3;
      grid-column: 1/-1;
    }

    button[type="submit"] {
      padding: 12px 20px;
      background-color: #0056b3;
      color: white;
      font-size: 1.2em;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      grid-column: 1/-1;
    }

    button[type="submit"]:hover {
      background-color: #004494;
    }

    button[type="submit"]:active {
      background-color: #003e7a;
    }

    ::slotted(button[slot="submit"]),
    button[type="submit"] {
      grid-column: 1/-1;
      justify-self: center;
    }
  `;

    get form() {
        return this.shadowRoot.querySelector("form");
    }

    constructor() {
        super();

        shadow(this)
            .template(RegistrationForm.template)
            .styles(
                reset.styles,
                headings.styles,
                RegistrationForm.styles
            );

        this.form.addEventListener("submit", (event) =>
            submitRegistrationForm(
                event,
                this.getAttribute("api"),
                this.getAttribute("redirect") || "/"
            )
        );
    }
}

function submitRegistrationForm(event, endpoint, redirect) {
    event.preventDefault();

    const form = event.target.closest("form");
    const data = new FormData(form);
    const method = "POST";
    const headers = {
        "Content-Type": "application/json"
    };
    const body = JSON.stringify(Object.fromEntries(data));

    console.log("POST new user request:", body);

    fetch(endpoint, { method, headers, body })
        .then((res) => {
            if (res.status !== 201)
                throw `Form submission failed: Status ${res.status}`;
            return res.json();
        })
        .then((payload) => {
            const { token } = payload;

            Events.dispatch;
            form.dispatchEvent(
                new CustomEvent("auth:message", {
                    bubbles: true,
                    composed: true,
                    detail: ["auth/signin", { token, redirect }]
                })
            );
        })
        .catch((err) => console.log("Error submitting form:", err));
}
