import { useEffect, useState } from "react"
import { UserGroup } from "../../objects/UserGroup"
import PageHeader from "../global/PageHeader"
import { removeUserFromUserGroupById, retrieveUserGroupWithAllUsers } from "../../api/UserGroupApiService";
import { AxiosError, AxiosResponse } from "axios";
import { useErrorContext } from "../../context/ErrorContext";
import UserInUserGroupDetail from "./UserInUserGroupDetail";
import { UserRole } from "../../config/constant";
import { changeUserRoleByIdAndRole } from "../../api/UserInfoApiService";
import { UserInfo } from "../../objects/UserInfo";
import { Invite } from "../../objects/Invite";
import { acceptInvite, rejectInvite, retrieveAllActiveInvitesFromUserGroupById } from "../../api/InviteApiService";
import UserGroupInvite from "./UserGroupInvite";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../global/Loading";

function UserGroupAdministration() {

    const authContext = useAuth();
    const errorContext = useErrorContext();
    const navigate = useNavigate();

    const [isAuthenticatedUser, setAuthenticatedUser] = useState<boolean>(false);
    const [userGroup, setUserGroup] = useState<UserGroup>();
    const [invites, setInvites] = useState<Invite[]>([]);
    const [isDisabled, setDisable] = useState<boolean>(true)
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        setLoader(true);
        retrieveUserGroupWithAllUsers()
            .then((response: AxiosResponse<UserGroup>) => {
                const userGroup = response.data;
                setUserGroup(userGroup);

                const isUserOwner = userGroup.userInfos!.some(e => e.name === authContext.username && e.role === UserRole.ROLE_OWNER);
                const checkUser = userGroup.userInfos!.some(e => e.name === authContext.username);

                setAuthenticatedUser(checkUser)
                setDisable(!isUserOwner);

                retrieveAllActiveInvitesFromUserGroupById(response.data.id!)
                    .then((response: AxiosResponse<Invite[]>) => {
                        setInvites(response.data);
                    })
            })
            .catch((error: AxiosError) => errorContext.setError(error))
            .finally(() => setLoader(false));
    }, [])

    function changeRole(userInfoId: number, role: UserRole): void {
        changeUserRoleByIdAndRole(userInfoId, role)
            .then((response: AxiosResponse<UserInfo>) => {
                const user = response.data;

                let newUserGroup = { ...userGroup };

                for (let index in newUserGroup?.userInfos!) {
                    if (newUserGroup.userInfos![index].id === user.id) {
                        newUserGroup.userInfos![index] = user;
                    }
                }

                setUserGroup(newUserGroup as UserGroup);


            })
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    function removeUser(userInfoId: number): void {
        console.log(userInfoId)
        removeUserFromUserGroupById(userInfoId)
            .then((response: AxiosResponse<UserGroup>) => {
                setUserGroup(response.data)
                navigate("/home");
            })
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    function handleAccept(inviteId: number): void {
        acceptInvite(inviteId)
            .then((response: AxiosResponse<Invite>) => {
                updateInvites(response.data.id!)
                retrieveUserGroupWithAllUsers()
                    .then((response: AxiosResponse<UserInfo>) => setUserGroup(response.data))
                    .catch((error: AxiosError) => errorContext.setError(error));

            })
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    function handleReject(inviteId: number): void {
        rejectInvite(inviteId)
            .then((response: AxiosResponse<Invite>) => updateInvites(response.data.id!))
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    function updateInvites(inviteId: number): void {
        let indexToRemove: number;
        invites.forEach((e, index) => {
            if (e.id === inviteId) {
                indexToRemove = index;
            }
        })

        let newInvites = invites.filter(e => e.id !== inviteId);

        setInvites(newInvites);
    }

    return (
        <div>
            <section className='container'>
                <PageHeader text='User Group Administration' withBackButton={true}/>
                {loader ?
                    <Loading />
                    :
                    <div>
                        <div className="card shadow" >
                            <div className="card-body">
                                <h5 className="card-title">{userGroup?.name}</h5>
                                {userGroup && userGroup.userInfos?.map((userInfo, index) => (
                                    <div className='mb-2' key={index}>
                                        <UserInUserGroupDetail user={userInfo} changeRole={changeRole} removeUser={removeUser} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {invites.length <= 0 ?
                            <h4 className="text-center my-4">No active invites</h4>
                            :
                            <div>
                                <h4 className="text-center my-4">Active Invites</h4>
                                <div className="row">
                                    {invites.map((invite, index) => (
                                        <div className='col-lg-2 col-md-4 col-sm-12 mb-4' key={index}>
                                            <UserGroupInvite invite={invite} disabled={isDisabled} handleAccept={handleAccept} handleReject={handleReject} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>}
            </section>
        </div>
    )
}

export default UserGroupAdministration