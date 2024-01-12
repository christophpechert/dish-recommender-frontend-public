import { API_INVITE_MANAGEMENT_URL } from "../config/constant";
import { Invite } from "../objects/Invite";
import { apiClient } from "./ApiClient";

export const addInviteToUserGroup = (userGroupId: number, invite: Invite) => apiClient.post(`${API_INVITE_MANAGEMENT_URL}/invite/user-group/${userGroupId}`, invite);

export const retrieveAllActiveInvitesFromUser = () => apiClient.get(`${API_INVITE_MANAGEMENT_URL}/invite/user`);

export const retrieveAllActiveInvitesFromUserGroupById = (userGroupId: number) => apiClient.get(`${API_INVITE_MANAGEMENT_URL}/invite/user-group/${userGroupId}`);

export const retractInvite = (inviteId: number) => apiClient.put(`${API_INVITE_MANAGEMENT_URL}/invite/${inviteId}/retract`);

export const acceptInvite = (inviteId: number) => apiClient.put(`${API_INVITE_MANAGEMENT_URL}/invite/${inviteId}/accept`);

export const rejectInvite = (inviteId: number) => apiClient.put(`${API_INVITE_MANAGEMENT_URL}/invite/${inviteId}/reject`);