import { useErrorContext } from './context/ErrorContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from './view/global/PageHeader';


function ErrorPage() {
    const errorContext = useErrorContext();
    const navigate = useNavigate();

    function back(): void {
        errorContext.clearError();
        navigate("/home");
    }

    return (
        <div>
            <section className='container'>
                <PageHeader text='Error' />
                <h1><strong>Oops!</strong>something went wrong</h1>
                <br />
                <h1>Statuscode: {errorContext.statusCode}</h1>
                <h2>{errorContext.errorData.details}</h2>
                <h2>{errorContext.errorData.message}</h2>
                <h2>{errorContext.errorData.timestamp}</h2>
                <br />
                <button className="btn btn-primary" type='button' onClick={back}>Home</button>
            </section>
        </div>
    )
}

export default ErrorPage