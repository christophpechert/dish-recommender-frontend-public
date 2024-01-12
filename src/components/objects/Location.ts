import { LocationType } from "../config/constant"

export type Location = {
    locationType: LocationType;
    link: string;
    cookbook: string;
    page: number;
}