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
var application_svc_mongo_exports = {};
__export(application_svc_mongo_exports, {
  default: () => application_svc_mongo_default
});
module.exports = __toCommonJS(application_svc_mongo_exports);
var import_mongoose = require("mongoose");
const ApplicationSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    company: {
      type: {
        name: { type: String, required: true },
        location: { type: String, required: true },
        website: { type: String }
      },
      required: true
    },
    appliedDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Submitted", "Interview Scheduled", "Accepted", "Rejected"], required: true },
    method: {
      type: String,
      enum: ["Company Site", "Email", "Referral", "LinkedIn", "Recruiter", "Handshake"],
      required: true
    },
    notes: { type: String }
    // Optional notes
  },
  { collection: "applications" }
);
const ApplicationModel = (0, import_mongoose.model)("Application", ApplicationSchema);
function index() {
  return ApplicationModel.find();
}
function get(id) {
  return ApplicationModel.findOne({ id }).then((application) => {
    if (!application) throw new Error(`Application with id ${id} not found`);
    return application;
  }).catch((err) => {
    throw new Error(`Error fetching application: ${err}`);
  });
}
function create(json) {
  const application = new ApplicationModel(json);
  return application.save();
}
function update(id, application) {
  return ApplicationModel.findOneAndUpdate({ id }, application, {
    new: true
    // returns new value of JSON
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated;
  });
}
function remove(id) {
  return ApplicationModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var application_svc_mongo_default = { index, get, create, update, remove };
