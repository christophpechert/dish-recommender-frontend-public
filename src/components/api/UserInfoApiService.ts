import { API_USER_MANAGEMENT_URL, UserRole } from "../config/constant";
import { UserInfo } from "../objects/UserInfo";
import { apiClient } from "./ApiClient";

export const addNewUser = (user: UserInfo) => apiClient.post(`${API_USER_MANAGEMENT_URL}/user`, user)

export const retrieveUserByAuth = () => apiClient.get<UserInfo>(`${API_USER_MANAGEMENT_URL}/user`)

export const changeUserRoleByIdAndRole = (userInfoId: number, role: UserRole) => apiClient.put(`${API_USER_MANAGEMENT_URL}/user/${userInfoId}/user-role/${role}`)
