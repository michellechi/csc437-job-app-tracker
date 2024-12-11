export interface Item {
    id: string;
    name: string;
    price: number;
}

export interface Company {
    name: string;
    items: Item[];
    city: string;
    state: string;
    streetAddress: string;
}

export interface Application {
    id: string;
    title: string;
    company: Company;
    appliedDate: Date;
    status: string;
    method: string;
    notes?: string;
}

export interface Model {
    companys: Company[];
    totalCost: number;
    applications: Application[];
}

export const init: Model = {
    companys: [],
    totalCost: 0,
    applications: []
};
