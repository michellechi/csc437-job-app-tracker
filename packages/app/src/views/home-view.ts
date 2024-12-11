// src/views/home-view.ts
// @ts-ignore
import { define, View } from "@calpoly/mustang";
// @ts-ignore
import { css, html } from "lit";
// @ts-ignore
import { state, property } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";
export class HomeViewElement extends View<Model, Msg> {
  @state()
  searchQuery: string = "";

  constructor() {
    super("apptrak:model"); // Connect to mu-store
  }

  connectedCallback() {
    super.connectedCallback();
    // @ts-ignore
    this.dispatchMessage(["applications/load"]); // Fetch applications when the view is initialized
  }

  handleSearch() {
    const query = this.searchQuery.toLowerCase();
    // @ts-ignore
    this.dispatchMessage(["search/item", { query }]);
    this.searchQuery = ""; // Reset search query
  }

  render() {
    const { applications = [] } = this.model;

    // Calculate statistics based on the status of each application
    const statistics = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'Pending').length,
      submitted: applications.filter(app => app.status === 'Submitted').length,
      interview: applications.filter(app => app.status === 'Interview Scheduled').length,
      accepted: applications.filter(app => app.status === 'Accepted').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    };

    // Top 5 recent applications
    const recentApplications = applications.slice(0, 5);

    return html`
      <main>
        <!-- Dashboard Section -->
        <section class="dashboard-section">
          <h2 class="section-title">Dashboard</h2>
          <div class="statistics">
            <p>Total Applications: ${statistics.total}</p>
            <p>Submitted: ${statistics.submitted}</p>
            <p>Interview Scheduled: ${statistics.interview}</p>
            <p>Accepted: ${statistics.accepted}</p>
            <p>Rejected: ${statistics.rejected}</p>
          </div>
          <h3>Recent Applications</h3>
          <div class="recent-applications">
            ${recentApplications.map(
              (application) => html`
                <div class="app-card">
                  <p><strong>${application.title}</strong></p>
                  <p>Company: ${application.company.name}</p>
                  <p>Status: ${application.status}</p>
                </div>
              `
            )}
          </div>
        </section>
      </main>
    `;
  }

  static styles = css`
    main {
      padding: 20px;
      font-family: Poppins, "Arial", sans-serif;
      background-color: var(--color-background-page);
    }
    
    /* Dashboard Section Styling */
    .dashboard-section {
      background-color: var(--color-background-section);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .section-title {
      color: var(--color-text-statistics);
      font-size: 1.6em;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .statistics {
      margin-bottom: 20px;
      font-size: 1.1em;
      color: var(--color-text-statistics);
    }

    .statistics p {
      margin: 8px 0;
    }

    h3 {
      color: var(--color-text-statistics);
    }

    /* Recent Applications Styling */
    .recent-applications {
      color: var(--color-text-statistics);
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 20px;
    }

    .app-card {
      background: #dd7535;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      width: 18%;
      transition: background 0.3s ease, box-shadow 0.3s ease;
      text-align: center;
      color: 
    }

    .app-card p {
      margin: 5px 0;
      font-size: 1.1em;
      font-color: var(--color-text);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .search-bar {
        flex-direction: column;
      }

      input {
        width: 100%;
      }

      .recent-applications {
        flex-direction: column;
        align-items: center;
      }

      .app-card {
        width: 80%;
      }
    }
  `;
}

define({ "home-view": HomeViewElement });
