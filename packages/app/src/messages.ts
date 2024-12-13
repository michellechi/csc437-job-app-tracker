import { Company, Application } from "./model";

export type Msg =
    | ["companys/load"]
    | ["applications/load"]
    | ["applications/search", { query: string }]
    | ["applications/delete", { id : string }]
    | ["applications/add", { title: string, company: Company, appliedDate: Date, status: string, method: string, notes: string }]
    | [
        "application/save",
        {
          applicationId: string;
          application: Application;
          onSuccess?: () => void;
          onFailure?: (err: Error) => void;
        }
      ];