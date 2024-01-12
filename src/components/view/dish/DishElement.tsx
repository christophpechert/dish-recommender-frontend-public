import { NavLink, useNavigate } from 'react-router-dom';
import { Dish } from '../../objects/Dish';
import { LocationType, UserRole } from '../../config/constant';
import { Location } from '../../objects/Location';
import DeleteModal from '../global/DeleteModal';
import { TFunction } from 'i18next';
import PreparationModal from '../global/PreparationModal';
import { Preparation } from '../../objects/Preparation';
import { Rating } from 'react-simple-star-rating';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { addPreparation } from '../../api/PreparationApiService';
import { AxiosError, AxiosResponse } from 'axios';
import { useErrorContext } from '../../context/ErrorContext';
import { ImageData } from '../../objects/ImageData';
import ImageTakeModal from '../global/ImageTakeModal';
import { useAuth } from '../../context/AuthContext';

interface Recommendation {
    onClick: (id: number) => void;
    hasModal: boolean;
}

function AllPreparations(props: { t: TFunction<"translation", undefined>, dish: Dish }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button className='btn btn-secondary' onClick={handleShow}>
                {props.t("dish.element.viewAllBtn")}
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("dish.element.preparationModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.dish.preparations.map((preparation, index) => (
                        <div className="card mb-2" key={index}>
                            <div className="card-body">
                                <h5 className="card-title">{preparation.userInfo?.name}</h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">{props.t("dish.element.preparationModal.intlDate", {
                                    val: new Date(preparation.cooked),
                                    formatParams: {
                                        val: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                                    }
                                })}</h6>
                                {preparation.comment.length > 0 && <p className="card-text">{preparation.comment}</p>}
                                <Rating
                                    initialValue={preparation.rating}
                                    readonly={true}
                                    allowFraction={true}
                                />
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {props.t("dish.element.preparationModal.closeBtn")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DishElement(
    props: {
        t: TFunction<"translation", undefined>,
        dish: Dish,
        permissionRate: boolean,
        permissionTakeImage: boolean,
        recommendation?: Recommendation,
        onClick: (dishId: number, preparation: Preparation) => void,
        setRecipeImageData: (dishId: number, recipeImageData: ImageData) => void
    }) {

    const navigate = useNavigate();

    return (
        <div className=' shadow w-100'>
            <div className="card w-100" >
                <div className="accordion" id={`accordion-dish-element-${props.dish.id!}`}>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#dish-element-${props.dish.id!}`} aria-expanded="false" aria-controls={`dish-element-${props.dish.id!}`}>
                                <div>
                                    <h5 className="card-title">{props.dish.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-body-secondary">{props.dish.description}</h6>
                                </div>
                            </button>
                        </h2>
                        <div id={`dish-element-${props.dish.id!}`} className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <p className="card-text">{props.dish.comment}</p>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex flex-row justify-content-between">
                                        <div>{props.t(`dish.detail.${props.dish.dishType.toLocaleLowerCase()}`)}</div>
                                        <div className='opacity-50'>{props.t("dish.detail.type")}</div>
                                    </li>
                                    <li className="list-group-item d-flex flex-row justify-content-between">
                                        <div>{props.t(`dish.detail.${props.dish.dishCookingTimeCategory.toLocaleLowerCase()}`)}</div>
                                        <div className='opacity-50'>{props.t("dish.detail.cookingTimeCategory")}</div>
                                    </li>
                                    <li className="list-group-item d-flex flex-row justify-content-between">
                                        <div>{props.t(`dish.detail.${props.dish.dishDietaryCategory.toLocaleLowerCase()}`)}</div>
                                        <div className='opacity-50'>{props.t("dish.detail.dietaryCategory")}</div>
                                    </li>
                                    <li className="list-group-item d-flex flex-row justify-content-between">
                                        <div>{props.t(`dish.detail.${props.dish.dishCaloricCategory.toLocaleLowerCase()}`)}</div>
                                        <div className='opacity-50'>{props.t("dish.detail.caloricCategory")}</div>
                                    </li>
                                </ul>
                                {props.dish.locations!.map((location: Location, index) => (
                                    <div className='mt-2 px-3' key={index}>

                                        {location.locationType === LocationType.Internet && <div>
                                            <label className='fw-bold'>{props.t("dish.detail.link")}</label>
                                            <div><a href={location.link} target="_blank">{location.link}</a></div>
                                        </div>}

                                        {location.locationType === LocationType.Cookbook && <div>
                                            <div className='d-flex flex-row justify-content-between'>
                                                <label className='fw-bold'>{props.t("dish.detail.cookbook")}</label>
                                                <label className='fw-bold'>{props.t("dish.detail.page")}</label>
                                            </div>
                                            <div className='d-flex flex-row justify-content-between'>
                                                <div>{location.cookbook}</div>
                                                <div>{location.page}</div>
                                            </div>
                                        </div>}
                                    </div>
                                ))}
                                <div className='px-3 mt-2'>
                                    <div className='fw-bold'>{props.t("dish.detail.keywords")}</div>
                                    <div className="d-flex flex-row align-content-start flex-wrap">

                                        {props.dish.keywords!.map((keyword, index) => (
                                            <div className="me-2 mt-2" key={index}>
                                                <button type="button" className="btn btn-outline-secondary opacity-100" disabled>{keyword.name}</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {props.dish.preparations && props.dish.preparations.length > 0 ?
                                    <div className='mt-2 d-flex justify-content-between'>
                                        <Rating
                                            initialValue={props.dish.rating!}
                                            readonly={true}
                                            allowFraction={true}
                                        />
                                        <AllPreparations t={props.t} dish={props.dish} />
                                    </div>
                                    :
                                    <h5 className='mt-2'>{props.t("dish.element.noPreparations")}</h5>
                                }
                            </div>
                        </div>
                    </div>

                    <div className='card-footer text-end pe-3 d-flex justify-content-between'>
                        <div>
                            <PreparationModal onClick={(e) => props.onClick(props.dish.id!, e)} t={props.t} permission={props.permissionRate} />
                            <ImageTakeModal className='ms-2' t={props.t} dishId={props.dish.id!} setRecipeImageData={props.setRecipeImageData} permission={props.permissionTakeImage} />
                            {props.dish.imageData !== undefined && <button className='btn btn-success ms-2' onClick={() => navigate(`/image/dish/${props.dish.id}`)} disabled={props.dish.imageData.length <= 0}>
                                <i className="fa-solid fa-image"></i>
                            </button>}
                        </div>
                        {props.recommendation ?
                            props.recommendation.hasModal ?
                                <DeleteModal t={props.t} name={props.dish.name} onClick={() => props.recommendation!.onClick(props.dish.id!)} />
                                :
                                <button className='btn btn-danger' onClick={() => props.recommendation!.onClick(props.dish.id!)}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            :
                            <NavLink className="btn btn-warning" to={`/dish/${props.dish.id}`}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </NavLink>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

function DishElements(
    props: {
        t: TFunction<"translation", undefined>,
        dishes: Dish[],
        recommendation?: Recommendation,
        setDishes: (dishes: Dish[]) => void,
        setResponseModal?: (show: boolean, dishId: number) => void
    }) {

    const errorContext = useErrorContext();
    const checkPermission = useAuth().checkPermission;
    const [permissionRate, setPermissionRate] = useState<boolean>(false);
    const [permissionTakeImage, setPermissionTakeImage] = useState<boolean>(false);

    useEffect(() => {
        setPermissionRate(checkPermission(UserRole.ROLE_WAITER))
        setPermissionTakeImage(checkPermission(UserRole.ROLE_WAITER))
    }, [])



    const handleRating = (dishId: number, preparation: Preparation): void => {
        addPreparation(dishId, preparation)
            .then((response: AxiosResponse<Preparation>) => {

                const newDishesForPreparation = props.dishes.map(dish => {
                    if (dish.id === dishId) {

                        const sum = dish.preparations.map(e => e.rating).reduce((a, b) => a + b, 0) + response.data.rating;
                        const newRating = sum / (dish.preparations.length + 1);
                        
                        return {
                            ...dish,
                            preparations: [...dish.preparations!, response.data],
                            rating: newRating
                        };
                    }
                    return dish;
                });
                props.setDishes([...newDishesForPreparation]);
                if (props.setResponseModal) {
                    props.setResponseModal(true, dishId);
                }

            })
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    const handleNewRecipeImageData = (dishId: number, recipeImageData: ImageData) => {
        const newDishesForRecipeImageData = props.dishes.map(dish => {
            if (dish.id === dishId) {
                return {
                    ...dish,
                    imageData: [...dish.imageData!, recipeImageData]
                };
            }
            return dish;
        });
        props.setDishes([...newDishesForRecipeImageData]);
    }

    return (
        <div className='row'>
            {props.dishes && props.dishes.map((dish, index) => (
                <div className='col-lg-4 col-md-4 col-sm-12 mb-4' key={index}>
                    <DishElement
                        t={props.t}
                        dish={dish}
                        permissionRate={permissionRate}
                        permissionTakeImage={permissionTakeImage}
                        recommendation={props.recommendation}
                        onClick={handleRating}
                        setRecipeImageData={handleNewRecipeImageData}
                    />
                </div>
            ))}
        </div>
    )
}

export default DishElements