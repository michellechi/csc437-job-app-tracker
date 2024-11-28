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
var applications_exports = {};
__export(applications_exports, {
  default: () => applications_default
});
module.exports = __toCommonJS(applications_exports);
var import_express = __toESM(require("express"));
var import_application_svc_mongo = __toESM(require("../services/application-svc-mongo"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_application_svc_mongo.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  import_application_svc_mongo.default.get(id).then((application) => {
    if (application) {
      return res.json(application);
    } else {
      return res.status(404).send({ error: "Application not found" });
    }
  }).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newApplicationData = req.body;
  import_application_svc_mongo.default.create(newApplicationData).then((application) => res.status(201).json(application)).catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  import_application_svc_mongo.default.update(id, updatedData).then((updatedApplication) => res.json(updatedApplication)).catch(() => res.status(404).send({ error: "Application not found" }));
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  import_application_svc_mongo.default.remove(id).then(() => res.status(204).end()).catch(() => res.status(404).send({ error: "Application not found" }));
});
var applications_default = router;
