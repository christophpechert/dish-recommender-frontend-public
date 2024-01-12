//export const API_BASE_URL = "https://dish-recommender.eu/api";

export const API_BASE_URL = "http://localhost:8080/api";

export const aws = ".s3.eu-central-1.amazonaws.com/"

export const API_USER_MANAGEMENT_URL = "/user-management";
export const API_MENU_MANAGEMENT_URL = "/menu-management";
export const API_DISH_MANAGEMENT_URL = "/dish-management";
export const API_USER_GROUP_MANAGEMENT_URL = "/user-group-management";
export const API_KEYWORD_MANAGEMENT_URL = "/keyword-management";
export const API_DATA_MANAGEMENT_URL = "/data-management";
export const API_INVITE_MANAGEMENT_URL = "/invite-management";
export const API_RECOMMENDATION_MANAGEMENT_URL = "/recommendation-management";
export const API_PREPARATION_MANAGEMENT_URL = "/preparation-management";
export const API_IMAGE_DATA_MANAGEMENT_URL = "/image-data-management";

export function converter(enumText: string): string {
    return enumText.toLowerCase().replace("_", " ");
}

export enum DishType {
    STARTER = "STARTER",
    MAIN_COURSE = "MAIN_COURSE",
    DESSERT = "DESSERT",
    SOUP = "SOUP",
    SNACK = "SNACK",
    SIDE_DISH = "SIDE_DISH",
    BREAKFAST = "BREAKFAST"
}

export enum DishCookingTimeCategory {
    Fast = "FAST",
    MODERATE = "MODERATE",
    Slow = "SLOW"
}

export enum LocationType {
    Internet = "INTERNET",
    Cookbook = "COOKBOOK"
}

export enum DishDietaryCategory {
    NON_VEGETARIAN = "NON_VEGETARIAN",
    VEGETARIAN = "VEGETARIAN",
    VEGAN = "VEGAN"
}

export enum DishCaloricCategory {
    LIGHT = "LIGHT",
    MEDIUM = "MEDIUM",
    HEAVY = "HEAVY"
}

export enum InviteStatus {
    SENT = "OPEN",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    RETRACT = "RETRACT"
}

export enum UserRole {
    ROLE_OWNER = "ROLE_OWNER",
    ROLE_CHEF = "ROLE_CHEF",
    ROLE_WAITER = "ROLE_WAITER",
    ROLE_GUEST = "ROLE_GUEST",
    ROLE_NEWBIE = "ROLE_NEWBIE"
}

export const NEW_ELEMENT = "new";
