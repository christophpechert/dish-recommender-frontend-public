import { apiClient } from "./ApiClient"
import { API_MENU_MANAGEMENT_URL } from "../config/constant" 
import { Menu } from "../objects/Menu"

export const retrieveMenus = () => apiClient.get(`${API_MENU_MANAGEMENT_URL}/menu`)

export const retrieveMenuWithDishes = (menuId: string) => apiClient.get(`${API_MENU_MANAGEMENT_URL}/menu/${menuId}`)

export const updateMenu = (menuId: string, menu: Menu) => apiClient.put(`${API_MENU_MANAGEMENT_URL}/menu/${menuId}`, menu)

export const deleteMenuById = (menuId: string) => apiClient.delete(`${API_MENU_MANAGEMENT_URL}/menu/${menuId}`)

export const addNewMenu = (menu: Menu) => apiClient.post(`${API_MENU_MANAGEMENT_URL}/menu`, menu)