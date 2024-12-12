// src/views/application-add-view.ts
import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";
import { Company } from "../model";

export class ApplicationAddViewElement extends View<Model, Msg> {
    @state()
    companyName: string = "";
    @state()
    companyCity: string = "";
    @state()
    companyState: string = "";
    @state()
    companyStreetAddress: string = "";
    @state()
    applicationTitle: string = "";
    @state()
    applicationDescription: string = "";
    @state()
    appAppliedDate: Date = new Date(); // Default to current date
    @state()
    appStatus: string = "Pending"; // Default status
    @state()
    appMethod: string = "Online"; // Default method
    @state()
    appNotes: string = ""; // Default method
  
  constructor() {
    super("apptrak:model");
  }

  handleAddApplication() {
    // Create the company object based on the user input
    const newCompany: Company = {
      name: this.companyName,
      items: [], // Assuming no items initially, or you could extend this to allow input for items
      city: this.companyCity,
      state: this.companyState,
      streetAddress: this.companyStreetAddress,
    };

    // Dispatch an action to add a new application with the updated model
    this.dispatchMessage([
      "applications/add", 
      {
        title: this.applicationTitle,
        company: newCompany,
        appliedDate: this.appAppliedDate,
        status: this.appStatus,
        method: this.appMethod,
        notes: this.appNotes
      }
    ]);
  }

  render() {
    return html`
      <main>
        <section class="add-application-section">
          <h2>Add a New Application</h2>
          <input
            type="text"
            placeholder="Enter application title"
            .value="${this.applicationTitle}"
            @input="${(e: Event) => (this.applicationTitle = (e.target as HTMLInputElement).value)}"
          />
          <input
            type="text"
            placeholder="Enter company name"
            .value="${this.companyName}"
            @input="${(e: Event) => (this.companyName = (e.target as HTMLInputElement).value)}"
          />
          <button @click="${this.handleAddApplication}">Add Application</button>
        </section>
      </main>
    `;
  }

  static styles = css`
    /* Add styles for the form */
    input {
      margin: 10px 0;
      padding: 10px;
      width: 100%;
      max-width: 400px;
    }
    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      margin-top: 10px;
    }
  `;
}

define({ "application-add-view": ApplicationAddViewElement });
