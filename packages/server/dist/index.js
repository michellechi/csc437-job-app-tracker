"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_recipe_svc_mongo = __toESM(require("./services/recipe-svc-mongo"));
var import_application_svc_mongo = __toESM(require("./services/application-svc-mongo"));
var import_auth = __toESM(require("./routes/auth"));
var import_recipes = __toESM(require("./routes/recipes"));
var import_companys = __toESM(require("./routes/companys"));
var import_applications = __toESM(require("./routes/applications"));
var import_mongo = require("./services/mongo");
var import_auth2 = require("./pages/auth");
(0, import_mongo.connect)("JopApp");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use("/auth", import_auth.default);
app.use("/api/recipes", import_recipes.default);
app.use("/api/applications", import_applications.default);
app.use("/api/companys", import_companys.default);
app.get("/hello", (_, res) => {
  res.send(
    `<h1>Hello!</h1>
         <p>Server is up and running.</p>
         <p>Serving static files from <code>${staticDir}</code>.</p>
        `
  );
});
app.get("/login", (req, res) => {
  const page = new import_auth2.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/register", (req, res) => {
  const page = new import_auth2.RegistrationPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/recipe/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  try {
    const data = await import_recipe_svc_mongo.default.get(recipeId);
    const recipePage = new Recipe(data);
    res.set("Content-Type", "text/html").send(recipePage.render());
  } catch (error) {
    res.status(500).send("Error fetching recipe.");
  }
});
app.get("/application/:appId", async (req, res) => {
  const { appId } = req.params;
  try {
    const data = await import_application_svc_mongo.default.get(appId);
    const applicationPage = new Application(data);
    res.set("Content-Type", "text/html").send(applicationPage.render());
  } catch (error) {
    res.status(500).send("Error fetching application.");
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
