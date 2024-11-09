import express, { Application, Request, Response } from "express";
import { ApplicationPage } from "./pages/application";
import { getApplication } from "./services/application-svc"

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

app.get(
    "/application/:appId",
    (req: Request, res: Response) => {
        const { appId } = req.params;
        const data = getApplication(appId);
        const page = new ApplicationPage(data);
        
        res.set("Content-Type", "text/html").send(page.render());

    }
)