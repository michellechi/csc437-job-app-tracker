import express, { Request, Response } from "express";
import { Application } from "../models/application";
import Applications from "../services/application-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
    Applications.index()
      .then((list: Application[]) => res.json(list))
      .catch((err) => res.status(500).send(err));
});
  
router.get("/:appId", (req: Request, res: Response) => {
    const { appId } = req.params;
  
    Applications.get(appId)
      .then((application: Application) => res.json(application))
      .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newApplication = req.body;
  
    Applications.create(newApplication)
      .then((application: Application) =>
        res.status(201).json(application)
      )
      .catch((err) => res.status(500).send(err));
});

router.put("/:appId", (req: Request, res: Response) => {
    const { appId } = req.params;
    const newApp = req.body;
  
    Applications
      .update(appId, newApp)
      .then((application: Application) => res.json(application))
      .catch((err) => res.status(404).end());
});

router.delete("/:appId", (req: Request, res: Response) => {
    const { appId } = req.params;
  
    Applications.remove(appId)
      .then(() => res.status(204).end())
      .catch((err) => res.status(404).send(err));
});
  
  export default router;