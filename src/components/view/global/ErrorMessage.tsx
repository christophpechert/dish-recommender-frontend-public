import { TFunction } from "i18next"

function ErrorMessage(props: { t: TFunction<"translation", undefined>, errorKey: string, isErrorActive: boolean, onClickClose: (emptyString: string) => void }) {
    const EMPTY_STRING = "";

    return (
        <div>
            {props.isErrorActive &&
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    {props.t(props.errorKey)}
                    <button type="button" className="btn-close" onClick={() => props.onClickClose(EMPTY_STRING)}></button>
                </div>
            }
        </div>
    )
}

export default ErrorMessage