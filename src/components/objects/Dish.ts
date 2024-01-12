import { DishCookingTimeCategory, DishDietaryCategory, DishCaloricCategory, DishType } from "../config/constant";
import { Keyword } from "./Keyword";
import { Location } from "./Location";
import { Menu } from "./Menu";
import { Preparation } from "./Preparation";
import { ImageData } from "./ImageData";

export type Dish = {
    id?: number;
    name: string;
    description: string;
    comment: string;
    dishType: DishType;
    dishCookingTimeCategory: DishCookingTimeCategory;
    dishDietaryCategory: DishDietaryCategory;
    dishCaloricCategory: DishCaloricCategory;
    created?: string;
    lastChange?: string;
    locations: Location[];
    menus: Menu[];
    preparations: Preparation[];
    keywords: Keyword[];
    imageData: ImageData[];
    rating?: number;
}