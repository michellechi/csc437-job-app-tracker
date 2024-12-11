export type Msg =
    | ["companys/load"]
    | ["applications/load"]
    | ["applications/search", { query: string }]
    | ["applications/delete", { id : string }]
