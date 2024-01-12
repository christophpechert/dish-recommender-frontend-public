import { Invite } from "../../objects/Invite"

type HandleInviteFunction = (inviteId: number) => void;

function UserGroupInvite(props: { invite: Invite, disabled: boolean, handleAccept: HandleInviteFunction, handleReject: HandleInviteFunction }) {

    function handleAccept(): void {
        props.handleAccept(props.invite.id!)
    }

    function handleReject(): void {
        props.handleReject(props.invite.id!)
    }

    return (
        <div>
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">{props.invite.userInfo?.name}</h5>
                    <p className="card-text">{props.invite.message}</p>
                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-success"
                            style={{ width: "80px" }}
                            onClick={handleAccept}
                            disabled={props.disabled}
                        >
                            Accept
                        </button>
                        <button
                            className="btn btn-danger"
                            style={{ width: "80px" }}
                            onClick={handleReject}
                            disabled={props.disabled}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserGroupInvite