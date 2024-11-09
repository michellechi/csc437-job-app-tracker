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
  default: () => application_svc_default,
  getApplication: () => getApplication
});
module.exports = __toCommonJS(application_svc_exports);
var import_mongoose = require("mongoose");
const ContactSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true }
  },
  { _id: false }
  // Prevents _id field from being automatically added to each contact
);
const ApplicationSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: {
      name: { type: String, required: true, trim: true },
      location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }
      },
      industry: { type: String, required: true },
      contacts: [ContactSchema]
    },
    location: {
      lat: { type: Number },
      lon: { type: Number }
    },
    postedDate: { type: Date },
    appliedDate: { type: Date },
    method: { type: String, trim: true },
    status: { type: String, required: true },
    salaryRange: {
      min: { type: Number },
      max: { type: Number }
    },
    interviewDetails: {
      date: { type: Date },
      format: { type: String },
      location: {
        lat: { type: Number },
        lon: { type: Number }
      },
      interviewerEmail: { type: String }
    },
    followUpDate: { type: Date },
    notes: { type: String }
  },
  { collection: "applications" }
);
const ApplicationModel = (0, import_mongoose.model)(
  "Application",
  ApplicationSchema
);
function get(appId) {
  return ApplicationModel.find({ appId }).then((list) => list[0]).catch(() => {
    throw `${appId} Not Found`;
  });
}
function index() {
  return ApplicationModel.find();
}
var application_svc_default = { index, get };
const applications = {
  google: {
    id: 1,
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
    id: 2,
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
