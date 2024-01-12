import { createContext, useContext, useState, ReactNode } from "react";
import { authenticate } from "../api/AuthApiService";
import { AuthenticationRequest } from "../objects/AuthenticationRequest";
import { apiClient } from '../api/ApiClient';
import { AxiosError, AxiosResponse } from 'axios';
import { useErrorContext } from './ErrorContext';
import { UserRole } from "../config/constant";

interface AuthContextType {
    username: string;
    isAuthenticated: boolean;
    isInUserGroup: boolean;
    isMobile: boolean;
    login: (values: AuthenticationRequest) => Promise<string>;
    logout: () => void;
    checkPermission: (role: UserRole) => boolean;
    setUserInUserGroup: (inUserGroup: boolean) => void;
    checkDevice: () => void;
}

interface Data {
    details: string;
    message: string;
    timestamp: string;
}

interface AuthenticationResponse {
    bearerToken: string;
    roles: UserRole[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const errorContext = useErrorContext();
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [isInUserGroup, setUserGroup] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [roles, setUserRoles] = useState<UserRole[]>([])
    const [isMobile, setIsMobile] = useState<boolean>(false);

    function login(auth: AuthenticationRequest): Promise<string> {
        return new Promise((resolve, reject) => {
            authenticate(auth)
                .then((response: AxiosResponse<AuthenticationResponse>) => {
                    if (response.status === 200) {
                        setAuthenticated(true);
                        errorContext.clearError();
                        setUsername(auth.username);
                        setUserRoles([...response.data.roles]);
                        const jwtToken = "Bearer " + response.data.bearerToken;

                        apiClient.interceptors.request.use(
                            (config) => {
                                config.headers.Authorization = jwtToken
                                return config
                            }
                        )
                        resolve("");
                    } else {
                        logout();
                        reject("Undefined");
                    }
                })
                .catch((error: AxiosError<Data>) => {
                    logout();
                    reject(error.response?.data.message);
                })
        });
      }


    function logout() {
        setAuthenticated(false);
        setUserGroup(false);
        setUsername("");
        apiClient.interceptors.request.clear();
    }

    function setUserInUserGroup(inUserGroup: boolean): void {
        setUserGroup(inUserGroup);
    }

    function checkPermission(role: UserRole): boolean {
        return roles.includes(role);
    }

    function checkDevice(): void {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log(isMobile);
        setIsMobile(isMobile);
    }

    return (
        <AuthContext.Provider value={{ username, isAuthenticated, isInUserGroup, isMobile, login, logout, checkPermission, setUserInUserGroup, checkDevice: checkDevice }}>
            {children}
        </AuthContext.Provider>
    );
}
