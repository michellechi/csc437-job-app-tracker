import { Point } from "./geo";

export interface Company {
    name: string;
    location: Point | undefined;
    industry: string;
    contacts?: Array<Contact>
}

export interface Contact {
    name: string;
    phoneNumber: string;
}