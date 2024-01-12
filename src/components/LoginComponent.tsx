import { useState } from "react"
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useNavigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { useTranslation } from "react-i18next"
import { AuthenticationRequest } from "./objects/AuthenticationRequest"
import { NEW_ELEMENT } from './config/constant';
import PageHeader from './view/global/PageHeader';

export default function LoginComponent() {
    const { t } = useTranslation()

    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate()
    const authContext = useAuth()

    async function onSubmit(values: AuthenticationRequest) {
        authContext.login(values)
            .then(() => {
                authContext.checkDevice();
                navigate(`/home`)
            })
            .catch((error: string) => setErrorMessage(error))
        
    }

    function validate(values: AuthenticationRequest) {
        let errors: Partial<AuthenticationRequest> = {};

        if (values.username.trim().length < 1) {
            errors.username = "Username must not be blank!"
        }

        if (values.password.trim().length < 1) {
            errors.password = "Password must not be blank!"
        }

        return errors
    }

    function createNew() {
        navigate(`/user/${NEW_ELEMENT}`)
    }

    function closeMessage() {
        setErrorMessage("");
    }

    return (
        <div>
            <section className='container'>
                <Formik initialValues={{
                    username: "",
                    password: ""

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
                                    <PageHeader text={t('loginComponent.login')} />
                                    {errorMessage.length > 0 &&
                                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                            {errorMessage}
                                            <button type="button" className="btn-close" onClick={closeMessage}></button>
                                        </div>
                                    }
                                </div>
                                <ErrorMessage className="alert alert-warning" name="username" component="div" />
                                <ErrorMessage className="alert alert-warning" name="password" component="div" />
                                <div className="card shadow">
                                    <div className="card-body">
                                        <fieldset className="form-group">
                                            <label>{t("loginComponent.username")}</label>
                                            <Field className="form-control" type="text" name="username" />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <label>{t("loginComponent.password")}</label>
                                            <Field className="form-control" type="password" name="password" />
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="mt-2 ms-2">
                                    <button className="btn btn-success me-2" type="submit"><i className="fa-solid fa-right-to-bracket"></i></button>
                                    {/* <button className="btn btn-primary" type="button" onClick={createNew}>{t("loginComponent.button.createNew")}</button> */}
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </section>
        </div>
    )
}