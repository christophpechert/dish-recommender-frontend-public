import PageHeader from "./view/global/PageHeader"

export default function LogoutComponent() {
    return (
        <div className="container">
            <PageHeader text="You are logged out!" />
            <p className="text-center">
                I hope we'll see you soon!
            </p>
        </div>
    )
}