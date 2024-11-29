export interface Application {
    name: string;
    items: Array<{ name: string; price: number }>;
}

export interface CartItem {
    name: string;
    price: number;
    applicationName: string;
}

export interface Model {
    applications: Application[];
    cartItems: CartItem[];
    totalCost: number;
}

export const init: Model = {
    applications: [],
    cartItems: [],
    totalCost: 0,
};
