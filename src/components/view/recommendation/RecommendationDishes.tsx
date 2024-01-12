import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dish } from "../../objects/Dish";
import { retrieveAllDishesFromRecommendation } from "../../api/DishApiService";
import { AxiosError, AxiosResponse } from "axios";
import { useErrorContext } from "../../context/ErrorContext";
import PageHeader from "../global/PageHeader";
import { useTranslation } from "react-i18next";
import Loading from "../global/Loading";
import DishElements from "../dish/DishElement";
import { deleteRecommendationById, removeDishFromRecommendationById } from "../../api/RecommendationApiService";
import { Recommendation } from "../../objects/Recommendation";
import { Button, Modal } from "react-bootstrap";
import { TFunction } from "i18next";

function ResponseModal(props: { t: TFunction<"translation", undefined>, name: string, isActive: boolean, onClickClose: () => void, onClickRemove: () => void }) {
    return (
        <>
            <Modal show={props.isActive} onHide={props.onClickClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("responseRatingModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.t("responseRatingModal.body", { name: props.name })}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClickClose}>
                        {props.t("responseRatingModal.abortBtn")}
                    </Button>
                    <Button variant="danger" onClick={props.onClickRemove}>
                        {props.t("responseRatingModal.okBtn")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function RecommendationDishes() {
    const errorContext = useErrorContext();

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { recommendationId } = useParams<{ recommendationId: string }>();

    const [loader, setLoader] = useState<boolean>(true);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [dishIdForRemove, setDishIdForRemove] = useState<number>();
    const [showResponseModal, setShowResponseModal] = useState<boolean>(false);

    useEffect(() => {
        setLoader(true)
        if (recommendationId) {
            retrieveAllDishesFromRecommendation(recommendationId)
                .then((response: AxiosResponse<Dish[]>) => {
                    setDishes(response.data)
                })
                .catch((error: AxiosError) => errorContext.setError(error))
                .finally(() => setLoader(false));
        }
    }, [recommendationId])

    const handleDelete = (id: number): void => {
        if (recommendationId) {
            removeDishFromRecommendationById(recommendationId, id)
                .then((response: AxiosResponse<Recommendation>) => {
                    const newDishes = dishes.filter(e => e.id !== id);

                    if (newDishes.length === 0) {
                        deleteRecommendationById(parseInt(recommendationId))
                            .then(() => navigate(-1))
                            .catch((error: AxiosError) => errorContext.setError(error))
                    }
                    setDishes([...newDishes]);
                })
                .catch((error: AxiosError) => errorContext.setError(error))
        }
    }

    const handleCloseModal = (): void => {
        setDishIdForRemove(undefined);
        setShowResponseModal(false);
    }

    const handleRemoveModal = (): void => {
        if (dishIdForRemove) {
            handleDelete(dishIdForRemove);
        }
        handleCloseModal();
    }

    const handleResponseModal = (show: boolean, dishId: number): void => {
        setShowResponseModal(true);
        setDishIdForRemove(dishId);
    }

    return (
        <div>
            <section className="container">
                <PageHeader text={t("recommendationDishes.header")} withBackButton={true} />
                <ResponseModal t={t} name="" onClickClose={handleCloseModal} onClickRemove={handleRemoveModal} isActive={showResponseModal} />
                {loader ?
                    <Loading />
                    :
                    <DishElements t={t} dishes={dishes} recommendation={{ hasModal: true, onClick: handleDelete }} setDishes={(e) => setDishes(e)} setResponseModal={handleResponseModal} />
                }
            </section>
        </div>
    )
}

export default RecommendationDishes