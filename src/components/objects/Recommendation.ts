import { Dish } from "./Dish";
import { Menu } from "./Menu";
import { UserGroup } from "./UserGroup";

export type Recommendation = {
    id?: number;
    name: string;
    created?: string;
    lastChange?: string;
    dishes: Dish[];
    userGroup?: UserGroup;
    menu: Menu;

}