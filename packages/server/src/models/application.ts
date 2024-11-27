export interface Application{
    id: string;
    title: string;
    company: string;
    location: string;
    status: string;
}

export interface Item{
    id: string;
    name: string;
    price: number;
    category: string;
    storeId: string;
}

