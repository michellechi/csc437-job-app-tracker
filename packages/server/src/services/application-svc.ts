import { Application } from "../models/application";
import { Schema, model } from "mongoose";

const ContactSchema = new Schema(
    {
      name: { type: String, required: true, trim: true },
      phoneNumber: { type: String, required: true, trim: true }
    },
    { _id: false } // Prevents _id field from being automatically added to each contact
);

const ApplicationSchema = new Schema<Application>(
{
    title: { type: String, required: true, trim: true },
    company: {
    name: { type: String, required: true, trim: true },
    location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }
    },
    industry: { type: String, required: true },
    contacts: [ContactSchema]
    },
    location: {
    lat: { type: Number },
    lon: { type: Number }
    },
    postedDate: { type: Date },
    appliedDate: { type: Date },
    method: { type: String, trim: true },
    status: { type: String, required: true },
    salaryRange: {
    min: { type: Number },
    max: { type: Number }
    },
    interviewDetails: {
    date: { type: Date },
    format: { type: String },
    location: {
        lat: { type: Number },
        lon: { type: Number }
    },
    interviewerEmail: { type: String }
    },
    followUpDate: { type: Date },
    notes: { type: String }
},
{ collection: "applications" }
); 
  
const ApplicationModel = model<Application>(
    "Application", 
    ApplicationSchema
);

function get(appId: string): Promise<Application> {
    return ApplicationModel.find({ appId })
    .then((list) => list[0])
    .catch(() => {
      throw `${appId} Not Found`;
    });
}

function index(): Promise<Application[]> {
    return ApplicationModel.find();
  }

export default { index, get };


const applications: { [key: string]: Application } = {
  google: {
    id: 1,
    title: "Frontend Engineer",
    company: {
      name: "Google",
      location: { lat: 37.422, lon: -122.084 },
      industry: "Technology",
      contacts: [{ name: "John Doe", phoneNumber: "123-456-7890" }],
    },
    location: { lat: 37.422, lon: -122.084 },
    postedDate: new Date("2024-08-01"),
    appliedDate: new Date("2024-08-10"),
    method: "LinkedIn",
    status: "Interview Scheduled",
    salaryRange: { 
        min: 120000, 
        max: 150000 
    },
    interviewDetails: {
      date: new Date("2024-09-01"),
      format: "Video",
      interviewerEmail: "johndoe@google.com",
    },
    followUpDate: new Date("2024-09-08"),
    notes: "Interview scheduled with the hiring manager.",
  },
  amazon: {
    id: 2,
    title: "Backend Developer",
    company: {
      name: "Amazon",
      location: { lat: 47.6062, lon: -122.3321 },
      industry: "E-commerce",
      contacts: [{ name: "Jane Smith", phoneNumber: "987-654-3210" }],
    },
    location: { lat: 47.6062, lon: -122.3321 },
    postedDate: new Date("2024-08-05"),
    appliedDate: new Date("2024-08-15"),
    method: "Company Site",
    status: "Pending",
    salaryRange: { 
        min: 100000, 
        max: 130000 
    },
    interviewDetails: {
      date: new Date("2024-09-12"),
      format: "In-Person",
      location: { lat: 47.6062, lon: -122.3321 },
      interviewerEmail: "hr@amazon.com",
    },
    followUpDate: new Date("2024-09-20"),
    notes: "Waiting for response after initial phone screen.",
  },
};

export function getApplication(_: string){
  return applications["google"];
}