import { Dish } from "./Dish";

export type ImageData = {
    id?: number;
    fileName: string;
    bucket: string;
    dish?: Dish;
}