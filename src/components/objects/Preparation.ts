import { Dish } from "./Dish";
import { UserInfo } from "./UserInfo";

export type Preparation = {
    id?: number;
    cooked: string;
    rating: number;
    comment: string;
    created?: string;
    lastChange?: string;
    dish?: Dish;
    userInfo?: UserInfo;
}