import { Company } from "./company";

export interface Application {
    id: string;
    title: string;
    company: Company;
    appliedDate: Date;
    status: StatusType;
    method: MethodType;
    notes?: string;         // Optional notes field
}

export type StatusType = "Pending" | "Submitted" | "Interview Scheduled" | "Accepted" | "Rejected";
export type MethodType = "Company Site" | "Email" | "Referral" | "LinkedIn" | "Recruiter" | "Handshake";
