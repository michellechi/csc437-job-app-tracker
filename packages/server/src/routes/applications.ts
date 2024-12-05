import express, { Request, Response } from "express";
import {Application} from "../models/application"

import Applications_Mongo from "../services/application-svc-mongo"

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
            } else { // if application isn't found send error
                return res.status(404).send({ error: "Application not found" });
            }
        })
        .catch((err: any) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newApplicationData = req.body;

    Applications_Mongo.create(newApplicationData)
        .then((application: Application) =>
            res.status(201).json(application)
        )
        .catch((err) => res.status(500).send(err));
});

// schema is id not userid
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedApplicationData = req.body;

    Applications_Mongo
        .update(id, updatedApplicationData)
        .then((updatedApplicationData: Application) => res.json(updatedApplicationData))
        .catch((err) => res.status(404).end());
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Applications_Mongo.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;