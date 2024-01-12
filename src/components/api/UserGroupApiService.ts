import { API_USER_GROUP_MANAGEMENT_URL } from "../config/constant";
import { UserGroup } from "../objects/UserGroup";
import { apiClient } from "./ApiClient";


export const addNewUserGroup = (userGroup: UserGroup) => apiClient.post(`${API_USER_GROUP_MANAGEMENT_URL}/user-group`, userGroup)

export const retrieveUserGroupWithMenusAndKeywords = () => apiClient.get(`${API_USER_GROUP_MANAGEMENT_URL}/user-group`)

export const retrieveUserGroupWithAllUsers = () => apiClient.get(`${API_USER_GROUP_MANAGEMENT_URL}/user-group/user`)

export const retrieveUserGroupBySearch = (searchWord: string) => apiClient.get(`${API_USER_GROUP_MANAGEMENT_URL}/user-group/search`, {params :{
    searchWord: searchWord
}})

export const removeUserFromUserGroupById = (userInfoId: number) => apiClient.put(`${API_USER_GROUP_MANAGEMENT_URL}/user-group/user/${userInfoId}`)