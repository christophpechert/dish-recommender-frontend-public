import { useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Webcam from 'react-webcam';
import { uploadImageFile } from '../../api/ImageDataApiService';
import { TFunction } from 'i18next';
import { ImageData } from '../../objects/ImageData';
import { AxiosResponse } from 'axios';
import Loading from './Loading';
import { useAuth } from '../../context/AuthContext';

function ImageTakeModal(
    props: { 
        className?: string, 
        t: TFunction<"translation", undefined>, 
        dishId: number,
        permission: boolean, 
        setRecipeImageData: (dishId: number, recipeImageData: ImageData) => void }) {
    
    const isMobile = useAuth().isMobile;
    const [show, setShow] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loader, setLoader] = useState<boolean>(false);

    const [videoConstrains, setVideoConstrains] = useState<MediaStreamConstraints["video"]>({
        height: 1024,
        width: 768
    })
        
    useEffect(() => {
        if (isMobile) {
            setVideoConstrains({...videoConstrains as MediaTrackConstraints, facingMode: { exact: "environment" }});
        } else {
            setVideoConstrains({...videoConstrains as MediaTrackConstraints, facingMode: "user"});
        }

    }, [])

    const handleClose = () => {
        setImgSrc(null);
        setLoader(false);
        setShow(false);
    };

    const handleShow = () => {
        setShow(true)
    };

    const blobToFile = (blob: Blob, fileName: string): File => {
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    }

    const capture = useCallback(
        async () => {
            console.log("Test")
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();

                if (imageSrc) {
                    setImgSrc(imageSrc);
                }
            }

        }, [webcamRef]);

    const saveImage = (): void => {
        if (imgSrc) {
            fetch(imgSrc)
                .then((response) => {
                    return response.blob();
                })
                .then((blob) => {
                    const file = blobToFile(blob, "image.jpg");
                    const formData = new FormData();
                    formData.append("file", file);
                    setLoader(true);
                    return uploadImageFile(props.dishId, formData);
                })
                .then((response: AxiosResponse<ImageData>) => {
                    props.setRecipeImageData(props.dishId, response.data);
                })
                .catch(error => console.log(error))
                .finally(() => {
                    setLoader(false);
                    handleClose();
                })
        }
    }

    const retake = () => {
        setImgSrc(null);
    };

    return (
        <>
            <button className={`btn btn-primary ${props.className}`} onClick={handleShow}>
                <i className="fa-solid fa-camera"></i>
            </button>

            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("imageTakeModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-center'>
                        {loader ?
                            <Loading />
                            :
                            imgSrc ? (
                                <img src={imgSrc} alt="webcam" />
                            ) : (
                                <Webcam
                                    height={600}
                                    width={600}
                                    ref={webcamRef}
                                    videoConstraints={videoConstrains}
                                    screenshotFormat="image/jpeg"
                                    screenshotQuality={1.0}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            )
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    {props.t("imageTakeModal.abortBtn")}
                    </Button>
                    {imgSrc ? (
                            <>
                                <button className='btn btn-warning me-2' onClick={retake}>
                                    <i className="fa-solid fa-rotate-right"></i>
                                </button>
                                <button className='btn btn-success' onClick={saveImage} disabled={!props.permission}>
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </button>
                            </>
                        ) : (
                            <button className='btn btn-primary' onClick={() => capture()}>{props.t("imageTakeModal.captureBtn")}</button>
                        )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ImageTakeModal;