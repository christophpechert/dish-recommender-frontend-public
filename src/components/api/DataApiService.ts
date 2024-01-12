import { API_DATA_MANAGEMENT_URL } from "../config/constant";
import { Dish } from "../objects/Dish";
import { Keyword } from "../objects/Keyword";
import { Menu } from "../objects/Menu";
import { apiClient } from "./ApiClient";

export const retrieveAllDishes = () => apiClient.get(`${API_DATA_MANAGEMENT_URL}/dishes`);

export const addDishes = (dishes: Dish[]) => apiClient.post(`${API_DATA_MANAGEMENT_URL}/dishes`, dishes);

export const retrieveAllKeywords = () => apiClient.get(`${API_DATA_MANAGEMENT_URL}/keywords`);

export const addKeywords = (keywords: Keyword[]) => apiClient.post(`${API_DATA_MANAGEMENT_URL}/keywords`, keywords);

export const retrieveAllMenus = () => apiClient.get(`${API_DATA_MANAGEMENT_URL}/menus`);

export const addMenus = (menus: Menu[]) => apiClient.post(`${API_DATA_MANAGEMENT_URL}/menus`, menus);