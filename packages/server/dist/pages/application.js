"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var application_exports = {};
__export(application_exports, {
  ApplicationPage: () => ApplicationPage
});
module.exports = __toCommonJS(application_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class ApplicationPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/application.css"],
      styles: [
        import_server.css`main.page {
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
    const { title, company, location, status } = this.data;
    return import_server.html`
      <body>
        <main class="page">
          <section class="application">
            <application-element">
              <span slot="title">${title}</span>
              <span slot="company">${company}</span>
              <span slot="location">${location.lat}, ${location.lon}</span>
              <span slot="status">${status}</span>
            </application-element>
          </section>
        </main>
      </body>
    `;
  }
  renderInterviewDetails(interview) {
    return import_server.html`
      <section class="interview-details">
        <span slot="interview-date">${interview.date.toString()}</span>
        <span slot="interview-format">${interview.format}</span>
        ${interview.location ? import_server.html`<span slot="interview-location">${interview.location.lat}, ${interview.location.lon}</span>` : ""}
        ${interview.interviewerEmail ? import_server.html`<span slot="interviewer-email">${interview.interviewerEmail}</span>` : ""}
      </section>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApplicationPage
});
