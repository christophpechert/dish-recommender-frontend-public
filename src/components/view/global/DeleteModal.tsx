import { TFunction } from 'i18next';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal(props: { className?: string, disabled?: boolean, t: TFunction<"translation", undefined>, name: string, onClick: () => void }) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };

    const handleDelete = () => {
        props.onClick();
        handleClose();
    }

    return (
        <>
            <button className={`btn btn-danger ${props.className}`} type='button' onClick={handleShow} disabled={props.disabled}>
                <i className="fa-solid fa-trash-can"></i>
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("deleteModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.t("deleteModal.body", { name: props.name })}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {props.t("deleteModal.abortBtn")}
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        {props.t("deleteModal.okBtn")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteModal;