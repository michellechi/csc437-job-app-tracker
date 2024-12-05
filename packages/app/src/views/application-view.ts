// @ts-ignore
import { Auth, Observer } from "@calpoly/mustang";
// @ts-ignore
import { css, html, LitElement } from "lit";
// @ts-ignore
import { state, property } from "lit/decorators.js";

// @ts-ignore
import { Application } from "./models/application";

export class ApplicationViewElement extends LitElement {
    @property({ type: String })
    itemId: string = "";

    @state()
    application: Application | null = null;

    connectedCallback() {
        super.connectedCallback();
        console.log("ConnectedCallback -> Item ID:", this.itemId);
        if (this.itemId) {
            this.hydrate();
        } else {
            console.error("Missing itemId for application.");
        }
    }

    hydrate() {
    if (this.itemId) {
        console.log("Fetching application with ID:", this.itemId);
        fetch(`/api/applications/${this.itemId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Error fetching application: ${response.statusText}`);
            })
            .then((data: Application) => {
                this.application = {
                    ...data,
                    status: data.status || "Not specified", // Ensure the status is provided
                };
            })
            .catch((error) => {
                console.error("Failed to fetch application:", error);
            });
    } else {
        console.log("Fetching all applications...");
        fetch(`/api/applications`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Error fetching applications: ${response.statusText}`);
            })
            .then((data: Application[]) => {
                // Handle multiple applications here
                console.log("Fetched applications:", data);
                this.application = data.length > 0 ? data[0] : null; // Display the first application or handle this as needed
            })
            .catch((error) => {
                console.error("Failed to fetch applications:", error);
            });
    }
}

    handleBackButton() {
        window.history.back(); // This will go back to the previous page in the browser's history
    }

    handleDelete() {
        if (this.itemId) {
            fetch(`/api/applications/${this.itemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.ok) {
                    console.log("Application deleted successfully.");
                    // Optionally, redirect or update the UI after deletion
                    window.history.back(); // Go back to the previous page after deletion
                } else {
                    throw new Error(`Error deleting application: ${response.statusText}`);
                }
            })
            .catch((error) => {
                console.error("Failed to delete application:", error);
            });
        } else {
            console.error("No itemId provided for deletion.");
        }
    }

    render() {
        if (!this.application) {
            return html`<p>Loading application...</p>`; // Loading state
        }

        const { title, status, appliedDate, method, notes, company } = this.application;
        const { name: companyName, state, city, streetAddress } = company;

        const formattedDate = new Date(appliedDate).toLocaleDateString(); // Format applied date

        return html`
      <main>
        <section class="application-section">
          <!-- Flexbox container for back button and title -->
          <div class="header">
            <button @click="${this.handleBackButton}" class="back-button">← Back</button>
            <h2 class="title">${title}</h2>
          </div>

          <div class="company-info">
            <h3>Company: ${companyName}</h3>
            <p><strong>Location:</strong> ${city}, ${state}</p>
            <p><strong>Address:</strong> ${streetAddress}</p>
          </div>

          <div class="application-details">
            <p><strong>Applied on:</strong> ${formattedDate}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Application Method:</strong> ${method || "Not specified"}</p>

            <div class="notes">
              <h3>Notes</h3>
              <p>${notes || "No notes available"}</p>
            </div>
          </div>

          <!-- Delete button -->
          <div class="action-buttons">
            <button @click="${this.handleDelete}" class="delete-button">Delete Application</button>
          </div>
        </section>
      </main>
    `;
    }

    static styles = css`
      main {
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .application-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* Flexbox container for the header (back button + title) */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between; /* Space out the items */
      }

      .title {
        flex-grow: 1; /* Allow the title to take up the remaining space */
        text-align: center; /* Center the title */
        font-size: 2em;
        font-weight: bold;
        color: #333;
        margin: 0; /* Remove default margin for better alignment */
      }

      .company-info {
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
      }

      .company-info h3 {
        font-size: 1.5em;
        margin-bottom: 10px;
      }

      .application-details p {
        font-size: 1.1em;
        line-height: 1.6;
      }

      .notes p {
        font-style: italic;
      }

      .notes h3 {
        font-size: 1.3em;
        margin-top: 20px;
      }

      .back-button, .delete-button {
        padding: 10px 20px;
        font-size: 1.2em;
        background-color: #e46212;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .back-button:hover, .delete-button:hover {
        background-color: #dd7535;
      }

      .action-buttons {
        margin-top: 20px;
      }
    `;
}
