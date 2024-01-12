import { TFunction } from 'i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ResponseModal(props: { t: TFunction<"translation", undefined>, local: string, name: string, show: boolean, onClickYes: () => void, onClickNo: () => void }) {

    return (
        <>
            <Modal show={props.show} onHide={props.onClickNo}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t(`${props.local}.header`)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.t(`${props.local}.body`, { name: props.name })}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClickYes}>
                        <i className="fa-solid fa-square-check"></i>
                    </Button>
                    <Button variant="danger" onClick={props.onClickNo}>
                        <i className="fa-solid fa-square-xmark"></i>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ResponseModal;