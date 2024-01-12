import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { addNewMenu, deleteMenuById, retrieveMenuWithDishes, updateMenu } from '../../api/MenuApiService'
import { NEW_ELEMENT, UserRole } from '../../config/constant'
import PageHeader from '../global/PageHeader'
import { Menu } from '../../objects/Menu'
import { AxiosError, AxiosResponse } from 'axios'
import { useErrorContext } from '../../context/ErrorContext'
import DeleteModal from '../global/DeleteModal'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import ResponseModal from '../global/ResponseModal'


function MenuDetail() {
    const { t } = useTranslation();

    const checkPermission = useAuth().checkPermission;

    const { menuId } = useParams<{ menuId: string }>();
    const errorContext = useErrorContext();
    const [show, setShow] = useState<boolean>(false);

    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [permissionDelete, setPermissionDelete] = useState<boolean>(false);
    const [permissionSave, setPermissionSave] = useState<boolean>(false);

    useEffect(() => {
        if (menuId && menuId !== NEW_ELEMENT) {
            retrieveMenuWithDishes(menuId)
                .then((response: AxiosResponse<Menu>) => {
                    const menu: Menu = response.data;
                    setName(menu.name);
                    setDescription(menu.description);
                })
                .catch((error: AxiosError) => {
                    errorContext.setError(error);
                })
        }
        setPermissionSave(checkPermission(UserRole.ROLE_CHEF));
        setPermissionDelete(checkPermission(UserRole.ROLE_OWNER));
    }, [menuId])

    function deleteMenu() {
        if (menuId) {
            deleteMenuById(menuId)
                .then((response) => {
                    navigate(`/menu`);
                })
                .catch((error: AxiosError) => errorContext.setError(error));
        }
    }

    const save = (menu: Menu) => {

        if (menuId) {
            if (menuId === NEW_ELEMENT) {
                addNewMenu(menu)
                    .then((response) => {
                        setShow(true);
                    })
                    .catch((error: AxiosError) => errorContext.setError(error));

            } else {
                updateMenu(menuId, menu)
                    .then((response) => {
                        navigate(`/menu`);
                    })
                    .catch((error: AxiosError) => errorContext.setError(error));
            }
        }
    }

    const validate = () => {
        const menu: Menu = {
            name: name,
            description: description
        }

        let error = "";

        if (menu.description.trim().length === 0) {
            error = "menu.detail.errorDescriptionBlank"
        }

        if (menu.name.trim().length === 0) {
            error = "menu.detail.errorNameBlank";
        }

        if (error.length > 0) {
            setErrorMessage(error);
        } else {
            setErrorMessage("");
            save(menu);
        }

    }

    const handleAnotherMenu = () => {
        setShow(false);
        setName("");
        setDescription("");
    }

    const handleNotAnotherMenu = () => {
        handleAnotherMenu();
        navigate(`/home`);
    }

    const closeMessage = () => {
        setErrorMessage("");
    }

    return (
        <div>
            <ResponseModal t={t} local="responseModalCreateMenu" name={name} show={show} onClickYes={handleAnotherMenu} onClickNo={handleNotAnotherMenu} />
            <section className='container'>
                <PageHeader text={(menuId && menuId === NEW_ELEMENT) ? t("menu.detail.headerNew") : t("menu.detail.headerUpdate")} />
                {errorMessage.length > 0 &&
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        {t(errorMessage)}
                        <button type="button" className="btn-close" onClick={closeMessage}></button>
                    </div>
                }
                <div className="card shadow">
                    <div className="card-body">
                        <fieldset className="form-group">
                            <label>{t("menu.detail.name")}</label>
                            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </fieldset>
                        <fieldset className="form-group mt-2">
                            <label>{t("menu.detail.description")}</label>
                            <input className="form-control" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </fieldset>
                    </div>
                </div>
                <div className="ms-2 mt-2">
                    <NavLink className="btn btn-primary me-2" to={(menuId && menuId === NEW_ELEMENT) ? "/home" : "/menu"}>
                        <i className="fa-solid fa-arrow-left" />
                    </NavLink>
                    <button className="btn btn-success" type="button" onClick={validate} disabled={!permissionSave}>
                        <i className="fa-regular fa-floppy-disk" />
                    </button>
                    {(menuId && menuId !== NEW_ELEMENT) && <DeleteModal className='ms-2' t={t} name={name} onClick={deleteMenu} disabled={!permissionDelete} />}
                </div>
            </section >
        </div >
    )
}

export default MenuDetail