// @ts-ignore
import { LitElement, css, html } from "lit";

export class ApplicationCard extends LitElement {
    render() {
        return html`
      <div class="application-card">
        <div class="application-header">
          <h1><slot name="title">Application Title</slot></h1>
          <div class="details">
            <span><slot name="company-name">Company Name</slot></span>
            <span><slot name="status">Status</slot></span>
            <span><slot name="method">Application Method</slot></span>
          </div>
        </div>
        <div class="company-info">
          <h2>Company Information</h2>
          <p><slot name="company-address">Address</slot></p>
        </div>
        <div class="application-notes">
          <h3>Notes</h3>
          <p><slot name="notes">No additional notes</slot></p>
        </div>
      </div>
    `;
    }

    static styles = css`
    .application-card {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 8px;
      background-color: var(--color-background-card);
      color: var(--color-text);
    }

    .application-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .details {
      display: flex;
      justify-content: center;
      gap: 20px;
      font-size: var(--size-type-body);
    }

    .company-info {
      margin-top: 20px;
      padding: 10px;
      border-top: 1px solid var(--color-border);
    }

    .application-notes {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid var(--color-border);
    }

    h1, h2, h3 {
      font-family: var(--font-family-header);
    }

    h1 {
      font-size: var(--size-type-xxlarge);
    }

    h2 {
      font-size: var(--size-type-large);
    }

    h3 {
      font-size: var(--size-type-medium);
    }

    p, span {
      font-size: var(--size-type-body);
    }
  `;
}

