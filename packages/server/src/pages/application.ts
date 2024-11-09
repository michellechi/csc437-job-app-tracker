// src/pages/application.ts
import { css, html } from "@calpoly/mustang/server";
import { Application, Company, Interview, Point  } from "../models";
import renderPage from "./renderPage";

export class ApplicationPage {
  data: Application;

  constructor(data: Application) {
    this.data = data;
  }

  render() {
    return renderPage({
        body: this.renderBody(),
        stylesheets: ["/styles/application.css"],
        styles: [
            css`main.page {
                --page-grids: 8;
                @media screen and (max-width: 48rem) {
                  --page-grids: 6;
              }
            }`
        ],
        scripts: [
            `import { define } from "@calpoly/mustang";
            import { ApplicationElement } from "/scripts/application.js";

            define({
                "application-element": ApplicationElement
            });`
        ]
    });
  }

  renderBody() {
    const { title, company, location, postedDate, appliedDate, method, status, salaryRange, interviewDetails, followUpDate, notes } = this.data;
    
    return html`
      <body>
        <main class="page">
          <section class="application">
            <application-element src="/api/applications/google">
            //   <span slot="title">${title}</span>
            //   <span slot="company">${company.name}</span>
            //   <span slot="location">${location.lat}, ${location.lon}</span>
            //   <span slot="status">${status}</span>
            //   ${postedDate ? html`<span slot="posted-date">${postedDate.toString()}</span>` : ""}
            //   ${appliedDate ? html`<span slot="applied-date">${appliedDate.toString()}</span>` : ""}
            //   ${method ? html`<span slot="method">${method}</span>` : ""}
            //   ${salaryRange ? html`<span slot="salary-range">${salaryRange.min}, ${salaryRange.max}</span>` : ""}
            //   ${interviewDetails ? this.renderInterviewDetails(interviewDetails) : ""}
            //   ${followUpDate ? html`<span slot="follow-up-date">${followUpDate.toString()}</span>` : ""}
            //   ${notes ? html`<span slot="notes">${notes}</span>` : ""}
            </application-element>
          </section>
        </main>
      </body>
    `;
  }

  renderInterviewDetails(interview: Interview) {
    return html`
      <section class="interview-details">
        <span slot="interview-date">${interview.date.toString()}</span>
        <span slot="interview-format">${interview.format}</span>
        ${interview.location ? html`<span slot="interview-location">${interview.location.lat}, ${interview.location.lon}</span>` : ""}
        ${interview.interviewerEmail ? html`<span slot="interviewer-email">${interview.interviewerEmail}</span>` : ""}
      </section>
    `;
  }
}
