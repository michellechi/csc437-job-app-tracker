// src/index.ts
import express, { Request, Response } from "express";
import Application_Mongo from "./services/application-svc-mongo";
import auth, { authenticateUser } from "./routes/auth";
import companys from "./routes/companys";
import applications from "./routes/applications";
import { connect } from "./services/mongo"; // Connect to the database
import {LoginPage, RegistrationPage} from "./pages/auth"

// Connect to the database
connect("JopApp"); // Use your own DB name here

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the specified directory
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(express.static(staticDir));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Authentication routes
app.use("/auth", auth);

// Protected routes
app.use("/api/applications", applications);
// Companys API routes
app.use("/api/companys", companys);

// Example route to check if the server is running
app.get("/hello", (_: Request, res: Response) => {
    res.send(
        `<h1>Hello!</h1>
         <p>Server is up and running.</p>
         <p>Serving static files from <code>${staticDir}</code>.</p>
        `
    );
});

app.get("/login", (req: Request, res: Response) => {
    const page = new LoginPage();
    res.set("Content-Type", "text/html").send(page.render());
});

app.get("/register", (req: Request, res: Response) => {
    const page = new RegistrationPage();
    res.set("Content-Type", "text/html").send(page.render());
});

// Route to get a application by ID and render it
app.get("/application/:appId", async (req: Request, res: Response) => {
    const { appId } = req.params;
    try {
        const data = await Application_Mongo.get(appId);
        // Create an instance of Recipe for the response
        // @ts-ignore
        const applicationPage = new Application(data);
        res.set("Content-Type", "text/html").send(applicationPage.render()); // Call render on the instance
    } catch (error) {
        res.status(500).send("Error fetching application.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
