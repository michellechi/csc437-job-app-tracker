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

export interface CartItem {
    id: string;
    name: string;
    price: number;
    companyName: string;
    quantity?: number;
}

export interface Recipe {
    id: string;
    name: string;
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
    cartItems: CartItem[];
    totalCost: number;
    recipes: Recipe[];
    applications: Application[];
}

export const init: Model = {
    companys: [],
    cartItems: [],
    totalCost: 0,
    recipes: [],
    applications: []
};
