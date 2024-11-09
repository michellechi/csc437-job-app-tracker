"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var application_svc_exports = {};
__export(application_svc_exports, {
  getApplication: () => getApplication
});
module.exports = __toCommonJS(application_svc_exports);
const applications = {
  google: {
    title: "Frontend Engineer",
    company: {
      name: "Google",
      location: { lat: 37.422, lon: -122.084 },
      industry: "Technology",
      contacts: [{ name: "John Doe", phoneNumber: "123-456-7890" }]
    },
    location: { lat: 37.422, lon: -122.084 },
    postedDate: /* @__PURE__ */ new Date("2024-08-01"),
    appliedDate: /* @__PURE__ */ new Date("2024-08-10"),
    method: "LinkedIn",
    status: "Interview Scheduled",
    salaryRange: {
      min: 12e4,
      max: 15e4
    },
    interviewDetails: {
      date: /* @__PURE__ */ new Date("2024-09-01"),
      format: "Video",
      interviewerEmail: "johndoe@google.com"
    },
    followUpDate: /* @__PURE__ */ new Date("2024-09-08"),
    notes: "Interview scheduled with the hiring manager."
  },
  amazon: {
    title: "Backend Developer",
    company: {
      name: "Amazon",
      location: { lat: 47.6062, lon: -122.3321 },
      industry: "E-commerce",
      contacts: [{ name: "Jane Smith", phoneNumber: "987-654-3210" }]
    },
    location: { lat: 47.6062, lon: -122.3321 },
    postedDate: /* @__PURE__ */ new Date("2024-08-05"),
    appliedDate: /* @__PURE__ */ new Date("2024-08-15"),
    method: "Company Site",
    status: "Pending",
    salaryRange: {
      min: 1e5,
      max: 13e4
    },
    interviewDetails: {
      date: /* @__PURE__ */ new Date("2024-09-12"),
      format: "In-Person",
      location: { lat: 47.6062, lon: -122.3321 },
      interviewerEmail: "hr@amazon.com"
    },
    followUpDate: /* @__PURE__ */ new Date("2024-09-20"),
    notes: "Waiting for response after initial phone screen."
  }
};
function getApplication(_) {
  return applications["google"];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getApplication
});
