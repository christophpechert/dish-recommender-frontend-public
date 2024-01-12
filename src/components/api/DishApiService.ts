import { apiClient } from "./ApiClient"
import { API_DISH_MANAGEMENT_URL, DishCaloricCategory, DishCookingTimeCategory, DishDietaryCategory, DishType } from "../config/constant"
import { Dish } from "../objects/Dish"

export const retrieveDishById = (dishId: string) => apiClient.get(`${API_DISH_MANAGEMENT_URL}/dish/${dishId}`)

export const updateDish = (dishId: string, dish: Dish) => apiClient.put(`${API_DISH_MANAGEMENT_URL}/dish/${dishId}`, dish)

export const deleteById = (dishId: string) => apiClient.delete(`${API_DISH_MANAGEMENT_URL}/dish/${dishId}`)

export const retrieveAllDishes = () => apiClient.get(`${API_DISH_MANAGEMENT_URL}/dish`)

export const addNewDish = (dish: Dish) => apiClient.post(`${API_DISH_MANAGEMENT_URL}/dish`, dish)

export const retrieveDishesByMenuIdAndCriteria = (
    menuId: number,
    keywordIds?: number[],
    isAllKeywordsReq?: boolean,  
    types?: DishType[], 
    cookingTimeCategories?: DishCookingTimeCategory[],
    dietaryCategories?: DishDietaryCategory[],
    caloricCategories?: DishCaloricCategory[]) => apiClient.get(`${API_DISH_MANAGEMENT_URL}/menu/${menuId}`, {params: {
        ...(keywordIds && {keywordids: keywordIds.toString()}),
        ...(isAllKeywordsReq && {allkeywordsreq: isAllKeywordsReq.toString()}),
        ...(types && {types: types.toString()}),
        ...(cookingTimeCategories && {cookingtimecategories: cookingTimeCategories.toString()}),
        ...(dietaryCategories && {dietarycategories: dietaryCategories.toString()}),
        ...(caloricCategories && {caloriccategories: caloricCategories.toString()})
    }})

export const retrieveAllDishesFromRecommendation = (recommendationId: string) => apiClient.get(`${API_DISH_MANAGEMENT_URL}/dish/recommendation/${recommendationId}`);
