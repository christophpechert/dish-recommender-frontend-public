import { AxiosError } from 'axios';
import { ReactNode, createContext, useContext, useState } from 'react'

import { useAuth } from './AuthContext';

interface Data {
    details: string;
    message: string;
    timestamp: string;
}


interface ErrorData {
    statusCode: number;
    errorData: Data;
    isErrorActive: boolean;
    setError: (error: AxiosError) => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorData>({
    statusCode: 0,
    errorData: {
        details: "",
        message: "",
        timestamp: ""
    },
    isErrorActive: false,
    setError: () => { },
    clearError: () => { }
})

export const useErrorContext = () => useContext(ErrorContext);

interface ErrorProviderProps {
    children: ReactNode;
}


export default function ErrorProvider({ children }: ErrorProviderProps) {
    const initData: Data = {
        details: "",
        message: "",
        timestamp: ""
    }

    const authContext = useAuth();

    const [statusCode, setStausCode] = useState<number>(0);
    const [errorData, setErrorData] = useState<Data>(initData);
    const [isErrorActive, setErrorActive] = useState<boolean>(false);

    const setError = (error: AxiosError): void => {
        const response = error.response;
        if (response) {
            setStausCode(response.status);
            setErrorData(response.data as Data);
        }
        setErrorActive(true)

        if (response?.status === 401) {
            clearError();
            authContext.logout();
        }

    }

    const clearError = (): void => {
        setErrorActive(false);
        setStausCode(0);
        setErrorData(initData);
    }


    return (
        <ErrorContext.Provider value={{ statusCode, errorData, isErrorActive, setError, clearError }}>
                { children }
        </ErrorContext.Provider>
    )
}
