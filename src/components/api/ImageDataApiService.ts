import { API_IMAGE_DATA_MANAGEMENT_URL } from "../config/constant";
import { apiClient } from "./ApiClient";

export const retrieveAllImagesFromDish = (dishId: number) => apiClient.get(`${API_IMAGE_DATA_MANAGEMENT_URL}/dish/${dishId}`);

export const deleteImageFile = (imageDataId: number) => apiClient.delete(`${API_IMAGE_DATA_MANAGEMENT_URL}/image/${imageDataId}`);

export const uploadImageFile = (dishId: number, formData: FormData) => apiClient.post(`${API_IMAGE_DATA_MANAGEMENT_URL}/dish/${dishId}`, formData, {
    headers: {
        'content-type': 'multipart/form-data'
    }
})