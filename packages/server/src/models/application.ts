import { Point } from "./geo";
import { Company } from "./company";
import { Interview } from "./interview";

export interface Application {
    title: string;
    company: Company;
    location: Point;
    postedDate?: Date;
    appliedDate: Date | undefined;
    method?: MethodType;
    status: StatusType;
    salaryRange?: SalaryRange;
    interviewDetails: Interview;
    followUpDate?: Date;
    notes?: string;
}

export type StatusType = "Pending" | "Submitted" | "Interview Scheduled" | "Accepted" | "Rejected";
export type MethodType = "Company Site" | "Email" | "Referral" | "LinkedIn" | "Recruiter" | "Handshake";
export interface SalaryRange {
    min: number;
    max: number;
}

