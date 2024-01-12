import { API_PREPARATION_MANAGEMENT_URL } from "../config/constant";
import { Preparation } from "../objects/Preparation";
import { apiClient } from "./ApiClient";

export const addPreparation = (dishId: number, preparation: Preparation) => apiClient.post(`${API_PREPARATION_MANAGEMENT_URL}/preparation/dish/${dishId}`, preparation);