import express, { Request, Response } from "express";
import Applications from "./services/application-svc-mongo";
import { connect } from "./services/mongo";
import applications from "./routes/applications";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "pages/auth";

connect("JobApp");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use("/api/applications", authenticateUser, applications);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/login", (req: Request, res: Response) => {
    const page = new LoginPage();
    res.set("Content-Type", "text/html").send(page.render());
});  

// app.get("/applications/:id", (req: Request, res: Response) => {
//     const { id } = req.params;

//     Applications.get(id)
//         .then((data) => {
//             const page = new ApplicationPage(data);
//         res.set("Content-Type", "text/html").send(page.render());
//     });
// });

app.post("/api/applications", async (req, res) => {
    const applicationData = req.body;
    try {
        const newApplication = await Applications.create(applicationData);
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(400).send(error);
    }
});