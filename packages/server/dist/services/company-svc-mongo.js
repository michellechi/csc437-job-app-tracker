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
var company_svc_mongo_exports = {};
__export(company_svc_mongo_exports, {
  default: () => company_svc_mongo_default
});
module.exports = __toCommonJS(company_svc_mongo_exports);
var import_mongoose = require("mongoose");
const ItemSchema = new import_mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  storeId: { type: String, required: true }
});
const CompanySchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
    items: { type: [ItemSchema], required: true }
  },
  { collection: "companys" }
);
const CompanyModel = (0, import_mongoose.model)("Company", CompanySchema);
function index() {
  return CompanyModel.find();
}
function get(id) {
  return CompanyModel.findOne({ id }).then((company) => {
    if (!company) throw new Error(`Company with id ${id} not found`);
    return company;
  }).catch((err) => {
    throw new Error(`Error fetching company: ${err}`);
  });
}
function create(json) {
  const newCompany = new CompanyModel(json);
  return newCompany.save();
}
function update(id, company) {
  return CompanyModel.findOneAndUpdate({ id }, company, {
    new: true
    // Return the updated document
  }).then((updated) => {
    if (!updated) throw new Error(`${id} not updated`);
    return updated;
  });
}
function remove(id) {
  return CompanyModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw new Error(`${id} not deleted`);
  });
}
var company_svc_mongo_default = { index, get, create, update, remove };
