import axios from "axios"
import { API_BASE_URL } from "../config/constant"


export const apiClient = axios.create(
    {
        baseURL: API_BASE_URL
    }
)