import { Dish } from "./Dish";

export type Menu = {
    id?: number;
    name: string;
    description: string;
    created?: string;
    lastChange?: string;
    dishes? : Dish[];
}

export type MenuWithNumberOfDishes = {
    id: number;
    name: string;
    description: string;
    numberOfDishes: number;
}
