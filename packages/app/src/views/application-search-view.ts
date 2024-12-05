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
    super("guru:model"); // Connect to mu-store
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
          <h2>Your Applications</h2>
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

input {
  flex: 1;
  padding: 10px; /* Adjust padding for a square look */
  font-size: 1rem;
  border: 1px solid #ccc;
  border-right: none;
  outline: none;
  transition: border-color 0.3s ease;
  color: #333;
  background-color: white;
}

input:focus {
  border-color: #007bff;
}

button {
  padding: 10px; /* Adjust padding for a square look */
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #ccc;
  border-left: none;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0056b3;
}

/* Make application list items more square */
.application-list {
  list-style-type: none; /* Remove bullet points */
  padding: 0; /* Remove extra padding around the list */
  margin: 10px 0; /* Maintain spacing */
}

.application-list li {
  padding: 15px 20px; /* Similar padding to the search bar */
  margin-bottom: 15px; /* Space between items */
  border: 1px solid #ccc; /* Similar border style */
  background-color: white; /* Consistent background */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* Subtle shadow */
  transition: background-color 0.3s ease, box-shadow 0.2s ease;
  width: 100%; /* Full width */
  max-width: 600px; /* Match the search bar's width */
  display: flex; /* Flex layout for content alignment */
  align-items: center; /* Center align content */
}

.application-list li:hover {
  background-color: #f5f5f5; /* Subtle hover effect */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Slightly stronger shadow */
}

.application-list a {
  text-decoration: none; /* Remove underline */
  color: #007bff; /* Link color */
  font-weight: 600; /* Bold text */
  flex: 1; /* Make the link take up available space */
  display: inline-block; /* Inline-block for text alignment */
  padding: 5px 10px; /* Padding inside the link */
  transition: color 0.3s ease;
}

.application-list a:hover {
  color: #0056b3; /* Darker blue on hover */
}

.application-list a:visited {
  color: #6c757d; /* Gray color for visited links */
}

/* Remove roundness for mobile view as well */
.search-bar input,
.search-bar button {
  font-family: 'Poppins', Arial, sans-serif;
  border-radius: 0; /* Remove roundness */
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
