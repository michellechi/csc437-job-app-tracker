import express, { Request, Response } from "express";
import { ApplicationPage } from "./pages/application";
import Applications from "./services/application-svc";
import { connect } from "./services/mongo";

connect("JobApp");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/application/:appId", (req: Request, res: Response) => {
    const { appId } = req.params;

    Applications.get(appId)
        .then((data) => {
            const page = new ApplicationPage(data);
        res.set("Content-Type", "text/html").send(page.render());
    });
});