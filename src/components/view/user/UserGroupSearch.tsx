import { Field, Formik, Form, ErrorMessage } from "formik";
import PageHeader from "../global/PageHeader";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserGroup } from "../../objects/UserGroup";
import { retrieveUserGroupBySearch } from "../../api/UserGroupApiService";
import { useErrorContext } from "../../context/ErrorContext";
import UserGroupSearchDetail from "./UserGroupSearchDetail";
import Loading from "../global/Loading";
import { addInviteToUserGroup, retractInvite, retrieveAllActiveInvitesFromUser } from "../../api/InviteApiService";
import { AxiosError, AxiosResponse } from "axios";
import { Invite } from "../../objects/Invite";
import { InviteStatus } from "../../config/constant";

function UserGroupSearch() {

    interface FormikValues {
        searchword: string;
    }

    const navigate = useNavigate();
    const errorContext = useErrorContext();

    const [loader, setLoader] = useState<boolean>(false);
    const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
    const [activeInvites, setActiveInvites] = useState<Invite[]>([]);

    const initialValues: FormikValues = {
        searchword: ""
    }

    function send(userGroupId: number): void {
        const invite: Invite = {
            message: "new invite"
        }
        addInviteToUserGroup(userGroupId, invite)
            .then(response => {
                const newInvite: Invite = response.data;

                if (newInvite.status === InviteStatus.ACCEPTED) {
                    navigate("/home");
                }

                setActiveInvites(prevActiveInvites => [...prevActiveInvites, newInvite]);
            })
            .catch((error: AxiosError) => {
                errorContext.setError(error);
            })
    }

    function retract(userGroupId: number): void {
        const inviteId: number | undefined = activeInvites.filter(e => e.userGroup?.id === userGroupId)[0].id
        if (inviteId) {
            retractInvite(inviteId)
                .then((response: AxiosResponse<Invite>) => {
                    console.log(response.data)
                    let newActiveInvites = [...activeInvites];
                    let filteredActiveInvites = newActiveInvites.filter(e => e.id !== response.data.id)
                    console.log(filteredActiveInvites);
                    setActiveInvites(filteredActiveInvites);
                })
                .catch((error: AxiosError) => {
                    errorContext.setError(error);
                })
        }
    }

    useEffect(() => {
        retrieveAllActiveInvitesFromUser()
            .then((response: AxiosResponse<Invite[]>) => {
                setActiveInvites(response.data)
            })
            .catch((error: AxiosError) => {
                errorContext.setError(error);
            })
    }, [])

    function onSubmit(values: FormikValues) {
        setLoader(true);
        retrieveUserGroupBySearch(values.searchword)
            .then((response: AxiosResponse<UserGroup[]>) => {
                console.log(response.data);
                setUserGroups(response.data);
            })
            .catch((error: AxiosError) => {
                errorContext.setError(error);
            })
            .finally(() => setLoader(false));
    }

    function validate(values: FormikValues) {

        let errors: Partial<FormikValues> = {};

        if (values.searchword.trim().length < 4) {
            errors.searchword = "Search word have to 4 characters at least";
        }

        return errors
    }

    return (
        <div>
            <section className='container'>
                <Formik initialValues={initialValues}
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
                                    <PageHeader text="Searching for Usergroups" />
                                </div>
                                <ErrorMessage
                                    className="alert alert-warning"
                                    name="searchword"
                                    component="div"
                                />
                                <div className="card shadow">
                                    <div className="card-body">
                                        <fieldset className="form-group">
                                            <label>
                                                Search word
                                            </label>
                                            <Field className="form-control" type="text" name="searchword" />
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <button className="btn btn-success" type="submit">search</button>
                                    <NavLink className="btn btn-primary" to={`/home`}>Back to home</NavLink>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </section>
            <section className='container mt-3'>
                {loader ?
                    <Loading />
                    :
                    <div>
                        {userGroups.length > 0 && <h4 className='text-center text-uppercase py-4'>Results</h4>}
                        {userGroups.length === 0 && <h4 className='text-center text-uppercase py-4'>No results found</h4>}
                        <div className="row">
                            {userGroups.map((userGroup, index) => (
                                <div className='col-lg-4 col-md-4 col-sm-6 mb-4' key={index}>
                                    <UserGroupSearchDetail
                                        userGroup={userGroup}
                                        invites={activeInvites}
                                        sendInvite={send}
                                        retractInvite={retract}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </section>

        </div>
    )
}

export default UserGroupSearch