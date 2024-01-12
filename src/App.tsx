import React, { ReactNode, Suspense, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginComponent from './components/LoginComponent';
import Home from './components/Home';
import AuthProvider, { useAuth } from './components/context/AuthContext';
import LogoutComponent from './components/LogoutComponent';
import UserDetail from './components/view/user/UserDetail';
import UserGroupDetail from './components/view/user/UserGroupDetail';
import MenuDetail from './components/view/menu/MenuDetail';
import DishOverview from './components/view/dish/DishOverview';
import MenuOverview from './components/view/menu/MenuOverview';
import AllDishes from './components/view/dish/AllDishes';
import KeywordDetail from './components/view/keyword/KeywordDetail';
import KeywordOverview from './components/view/keyword/KeywordOverview';
import DataOverview from './components/view/data/DataOverview';
import ErrorPage from './components/ErrorPage';
import ErrorProvider, { useErrorContext } from './components/context/ErrorContext';
import UserGroupSearch from './components/view/user/UserGroupSearch';
import UserGroupAdministration from './components/view/user/UserGroupAdministration';
import RecommendationCreation from './components/view/recommendation/RecommendationCreation';
import RecommendationOverview from './components/view/recommendation/RecommendationOverview';
import RecommendationDishes from './components/view/recommendation/RecommendationDishes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import i18next from 'i18next';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import { useTranslation } from 'react-i18next';
import DishDetailNew from './components/view/dish/DishDetailNew';
import DishImages from './components/view/dish/DishImages';


export function AuthenticatedRoute({ children }: { children: ReactNode }) {
    const authContext = useAuth();
    const errorContext = useErrorContext();
    if (authContext.isAuthenticated) {
        if (errorContext.isErrorActive) {
            return <Navigate to="/error" />;
        }
        return children as JSX.Element;
    } else {
        return <Navigate to="/login" />;
    }
}

function App() {
    const [locales, setLocales] = useState<string>("en");
    const { t } = useTranslation()

    useEffect(() => {
        setLocales(i18next.language);
    }, [t])

    return (
        <div>
            <Suspense fallback="...is loading">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>
                    <AuthProvider>
                        <ErrorProvider>
                            <BrowserRouter>
                                <NavBar />
                                <Routes>
                                    <Route path="/" element={<LoginComponent />} />
                                    <Route path="/login" element={<LoginComponent />} />
                                    <Route path="/error" element={<ErrorPage />} />
                                    <Route path="/logout" element={<LogoutComponent />} />


                                    <Route path="/home" element={
                                        <AuthenticatedRoute>
                                            <Home />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path="/user-group-administration" element={
                                        <AuthenticatedRoute>
                                            <UserGroupAdministration />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path="/user-group" element={
                                        <AuthenticatedRoute>
                                            <UserGroupDetail />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path="/user-group/search" element={
                                        <AuthenticatedRoute>
                                            <UserGroupSearch />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path="/menu/:menuId" element={
                                        <AuthenticatedRoute>
                                            <MenuDetail />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path='/menu' element={
                                        <AuthenticatedRoute>
                                            <MenuOverview />
                                        </AuthenticatedRoute>
                                    } />


                                    <Route path='/user/:userId' element={
                                        <UserDetail />
                                    } />


                                    <Route path='/dish/menu/:menuId' element={
                                        <AuthenticatedRoute>
                                            <DishOverview />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path='/dish/:dishId' element={
                                        <AuthenticatedRoute>
                                            <DishDetailNew />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path='/dish' element={
                                        <AuthenticatedRoute>
                                            <AllDishes />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path='/keyword' element={
                                        <AuthenticatedRoute>
                                            <KeywordOverview />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path='/keyword/:keywordId' element={
                                        <AuthenticatedRoute>
                                            <KeywordDetail />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path='/image/dish/:dishId' element={
                                        <AuthenticatedRoute>
                                            <DishImages />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path='/import-export' element={
                                        <AuthenticatedRoute>
                                            <DataOverview />
                                        </AuthenticatedRoute>
                                    } />

                                    <Route path="/newRecommendation/menu/:menuId" element={
                                        <AuthenticatedRoute>
                                            <RecommendationCreation />
                                        </AuthenticatedRoute>
                                    } />
                                    <Route path="/recommendation/menu/:menuId" element={
                                        <AuthenticatedRoute>
                                            <RecommendationOverview />
                                        </AuthenticatedRoute>
                                    } />
                                    <Route path="/dish/recommendation/:recommendationId" element={
                                        <AuthenticatedRoute>
                                            <RecommendationDishes />
                                        </AuthenticatedRoute>
                                    } />
                                </Routes>
                            </BrowserRouter>
                        </ErrorProvider>
                    </AuthProvider>
                </LocalizationProvider>
            </Suspense>
        </div >
    );
}

export default App;
