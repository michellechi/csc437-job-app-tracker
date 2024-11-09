import { Point } from "./geo";

export interface Interview {
    date: Date;
    format: FormatType;
    location?: Point;
    interviewerEmail?: string;
}

export type FormatType = "Phone" | "Video" | "In-Person";