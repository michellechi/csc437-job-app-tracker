// src/views/application-search-view.ts
import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";

export class ApplicationSearchViewElement extends View<Model, Msg> {
  @state()
  searchQuery: string = ""; // Query for searching applications

  constructor() {
    super("apptrak:model"); // Connect to mu-store
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("Component connected. Loading all applications...");
    this.loadAllApplications(); // Fetch all applications when the component loads
  }

  loadAllApplications() {
    // Dispatch an action to fetch all applications
    this.dispatchMessage(["applications/load"]);
  }

  handleSearch() {
    const query = this.searchQuery.toLowerCase(); // Normalize the query
    console.log("Search query:", query);
    this.dispatchMessage(["applications/search", { query }]); // Dispatch the search action for applications
    this.searchQuery = ""; // Reset search query
  }

  render() {
    const { applications = [] } = this.model; // Fetch applications from model
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

    main {
      padding: 30px;
      font-family: 'Poppins', sans-serif;
      background-color: #f4f7fa;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .search-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      max-width: 700px;
      width: 100%;
    }

    h2 {
      font-size: 1.8rem;
      color: #444;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .search-bar {
      display: flex;
      width: 100%;
      max-width: 600px;
      border-radius: 40px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    input {
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

    input:focus {
      border-color: #007bff;
    }

    button {
      padding: 15px 20px;
      font-size: 1rem;
      cursor: pointer;
      border: 1px solid #ccc;
      border-left: none;
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      background-color: #007bff;
      color: white;
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-left: 10px;
    }

    button:hover {
      background-color: #0056b3;
    }

    .results-section {
      margin-top: 20px;
      width: 100%;
      max-width: 700px;
    }

    .results-section h2 {
      font-size: 1.6rem;
      color: #444;
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
      background-color: white;
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

    .application-list a:visited {
      color: #6c757d;
    }

    .search-bar input,
    .search-bar button {
      font-family: 'Poppins', Arial, sans-serif;
      border-radius: 25px;
    }

    @media (max-width: 600px) {
      .search-section {
        margin-bottom: 20px;
      }

      .search-bar {
        flex-direction: column;
        width: 100%;
        max-width: 100%;
      }

      input {
        width: 100%;
        margin-bottom: 10px;
      }

      button {
        width: 100%;
      }

      .application-list {
        padding: 0 10px;
      }
    }
  `;
}

define({ "application-search-view": ApplicationSearchViewElement });
