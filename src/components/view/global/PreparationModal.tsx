import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import i18next, { TFunction } from 'i18next';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Rating } from 'react-simple-star-rating';
import { Preparation } from '../../objects/Preparation';
import dayjs, { Dayjs } from 'dayjs';


function PreparationModal(
    props: { 
        className?: string, 
        permission: boolean,
        t: TFunction<"translation", undefined>, 
        onClick: (preparation: Preparation) => void
     }) {
    const [show, setShow] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [rating, setRating] = useState<number>(0)
    const [error, setError] = useState<boolean>(false);
    const [date, setDate] = useState<string>("");
    const [dateObj, setDateObj] = useState<Dayjs>();

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setComment("");
        setDate(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
        setRating(0);
        setError(false);
        setDateObj(dayjs());
    };

    const handleAccept = () => {
        if (rating < 1 || rating > 5) {
            setError(true);
        } else {
            const preparation: Preparation = {
                cooked: date,
                rating: rating,
                comment: comment
            }

            props.onClick(preparation);
            handleClose();
        }
    }

    const handleRating = (rating: number) => {
        setRating(rating)
        if (rating >= 1 && rating <= 5) {
            setError(false);
        }
    }

    return (
        <>
            <button className={`btn btn-primary ${props.className}`} onClick={handleShow}>
                <i className="fa-solid fa-star"></i>
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("preparationModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-warning" role="alert">{props.t("preparationModal.errMsg1")}</div>}
                    <div className='App'>
                        <Rating onClick={handleRating} />
                    </div>
                    <div className='text-center my-4'>
                        <DatePicker
                            // format={props.t("dateFormat")}
                            label={props.t("preparationModal.labelDatePicker")}
                            value={dateObj}
                            onChange={(e) => setDate(dayjs(e).format('YYYY-MM-DDTHH:mm:ss'))}
                            disableFuture={true}
                        />
                    </div>
                    <div>
                        <label htmlFor="comment-input" className="form-label">{props.t("preparationModal.label")}</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="comment-input" value={comment} onChange={(e) => setComment(e.target.value)} />
                            <button className="btn btn-outline-secondary" type="button" id="comment-input" onClick={() => setComment("")}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {props.t("preparationModal.abortBtn")}
                    </Button>
                    <Button variant="primary" disabled={!props.permission} onClick={handleAccept}>
                        {props.t("preparationModal.okBtn")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PreparationModal;