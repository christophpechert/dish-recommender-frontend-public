import { Field, Formik, Form, ErrorMessage } from 'formik';
import { NavLink, useNavigate } from 'react-router-dom';
import { addNewUserGroup } from '../../api/UserGroupApiService';
import PageHeader from '../global/PageHeader';
import { useErrorContext } from '../../context/ErrorContext';
import { AxiosError } from 'axios';
import { UserGroup } from '../../objects/UserGroup';

function UserGroupDetail() {

    const navigate = useNavigate();
    const errorContext = useErrorContext();

    function onSubmit(values: UserGroup) {

        addNewUserGroup(values)
            .then((response) => {
                console.log(response)
                navigate(`/home`)
            })
            .catch((error: AxiosError) => {
                errorContext.setError(error);
            })
    }

    function validate(values: UserGroup) {
        let errors: Partial<UserGroup> = {};

        if (values.name.trim().length < 4) {
            errors.name = "Name have to 4 characters at least"
        }

        return errors
    }

    return (
        <div>
            <section className='container'>
                <Formik initialValues={{
                    name: "",

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
                                    <PageHeader text='Create new user group' />
                                </div>
                                <ErrorMessage
                                    className="alert alert-warning"
                                    name="name"
                                    component="div"
                                />
                                <div className="card">
                                    <div className="card-body">
                                        <fieldset className="form-group">
                                            <label>Name</label>
                                            <Field className="form-control" type="text" name="name" />
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <button className="btn btn-success" type="submit">Save</button>
                                    <NavLink className="btn btn-primary" to={`/home`}>Back to home</NavLink>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </section>
        </div>
    )
}

export default UserGroupDetail