import { useEffect, useState } from 'react'
import { retrieveMenus } from '../../api/MenuApiService'
import MenuElement from './MenuElement'
import Loading from '../global/Loading'
import PageHeader from '../global/PageHeader'
import { MenuWithNumberOfDishes } from '../../objects/Menu'
import { AxiosError, AxiosResponse } from 'axios'
import { useErrorContext } from '../../context/ErrorContext'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { UserRole } from '../../config/constant'
import { useNavigate } from 'react-router-dom'

function MenuOverview() {
    const checkPermissions = useAuth().checkPermission;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [menus, setMenus] = useState<MenuWithNumberOfDishes[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [permissionEdit, setPermissionEdit] = useState<boolean>(false);
    const errorContext = useErrorContext();

    useEffect(() => {
        setLoader(true)
        retrieveMenus()
            .then((response: AxiosResponse<MenuWithNumberOfDishes[]>) => {
                setMenus(response.data)
            })
            .catch((error: AxiosError) => {
                errorContext.setError(error);
            })
            .finally(() => setLoader(false));

        setPermissionEdit(checkPermissions(UserRole.ROLE_CHEF));
    }, [])

    const handleNAvigate = (path: string): void => {
        navigate(path);
    }

    return (
        <div>
            <section className='container'>
                <PageHeader text={t("menu.overview.header")} withBackButton={true} />
                <div className='row'>
                    {loader ?
                        <Loading />
                        :
                        menus.length === 0 ?
                            <div>
                                <h4 className='text-center text-uppercase py-4'>{t("menu.overview.noMenus")}</h4>
                            </div>
                            :
                            menus.map(
                                (menu, index) => (
                                    <div className='col-12 mb-4' key={index}>
                                        <MenuElement t={t} menu={menu} onClick={handleNAvigate} permissionEdit={permissionEdit} />
                                    </div>
                                )
                            )}
                </div>
            </section>
        </div>
    )
}

export default MenuOverview