import { useEffect, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { addNewKeyword, deleteKeywordById, retrieveAllKeywords, retrieveKeywordById, updateKeyword } from '../../api/KeywordApiService'
import Loading from '../global/Loading'
import { NEW_ELEMENT, UserRole } from '../../config/constant'
import { useErrorContext } from '../../context/ErrorContext'
import { Keyword } from '../../objects/Keyword'
import { AxiosError, AxiosResponse } from 'axios'
import PageHeader from '../global/PageHeader'
import ResponseModal from '../global/ResponseModal'
import { useTranslation } from 'react-i18next'
import DeleteModal from '../global/DeleteModal'
import { useAuth } from '../../context/AuthContext'

function KeywordDetail() {
    const { t } = useTranslation();
    const { keywordId } = useParams<{ keywordId: string }>();
    const checkPermission = useAuth().checkPermission;
    const errorContext = useErrorContext();

    const navigate = useNavigate();

    const [name, SetName] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    const [permissionDelete, setPermissionDelete] = useState<boolean>(false);
    const [permissionSave, setPermissionSave] = useState<boolean>(false);


    useEffect(() => {
        if (keywordId && keywordId !== NEW_ELEMENT) {
            setLoader(true);
            retrieveKeywordById(keywordId)
                .then((response: AxiosResponse<Keyword>) => {
                    SetName(response.data.name);
                })
                .catch((error: AxiosError) => {
                    errorContext.setError(error);
                })
                .finally(() => {
                    setLoader(false)
                })
        }
        setPermissionSave(checkPermission(UserRole.ROLE_CHEF));
        setPermissionDelete(checkPermission(UserRole.ROLE_OWNER));
    }, [keywordId]
    )

    function onSubmit(values: Keyword) {

        if (keywordId === NEW_ELEMENT) {
            addNewKeyword(values)
                .then((response: AxiosResponse<Keyword>) => {
                    SetName(response.data.name);
                    setShow(true);
                })
                .catch((error) => {
                    errorContext.setError(error);
                })
        } else {
            if (keywordId) {
                updateKeyword(keywordId, values)
                    .then((response) => {
                        navigate(`/keyword`)
                    })
                    .catch((error) => {
                        errorContext.setError(error);
                    })
            }
        }
    }

    async function validate(values: Keyword) {
        let errors: Partial<Keyword> = {};

        const response = await retrieveAllKeywords();
        const keywords: Keyword[] = response.data;
        const errorMessage = (element: string): string => {
            return t("keyword.detail.errMsg1", {name: name});
        }

        for (let keyword of keywords) {
            if (keywordId === NEW_ELEMENT) {
                if (keyword.name.toLowerCase() === values.name.toLowerCase()) {
                    errors.name = errorMessage(values.name);
                    break;
                }
            } else {
                if (keywordId) {
                    try {
                        const id = parseInt(keywordId)
                        if (keyword.name.toLowerCase() === values.name.toLowerCase() && keyword.id !== id) {
                            errors.name = errorMessage(values.name);
                            break;
                        }
                    } catch (error) {
                        errors.name = t("keyword.detail.errMsg2");
                    }

                }
            }
        }

        if (values.name.trim().length === 0) {
            errors.name = t("keyword.detail.errMsg3");
        }

        return errors
    }

    function deleteKeyword() {
        if (keywordId) {
            deleteKeywordById(keywordId)
                .then((response) => {
                    navigate(`/keyword`);
                })
                .catch((error) => errorContext.setError(error));
        }
    }

    const handleAnotherKeyword = () => {
        setShow(false);
        SetName("");
    }

    const handleNotAnotherKeyword = () => {
        handleAnotherKeyword();
        navigate(`/home`);
    }

    return (
        <div>
            <ResponseModal t={t} local="responseModalCreateKeyword" name={name} show={show} onClickYes={handleAnotherKeyword} onClickNo={handleNotAnotherKeyword} />
            <section className='container'>
                <Formik initialValues={{
                    name: name,

                }}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                    validate={validate}

                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {
                        (props) => (
                            <Form>
                                <div>
                                    {keywordId && keywordId !== NEW_ELEMENT ?
                                        <PageHeader text={t("keyword.detail.headerUpdate")} />
                                        :
                                        <PageHeader text={t("keyword.detail.headerNew")} />
                                    }
                                </div>
                                {loader ?
                                    <Loading />
                                    :
                                    <div>
                                        <ErrorMessage
                                            className="alert alert-warning"
                                            name="name"
                                            component="div"
                                        />
                                        <div className="card shadow">
                                            <div className="card-body">
                                                <fieldset className="form-group">
                                                    <label>{t("keyword.detail.name")}</label>
                                                    <Field className="form-control" type="text" name="name" />
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div className='ms-2 mt-2'>
                                            <button className="btn btn-primary" type='button' onClick={() => navigate(-1)}>
                                                <i className="fa-solid fa-arrow-left"></i>
                                            </button>
                                            <button className="btn btn-success ms-2" type="submit" disabled={!permissionSave}>
                                                <i className="fa-regular fa-floppy-disk"></i>
                                            </button>
                                            {(keywordId && keywordId !== NEW_ELEMENT) && <DeleteModal className='ms-2' t={t} name={name} onClick={deleteKeyword} disabled={!permissionDelete}/>}
                                        </div>
                                    </div>
                                }
                            </Form>
                        )
                    }
                </Formik>
            </section>
        </div>
    )
}

export default KeywordDetail