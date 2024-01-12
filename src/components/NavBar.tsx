import { NavLink } from 'react-router-dom'
import i18n from './locales/i18n';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import { NEW_ELEMENT, UserRole } from './config/constant';
import { useErrorContext } from './context/ErrorContext';
import { useEffect, useState } from 'react';

type Language = {
    [key: string]: { nativeName: string };
};

const lngs: Language = {
    en: { nativeName: 'en' },
    de: { nativeName: 'de' },
};

export default function NavBar() {
    const { t, i18n } = useTranslation();

    const authContext = useAuth();
    const errorContext = useErrorContext();
    const isAutenticated = authContext.isAuthenticated;
    const isInUserGroup = authContext.isInUserGroup;
    const hasError = errorContext.isErrorActive;

    const [permissionCreate, setPermissionCreate] = useState<boolean>(false);

    function logout() {
        errorContext.clearError();
        authContext.logout();
    }

    useEffect(() => {
        setPermissionCreate(authContext.checkPermission(UserRole.ROLE_CHEF));
    })

    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <div className="navbar-brand text-uppercase">Dish recommender</div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                {isAutenticated && <NavLink className="nav-link" aria-current="page" to={`/home`} onClick={() => errorContext.clearError()}>{t("navBar.home")}</NavLink>}
                            </li>
                            <li className="nav-item">
                                {(isAutenticated && isInUserGroup && !hasError) && <NavLink className="nav-link" to={`/user-group-administration`}>{t("navBar.userGroup")}</NavLink>}
                            </li>
                            <li className="nav-item">
                                {(isAutenticated && isInUserGroup && !hasError) && <NavLink className="nav-link" to={`/menu`}>{t("navBar.menus")}</NavLink>}
                            </li>
                            <li className="nav-item">
                                {(isAutenticated && isInUserGroup && !hasError) && <NavLink className="nav-link" to={`/dish`}>{t("navBar.dishes")}</NavLink>}
                            </li>
                            <li className="nav-item">
                                {(isAutenticated && isInUserGroup && !hasError) && <NavLink className="nav-link" to={`/keyword`}>{t("navBar.keywords")}</NavLink>}
                            </li>
                            {(isAutenticated && isInUserGroup && !hasError) && <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {t("navBar.create")}
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <NavLink className={permissionCreate ? "nav-link" : "nav-link disabled"} to={`/dish/${NEW_ELEMENT}`}>{t("navBar.newDish")}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={permissionCreate ? "nav-link" : "nav-link disabled"} to={`/menu/${NEW_ELEMENT}`}>{t("navBar.newMenu")}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={permissionCreate ? "nav-link" : "nav-link disabled"} to={`/keyword/${NEW_ELEMENT}`}>{t("navBar.newKeyword")}</NavLink>
                                    </li>
                                </ul>
                            </li>}
                            <li className="nav-item">
                                {(isAutenticated && isInUserGroup && !hasError) && <NavLink className="nav-link" to={`/import-export`}>{t("navBar.data")}</NavLink>}
                            </li>
                        </ul>

                        <div className="d-flex align-items-center">

                            {!isAutenticated && <NavLink className="nav-link" to="/login">{t("navBar.login")}</NavLink>}

                            {isAutenticated && <NavLink className="nav-link" to="/logout" onClick={logout}>{t("navBar.logout")}</NavLink>}

                            <div className="btn-group ps-2">
                                {Object.keys(lngs).map((lng: string) => (
                                    <button className={i18n.resolvedLanguage === lng ? 'btn btn-primary active btn-sm' : 'btn btn-primary btn-sm'} key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
                                        {lngs[lng].nativeName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    )
}
