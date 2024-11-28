import { Point } from "./geo";

export interface Application{
    id: string;
    title: string;
    company: string;
    location: string;
    status: StatusType;
} 

export interface Item{
    id: string;
    name: string;
    price: number;
    category: string;
    storeId: string;
}


export type StatusType = "Pending" | "Interview Scheduled" | "Rejected" | "Applied" | "Accepted";
