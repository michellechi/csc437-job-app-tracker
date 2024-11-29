export interface Application {
    name: string;
    items: Array<{ name: string; price: number }>;
}
export interface CartItem {
    name: string;
    price: number;
    vendorName: string;
}
export interface Model {
    vendors: Vendor[];
    cartItems: CartItem[];
    totalCost: number;
}
export const init: Model = {
    vendors: [],
    cartItems: [],
    totalCost: 0,
};