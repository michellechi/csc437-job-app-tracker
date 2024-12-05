import { Schema, model } from "mongoose";
import { Company } from "../models/company";

// Define the Item schema
const ItemSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    storeId: { type: String, required: true }
});

// Define the Company schema
const CompanySchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        streetAddress: { type: String, required: true },
        items: { type: [ItemSchema], required: true }
    },
    { collection: "companys" }
);

// Create the Company model
const CompanyModel = model<Company>("Company", CompanySchema);

// Retrieve all companys
function index(): Promise<Company[]> {
    return CompanyModel.find();
}

// Retrieve a single company by ID
function get(id: string): Promise<Company | null> {
    return CompanyModel.findOne({ id })
        .then((company: any) => {
            if (!company) throw new Error(`Company with id ${id} not found`);
            return company;
        })
        .catch((err: any) => {
            throw new Error(`Error fetching company: ${err}`);
        });
}

// Create a new company
function create(json: Company): Promise<Company> {
    const newCompany = new CompanyModel(json);
    return newCompany.save();
}

// Update an existing company by ID
function update(id: string, company: Partial<Company>): Promise<Company> {
    return CompanyModel.findOneAndUpdate({ id }, company, {
        new: true // Return the updated document
    }).then((updated: any) => {
        if (!updated) throw new Error(`${id} not updated`);
        return updated as Company;
    });
}

// Delete a company by ID
function remove(id: string): Promise<void> {
    return CompanyModel.findOneAndDelete({ id }).then((deleted: any) => {
        if (!deleted) throw new Error(`${id} not deleted`);
    });
}

// Export the CRUD functions
export default { index, get, create, update, remove };
