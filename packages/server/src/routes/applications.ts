import express, { Request, Response } from "express";
import { Application } from "../models/application";
import Applications_Mongo from "../services/application-svc-mongo";

const router = express.Router();

router.get("/", (_, res: Response) => {
    Applications_Mongo.index()
        .then((list: Application[]) => res.json(list))
        .catch((err: any) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    Applications_Mongo.get(id)
        .then((application: Application | null) => {
            if (application) {
                return res.json(application);
            } else {
                return res.status(404).send({ error: "Application not found" });
            }
        })
        .catch((err: any) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newApplicationData = req.body;

    Applications_Mongo.create(newApplicationData)
        .then((application: Application) => res.status(201).json(application))
        .catch((err: any) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;

    Applications_Mongo.update(id, updatedData)
        .then((updatedApplication: Application) => res.json(updatedApplication))
        .catch(() => res.status(404).send({ error: "Application not found" }));
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Applications_Mongo.remove(id)
        .then(() => res.status(204).end())
        .catch(() => res.status(404).send({ error: "Application not found" }));
});

export default router;
