export type Msg =
    | ["search/item", { query: string }]
    | ["cart/add", { item: { id: string; name: string; price: number; companyName: string } }]    
    | ["cart/removeItem", { itemId: string }]
    | ["companys/load"]
    | ["recipes/search", { query: string }]
    | ["applications/load"]
    | ["applications/search", { query: string }]
    | ["applications/delete", { id : string }]
