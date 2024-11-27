import { Schema, model } from "mongoose";
import { Application } from "../models/application";

const ItemSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    storeId: { type: String, required: true }
});

const ApplicationSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        streetAddress: { type: String, required: true },
        items: { type: [ItemSchema], required: true }
    },
    { collection: "applications" }
);

const ApplicationModel = model<Application>("Application", ApplicationSchema);

function index(): Promise<Application[]> {
    return ApplicationModel.find();
}

function get(id: string): Promise<Application | null> {
    return ApplicationModel.findOne({ id })
        .then((application: any) => {
            if (!application) throw new Error(`Application with id ${id} not found`);
            return application;
        })
        .catch((err: any) => {
            throw new Error(`Error fetching application: ${err}`);
        });
}

function create(json: Application): Promise<Application> {
    const newApplication = new ApplicationModel(json);
    return newApplication.save();
}

function update(id: string, application: Partial<Application>): Promise<Application> {
    return ApplicationModel.findOneAndUpdate({ id }, application, {
        new: true // Return the updated document
    }).then((updated: any) => {
        if (!updated) throw new Error(`${id} not updated`);
        return updated as Application;
    });
}

function remove(id: string): Promise<void> {
    return ApplicationModel.findOneAndDelete({ id }).then((deleted: any) => {
        if (!deleted) throw new Error(`${id} not deleted`);
    });
}

// Export the CRUD functions
export default { index, get, create, update, remove };
