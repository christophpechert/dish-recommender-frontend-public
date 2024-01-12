import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserInfo } from "../../objects/UserInfo"
import { UserRole } from "../../config/constant";

type ChangeRoleFunction = (userInfoId: number, role: UserRole) => void;
type RemoveUserFunction = (userInfoId: number) => void;
type HandleRoleChangeFunction = (e: ChangeEvent<HTMLInputElement>) => void;

const Radiobutton = (props: { user: UserInfo, changedRole: UserRole, onChange: HandleRoleChangeFunction, disabled: boolean, value: UserRole, text: string}) => (
    <div className="form-check form-check-inline">
        <input
            className="form-check-input"
            type="radio"
            name={`UserInUserGroupDetail${props.user.id!}`}
            id={`UserInUserGroupDetail${props.user.id!}Choice_${props.value}`}
            value={props.value}
            onChange={(e) => props.onChange(e)}
            disabled={props.disabled}
            checked={props.changedRole === props.value}
        />
        <label className="form-check-label">{props.text}</label>
    </div>
);

function UserInUserGroupDetail(props: { user: UserInfo, changeRole: ChangeRoleFunction, removeUser: RemoveUserFunction }) {
    const authContext = useAuth();
    

    const [isAuthenticatedUser, setAuthenticatedUser] = useState<boolean>(false);
    const [changedRole, setChangedRole] = useState<UserRole>(props.user.role!);
    const [disable, setDisable] = useState<boolean>(false);

    useEffect(() => {
        const self = props.user.name === authContext.username;

        setAuthenticatedUser(self);

        if (props.user.role! === UserRole.ROLE_OWNER || self) {
            setDisable(true);
        } else {
            setDisable(false);
        }

        setChangedRole(props.user.role!);

    }, [props.user])

    function handleRoleChange(e: ChangeEvent<HTMLInputElement>): void {
        const roleEnum = UserRole[e.currentTarget.value as keyof typeof UserRole];
        setChangedRole(roleEnum);
    }

    function changeRole(): void {
        props.changeRole(props.user.id!, changedRole);
    }

    function removeUser(): void {
        props.removeUser(props.user.id!);
    }

    return (
        <div>
            <div className="d-flex flex-row justify-content-between">
                <div>{props.user.name}</div>
                <div id={`UserInUserGroupDetail${props.user.id!}`} >
                    <Radiobutton user={props.user} changedRole={changedRole} onChange={handleRoleChange} disabled={disable} value={UserRole.ROLE_OWNER} text="Owner" />
                    <Radiobutton user={props.user} changedRole={changedRole} onChange={handleRoleChange} disabled={disable} value={UserRole.ROLE_CHEF} text="Chef" />
                    <Radiobutton user={props.user} changedRole={changedRole} onChange={handleRoleChange} disabled={disable} value={UserRole.ROLE_WAITER} text="Waiter" />
                    <Radiobutton user={props.user} changedRole={changedRole} onChange={handleRoleChange} disabled={disable} value={UserRole.ROLE_GUEST} text="Guest" />
                    <button
                        className={props.user.role !== changedRole ? "btn btn-warning" : "btn btn-warning disabled"}
                        disabled={disable}
                        onClick={changeRole}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                        className="btn btn-danger ms-2"
                        disabled={disable && !isAuthenticatedUser}
                        onClick={removeUser}
                    >
                        <i className="fa-solid fa-door-open"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserInUserGroupDetail