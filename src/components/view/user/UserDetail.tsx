import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { addNewUser } from '../../api/UserInfoApiService'
import PageHeader from '../global/PageHeader'
import { UserInfo } from '../../objects/UserInfo'
import { useErrorContext } from '../../context/ErrorContext'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorMessage from '../global/ErrorMessage'

function UserDetail() {
    const {t} = useTranslation();

    const navigate = useNavigate()
    const errorContext = useErrorContext();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassowrd] = useState<string>("");
    const [errorKey, setErrorKey] = useState<string>("");

    const create = (values: UserInfo): void => {

        addNewUser(values)
            .then((response) => {
                console.log(response)
                navigate(`/`)
            })
            .catch((error: AxiosError) => {
                errorContext.setError(error);
            })
    }

    const validate = (): void => {
        const user: UserInfo = {
            name: name,
            email: email,
            password: password
        }

        let error = ""

        if (user.password.trim().length <= 0) {
            error = "errorPassword"; 
        }

        if (user.email.trim().length <= 0) {
            error = "errorEmail";
        }

        if (user.name.trim().length <= 0) {
            error = "errorName"
        }

        if (error.length > 0) {
            setErrorKey(error);
        } else {
            setErrorKey("");
            create(user);
        }
    }


    return (
        <div>
            <section className='container'>
                <div>
                    <PageHeader text='Create new user' />
                </div>
                <ErrorMessage t={t} errorKey={`user.detail.${errorKey}`} isErrorActive={errorKey.length > 0} onClickClose={setErrorKey}/>
                <div className="card">
                    <div className="card-body">
                        <fieldset className="form-group">
                            <label>Name</label>
                            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </fieldset>
                        <fieldset className="form-group mt-2">
                            <label>Email</label>
                            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </fieldset>
                        <fieldset className="form-group mt-2">
                            <label>Password</label>
                            <input className="form-control" type="password" value={password} onChange={(e) => setPassowrd(e.target.value)} />
                        </fieldset>
                    </div>
                </div>
                <div className="ms-2 mt-2">
                    <NavLink className="btn btn-primary me-2" to={`/login`}><i className="fa-solid fa-arrow-left"></i></NavLink>
                    <button className="btn btn-success" type="button" onClick={validate}><i className="fa-regular fa-floppy-disk"></i></button>
                </div>
            </section>
        </div>
    )
}

export default UserDetail