import { TFunction } from 'i18next';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function EditModal(props: { className?: string, t: TFunction<"translation", undefined>, name: string, onClick: (value: string) => void }) {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setError(false);
        setShow(true);
        setValue(props.name)
    };

    const handleEdit = () => {
        if (value.length < 4) {
            setError(true);
        } else {
            if (value !== props.name) {
                props.onClick(value);
            }
            setError(false);
            handleClose();
        }
    }

    return (
        <>
            <button className={`btn btn-warning ${props.className}`} onClick={handleShow}>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("editModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-warning" role="alert">{props.t("editModal.errMsg1")}</div>}
                    <p>{props.t("editModal.body", { name: props.name })}</p>
                    <div className="mb-3">
                        <label htmlFor="editModalInput" className="form-label">{props.t("editModal.label")}</label>
                        <input type="text" className="form-control" id="editModalInput" value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {props.t("editModal.abortBtn")}
                    </Button>
                    <Button variant="warning" disabled={value === props.name} onClick={handleEdit}>
                        {props.t("editModal.okBtn")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditModal;