import { API_RECOMMENDATION_MANAGEMENT_URL } from "../config/constant";
import { Recommendation } from "../objects/Recommendation";
import { apiClient } from "./ApiClient";

export const addRecommendation = (recommendation: Recommendation) => apiClient.post(`${API_RECOMMENDATION_MANAGEMENT_URL}/recommendation`, recommendation);

export const retrieveRecommendationByMenuId = (menuId: string) => apiClient.get(`${API_RECOMMENDATION_MANAGEMENT_URL}/recommendation/menu/${menuId}`);

export const deleteRecommendationById = (recommendationId: number) => apiClient.delete(`${API_RECOMMENDATION_MANAGEMENT_URL}/recommendation/${recommendationId}`);

export const updateRecommendationById = (recommendationId: number, recommendation: Recommendation) => apiClient.put(`${API_RECOMMENDATION_MANAGEMENT_URL}/recommendation/${recommendationId}`, recommendation);

export const removeDishFromRecommendationById = (recommendationId: string, dishId: number) => apiClient.put(`${API_RECOMMENDATION_MANAGEMENT_URL}/recommendation/${recommendationId}/dish/${dishId}`);