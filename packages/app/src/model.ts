export interface Item {
    id: string;
    name: string;
    price: number;
}

export interface Company {
    name: string;
    items: Item[];
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

export interface Model {
    companys: Company[];
    cartItems: CartItem[];
    totalCost: number;
    recipes: Recipe[];
}

export const init: Model = {
    companys: [],
    cartItems: [],
    totalCost: 0,
    recipes: [],
};
