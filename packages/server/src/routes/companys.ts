import express, { Request, Response } from "express";
import { Company } from "../models/company";
import Companys_Mongo from "../services/company-svc-mongo"; // Adjust the path if necessary

const router = express.Router();

// GET: Retrieve all companys
router.get("/", (_, res: Response) => {
    Companys_Mongo.index()
        .then((list: Company[]) => res.json(list))
        .catch((err: any) => res.status(500).send(err));
});

// GET: Retrieve a single company by ID
router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    Companys_Mongo.get(id)
        .then((company: Company | null) => {
            if (company) {
                return res.json(company);
            } else {
                return res.status(404).send({ error: "Company not found" });
            }
        })
        .catch((err: any) => res.status(500).send(err));
});

// POST: Create a new company
router.post("/", (req: Request, res: Response) => {
    const newCompanyData = req.body;

    Companys_Mongo.create(newCompanyData)
        .then((company: Company) => res.status(201).json(company))
        .catch((err) => res.status(500).send(err));
});

// PUT: Update an existing company by ID
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedCompanyData = req.body;

    Companys_Mongo.update(id, updatedCompanyData)
        .then((updatedCompany: Company) => res.json(updatedCompany))
        .catch((err) => res.status(404).send({ error: "Company not found" }));
});

// DELETE: Remove a company by ID
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Companys_Mongo.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send({ error: "Company not found" }));
});

export default router;
