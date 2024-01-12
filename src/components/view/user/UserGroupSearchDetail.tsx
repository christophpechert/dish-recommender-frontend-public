import { useEffect, useState } from 'react'
import { UserGroup } from '../../objects/UserGroup'
import { useNavigate } from 'react-router-dom';
import { useErrorContext } from '../../context/ErrorContext';
import { Invite } from '../../objects/Invite';

type InviteFunction = (userGroupId: number) => void;

function UserGroupSearchDetail(props: { userGroup: UserGroup, invites: Invite[],  sendInvite: InviteFunction, retractInvite: InviteFunction}) {

    const [isInviteActive, setInviteActive] = useState<boolean>(false);

    function sendInvite(): void {
        props.sendInvite(props.userGroup.id!);
    }

    function retractInvite(): void {
        props.retractInvite(props.userGroup.id!);
    }

    function checkInvites(userGroup: UserGroup, activeInvites: Invite[]): boolean {
        
        for (let activeInvite of activeInvites) {
            if (activeInvite.userGroup?.id === userGroup.id) {
                return true;
            }
        }

        return false;
    }

    useEffect(() => {
        setInviteActive(checkInvites(props.userGroup, props.invites));
    }, [props.invites])

    return (
        <div className="card shadow">
            <div className="card-body">
                <h5 className="card-title">{props.userGroup.name}</h5>
                {!isInviteActive && <button className='btn btn-primary' type='button' onClick={sendInvite}>Invite</button>}
                {isInviteActive && <button className='btn btn-danger' type='button' onClick={retractInvite}>Retract</button>}
            </div>
        </div>
    )
}

export default UserGroupSearchDetail