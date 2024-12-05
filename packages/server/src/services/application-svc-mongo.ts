import { Schema, model } from "mongoose";
import { Application } from "../models/application";
import { Company } from "../models/company";

const ApplicationSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    company: { 
      type: { 
        name: { type: String, required: true },
        location: { type: String, required: true },
        website: { type: String }, 
      }, 
      required: true 
    },
    appliedDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Submitted", "Interview Scheduled", "Accepted", "Rejected"], required: true },
    method: { 
      type: String, 
      enum: ["Company Site", "Email", "Referral", "LinkedIn", "Recruiter", "Handshake"], 
      required: true 
    },
    notes: { type: String }, // Optional notes
  },
  { collection: "applications" }
);

const ApplicationModel = model<Application>("Application", ApplicationSchema);

// Get all applications
function index(): Promise<Application[]> {
  return ApplicationModel.find();
}

// Get an application by ID
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

// Create a new application
function create(json: Application): Promise<Application> {
  const application = new ApplicationModel(json);
  return application.save();
}

// Update an existing application
function update(
  id: string,
  application: Partial<Application>
): Promise<Application> {
  return ApplicationModel.findOneAndUpdate({ id }, application, {
    new: true, // returns new value of JSON
  }).then((updated: any) => {
    if (!updated) throw `${id} not updated`;
    else return updated as Application;
  });
}

// Remove an application by ID
function remove(id: string): Promise<void> {
  return ApplicationModel.findOneAndDelete({ id }).then((deleted: any) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
