import { AuthenticationRequest } from "../objects/AuthenticationRequest";
import { apiClient } from "./ApiClient";



export const authenticate = (values: AuthenticationRequest) => apiClient.post(`/auth`, values);