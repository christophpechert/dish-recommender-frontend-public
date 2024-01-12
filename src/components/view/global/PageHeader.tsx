import { useNavigate } from "react-router-dom"

function PageHeader(props: { text: string, withBackButton?: boolean }) {
    const navigate = useNavigate();

    return (
        <div>
            <div className='text-uppercase d-flex align-items-center justify-content-center my-4'>
                {props.withBackButton && <button className="btn btn-primary me-2" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i></button>}
                <div className="fw-bold fs-2">{props.text}</div>
            </div>
        </div>
    )
}

export default PageHeader