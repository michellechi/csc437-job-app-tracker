import { define, Form, InputArray, View } from "@calpoly/mustang";
import { html } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";
import { Application } from "../model";
import { property } from "lit/decorators.js";

export class ApplicationEditElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element
  });

  @property()
  applicationId?: string;

  @state()
  get application(): Application | undefined {
    return this.model.applications.find(app => app.id === this.applicationId);
  }

  render() {
    return html`
      <main class="page">
        <mu-form
          .init=${this.application}
          @mu-form:submit>
          <div class="form-group">
            <label for="title">Application Title</label>
            <input type="text" id="title" name="title" .value="${this.application?.title}" required />
          </div>
          <div class="form-group">
            <label for="companyName">Company Name</label>
            <input type="text" id="companyName" name="company.name" .value="${this.application?.company.name}" required />
          </div>
          <div class="form-group">
            <label for="companyCity">Company City</label>
            <input type="text" id="companyCity" name="company.city" .value="${this.application?.company.city}" required />
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" name="status" .value="${this.application?.status}">
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="offered">Offered</option>
            </select>
          </div>
          <div class="form-group">
            <label for="method">Method</label>
            <input type="text" id="method" name="method" .value="${this.application?.method}" required />
          </div>
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" name="notes">${this.application?.notes}</textarea>
          </div>
          <button type="submit">Save Application</button>
        </mu-form>
      </main>`;
  }
}
