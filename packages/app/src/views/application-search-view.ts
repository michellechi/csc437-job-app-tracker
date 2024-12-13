import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";

export class ApplicationSearchViewElement extends View<Model, Msg> {
  @state()
  searchQuery: string = "";

  @state()
  showModal: boolean = false; 
  @state()
  applicationTitle: string = "";
  @state()
  applicationAppliedDate: string = "";
  @state()
  applicationStatus: string = "";
  @state()
  applicationMethod: string = "";
  @state()
  applicationNotes: string = "";
  @state()
  companyName: string = "";
  @state()
  companyCity: string = "";
  @state()
  companyState: string = ""; 
  @state()
  companyStreetAddress: string = ""; 
  @state()
  successMessage: string = ""; 
  @state()
  errorMessage: string = "";

  constructor() {
    super("apptrak:model");
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("Component connected. Loading all applications...");
    this.loadAllApplications();
  }

  loadAllApplications() {
    this.dispatchMessage(["applications/load"]);
  }

  handleSearch() {
    const query = this.searchQuery.toLowerCase();
    console.log("Search query:", query);
    this.dispatchMessage(["applications/search", { query }]); 
    this.searchQuery = ""; 
  }

  handleAddApplication() {
    const newCompany = {
      name: this.companyName,
      items: [],
      city: this.companyCity,
      state: this.companyState,
      streetAddress: this.companyStreetAddress,
    };
  
    fetch("/applications/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.applicationTitle,
        company: newCompany,
        appliedDate: new Date(),
        status: this.applicationStatus,
        method: this.applicationMethod,
        notes: this.applicationNotes,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Application added successfully!");
          this.successMessage = "Application added successfully!";
          this.toggleModal();
          this.clearForm();
          window.location.href = "/app/application-search-view";
        } else {
          throw new Error("Failed to add application");
        }
      })
      .catch((error) => {
        console.error("Application addition failed:", error);
        this.errorMessage = "Failed to add application. Please try again.";
      });
  }
  
  clearForm() {
    this.applicationTitle = "";
    this.companyName = "";
    this.companyCity = "";
    this.companyState = "";
    this.companyStreetAddress = "";
    this.applicationAppliedDate = "";
    this.applicationStatus = "Pending";
    this.applicationMethod = "";
    this.applicationNotes = "";
  }  

  render() {
    const { applications = [] } = this.model;
    return html`
      <main>
        <section class="search-section">
          <h2>Search Your Applications</h2>
          <div class="search-bar">
            <input
              type="text"
              id="application-keyword"
              placeholder="Search by job title or company..."
              .value="${this.searchQuery}"
              @input="${(e: Event) =>
                (this.searchQuery = (e.target as HTMLInputElement).value)}"
            />
            <button @click="${this.handleSearch}">Search</button>
          </div>
        </section>

        <!-- Add Application Button -->
        <section class="add-application-section">
          <button @click="${this.toggleModal}">Add Application</button>
        </section>

        <!-- Modal for Adding an Application -->
        ${this.showModal
          ? html`
              <div class="modal">
                <div class="modal-content">
                  <h3>Add New Application</h3>

                  <!-- Application Title -->
                  <label for="title">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    .value="${this.applicationTitle}"
                    @input="${(e: Event) =>
                      (this.applicationTitle = (e.target as HTMLInputElement).value)}"
                  />

                  <!-- Company Information -->
                  <label for="company-name">Company Name</label>
                  <input
                    type="text"
                    id="company-name"
                    .value="${this.companyName}"
                    @input="${(e: Event) =>
                      (this.companyName = (e.target as HTMLInputElement).value)}"
                  />
                  <label for="company-city">City</label>
                  <input
                    type="text"
                    id="company-city"
                    .value="${this.companyCity}"
                    @input="${(e: Event) =>
                      (this.companyCity = (e.target as HTMLInputElement).value)}"
                  />
                  <label for="company-state">State</label>
                  <input
                    type="text"
                    id="company-state"
                    .value="${this.companyState}"
                    @input="${(e: Event) =>
                      (this.companyState = (e.target as HTMLInputElement).value)}"
                  />
                  <label for="company-street-address">Street Address</label>
                  <input
                    type="text"
                    id="company-street-address"
                    .value="${this.companyStreetAddress}"
                    @input="${(e: Event) =>
                      (this.companyStreetAddress = (e.target as HTMLInputElement).value)}"
                  />

                  <!-- Application Date -->
                  <label for="applied-date">Application Date</label>
                  <input
                    type="date"
                    id="applied-date"
                    .value="${this.applicationAppliedDate}"
                    @input="${(e: Event) =>
                      (this.applicationAppliedDate = (e.target as HTMLInputElement).value)}"
                  />

                  <!-- Application Status -->
                  <label for="status">Application Status</label>
                  <select
                    id="status"
                    .value="${this.applicationStatus}"
                    @change="${(e: Event) =>
                      (this.applicationStatus = (e.target as HTMLSelectElement).value)}"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <!-- Application Method -->
                  <label for="method">Application Method</label>
                  <select
                    id="method"
                    .value="${this.applicationMethod}"
                    @change="${(e: Event) =>
                      (this.applicationMethod = (e.target as HTMLSelectElement).value)}"
                  >
                    <option value="Company Site">Company Site</option>
                    <option value="Email">Email</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Handshake">Handshake</option>
                  </select>

                  <!-- Notes -->
                  <label for="notes">Notes</label>
                  <textarea
                    id="notes"
                    .value="${this.applicationNotes}"
                    @input="${(e: Event) =>
                      (this.applicationNotes = (e.target as HTMLTextAreaElement).value)}"
                  ></textarea>

                  <button @click="${this.handleAddApplication}">Submit Application</button>
                  <button @click="${this.toggleModal}">Cancel</button>
                </div>
              </div>
            `
          : ""}

        <section class="results-section">
          <h2>Results</h2>
          ${applications.length === 0
            ? html`<p>No applications found. Try a different keyword.</p>`
            : html`
                <ul class="application-list">
                  ${applications.map(
                    (application) =>
                      html`
                        <li>
                          <a href="applications/${application.id}">${application.title}</a>
                        </li>
                      `
                  )}
                </ul>
              `}
        </section>
      </main>

    `;
  }

  static styles = css`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    /* General Container */
    main {
      padding: 30px;
      font-family: 'Poppins', sans-serif;
      background-color: var(--color-background-page);
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    /* Search Section */
    .search-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      width: 100%;
      max-width: 700px;
    }

    /* Title */
    h2 {
      font-size: 1.8rem;
      color: var(--color-text-statistics);
      font-weight: 600;
      margin-bottom: 15px;
    }

    /* Search Bar */
    .search-bar {
      display: flex;
      flex-direction: row;
      width: 100%;
      max-width: 600px;
      border-radius: 40px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .search-bar input {
      flex: 1;
      padding: 15px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-right: none;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      outline: none;
      transition: border-color 0.3s ease;
      color: #333;
      background-color: white;
    }

    .search-bar input:focus {
      border-color: #007bff;
    }

    .search-bar button {
      padding: 15px 20px;
      font-size: 1rem;
      cursor: pointer;
      border: 1px solid #007bff;
      border-left: none;
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      background-color: #007bff;
      color: white;
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-left: 10px;
    }

    .search-bar button:hover {
      background-color: #0056b3;
    }

    .add-application-section button {
      background-color: #007bff; 
      color: white;
      padding: 10px 20px;
      font-size: 16px;
      border: none; 
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .add-application-section button:hover {
      background-color: #0056b3;
    }

    /* Results Section */
    .results-section {
      margin-top: 20px;
      width: 100%;
      max-width: 700px;
    }

    .results-section h2 {
      font-size: 1.6rem;
      color: var(--color-text-statistics);
      font-weight: 600;
      margin-bottom: 15px;
    }

    .application-list {
      list-style-type: none;
      padding: 0;
      margin: 10px 0;
    }

    .application-list li {
      padding: 15px;
      margin-bottom: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      background-color: var(--color-results-li);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }

    .application-list li:hover {
      background-color: #f5f5f5;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .application-list a {
      text-decoration: none;
      color: #007bff;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .application-list a:hover {
      color: #0056b3;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
    }

    .modal-content {
      background-color: white;
      padding: 30px;
      border-radius: 10px; /* Fully rounded corners */
      width: 30%;
      max-height: 90%;
      overflow-y: auto;
    }

    .modal h3 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .modal label {
      font-weight: 600;
      margin-top: 10px;
    }

    .modal input,
    .modal select,
    .modal textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    .modal textarea {
      min-height: 100px;
      resize: vertical;
    }

    .modal button {
      padding: 12px 20px;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 8px;
      background-color: #007bff;
      color: white;
      border: none;
      transition: background-color 0.3s ease;
      margin-right: 10px;
      margin-top: 10px;
    }

    .modal button:hover {
      background-color: #0056b3;
    }

    .modal button:last-child {
      background-color: #ccc;
    }

    .modal button:last-child:hover {
      background-color: #bbb;
    }

    /* Responsive Design */
    @media (max-width: 600px) {
      .search-section {
        margin-bottom: 20px;
      }

      .search-bar {
        flex-direction: column;
        width: 100%;
        max-width: 100%;
      }

      .search-bar input,
      .search-bar button {
        width: 100%;
        margin-bottom: 10px;
      }

      .application-list {
        padding: 0 10px;
      }

      /* Modal */
      .modal-content {
        width: 90%;
        padding: 20px;
      }
      
      .modal input,
      .modal select,
      .modal textarea {
        font-size: 0.9rem;
      }

      .modal button {
        width: 100%;
        margin-top: 10px;
      }
        
    }
      
    /* Dark Mode */
    :host([theme="dark"]) {
      --background-color: #121212;
      --primary-text-color: #f4f7fa;
      --secondary-text-color: #b0b0b0;
      --card-background: #333;
      --button-background: #6200ea;
      --button-hover-background: #3700b3;
    }
  `;
}

define({ "application-search-view": ApplicationSearchViewElement });
