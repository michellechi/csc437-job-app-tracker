import { Point } from "./geo";

export interface Application{
    id: string;
    name: string;
    state: string;
    city: string;
    streetAddress: string;
    items: Item[];
}

export interface Item{
    id: string;
    name: string;
    price: number;
    category: string;
    storeId: string;
}


export type StatusType = "Pending" | "Interview Scheduled" | "Rejected" | "Applied" | "Accepted";
