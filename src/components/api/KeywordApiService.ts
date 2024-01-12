import { API_KEYWORD_MANAGEMENT_URL } from "../config/constant";
import { Keyword } from "../objects/Keyword";
import { apiClient } from "./ApiClient";


export const addNewKeyword = (keyword: Keyword) => apiClient.post(`${API_KEYWORD_MANAGEMENT_URL}/keyword`, keyword);

export const retrieveAllKeywords = () => apiClient.get(`${API_KEYWORD_MANAGEMENT_URL}/keyword`);

export const retrieveKeywordById = (keywordId: string) => apiClient.get(`${API_KEYWORD_MANAGEMENT_URL}/keyword/${keywordId}`);

export const deleteKeywordById = (keywordId: string) => apiClient.delete(`${API_KEYWORD_MANAGEMENT_URL}/keyword/${keywordId}`);

export const updateKeyword = (keywordId: string, keyword: Keyword) => apiClient.put(`${API_KEYWORD_MANAGEMENT_URL}/keyword/${keywordId}`, keyword);