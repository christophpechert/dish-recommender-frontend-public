import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Recommendation } from "../../objects/Recommendation";
import { deleteRecommendationById, retrieveRecommendationByMenuId, updateRecommendationById } from "../../api/RecommendationApiService";
import { AxiosError, AxiosResponse } from "axios";
import { useErrorContext } from "../../context/ErrorContext";
import Loading from "../global/Loading";
import PageHeader from "../global/PageHeader";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import DeleteModal from "../global/DeleteModal";
import EditModal from "../global/EditModal";

const Recommendations = (props: {
    t: TFunction<"translation", undefined>,
    recommendations: Recommendation[],
    onClickGoto: (recommendationId: number) => void,
    onClickEdit: (recommendationId: number, value: string) => void,
    onClickDelete: (recommendationId: number) => void
}) => {

    return (
        <div className="row">
            {props.recommendations.map((recommendation, index) => (
                <div className='col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch mb-4' key={index}>
                    <div className="card shadow" style={{ width: '100%' }}>
                        <div className="card-body">
                            <h5 className="card-title">{recommendation.name}</h5>
                        </div>
                        <div className='card-footer mx-3 mb-2 bg-white d-flex justify-content-between'>
                            <button
                                className='btn btn-primary'
                                onClick={() => props.onClickGoto(recommendation.id!)}
                            >
                                {props.t("recommendationOverview.recommendation.btn1")}
                            </button>
                            <div>
                                <EditModal className="me-2" t={props.t} name={recommendation.name} onClick={(e) => props.onClickEdit(recommendation.id!, e)} />
                                <DeleteModal t={props.t} name={recommendation.name} onClick={() => props.onClickDelete(recommendation.id!)} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function RecommendationOverview() {
    const { t } = useTranslation();
    const { menuId } = useParams<{ menuId: string }>();

    const navigate = useNavigate();

    const errorContext = useErrorContext();

    const [loader, setLoader] = useState<boolean>(true);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    useEffect(() => {
        setLoader(true);
        if (menuId) {
            retrieveRecommendationByMenuId(menuId)
                .then((response: AxiosResponse<Recommendation[]>) => {
                    setRecommendations(response.data)
                })
                .catch((error: AxiosError) => errorContext.setError(error))
                .finally(() => setLoader(false));
        }
    }, [menuId])

    const handleGoto = (id: number) => {
        navigate(`/dish/recommendation/${id}`)
    }

    const handleDelete = (id: number) => {
        deleteRecommendationById(id)
            .then((response: AxiosResponse<Recommendation>) => {
                const newRecommendations = recommendations.filter(e => e.id !== id);
                setRecommendations([...newRecommendations]);
            })
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    const handleEdit = (id: number, value: string) => {
        const newRecommendation = recommendations.find(e => e.id === id);

        if (newRecommendation) {
            newRecommendation.name = value;
            updateRecommendationById(id, newRecommendation)
                .then((response: AxiosResponse<Recommendation>) => {
                    console.log(response.data)
                    const newRecommendations = recommendations.map(e => e.id === id ? {...response.data} : e);
                    newRecommendations.sort((a, b) => a.name.localeCompare(b.name))
                    console.log(newRecommendations);
                    setRecommendations([...newRecommendations]);
                })
                .catch((error: AxiosError) => errorContext.setError(error));
        }
    }

    return (
        <div>
            <section className='container'>
                <PageHeader text={t("recommendationOverview.header")} withBackButton={true}/>
                {loader ?
                    <Loading />
                    :
                    <div>
                        {recommendations.length > 0 ?
                            <Recommendations
                                t={t}
                                recommendations={recommendations}
                                onClickGoto={handleGoto}
                                onClickDelete={handleDelete}
                                onClickEdit={handleEdit} />
                            :
                            <div className="text-center">
                                <h4 className="my-4">{t("recommendationOverview.noResult")}</h4>
                                <NavLink className="btn btn-primary" to={`/newRecommendation/menu/${menuId}`}>{t("recommendationOverview.noResultBtn")}</NavLink>
                            </div>
                        }
                    </div>}
            </section>
        </div>
    )
}

export default RecommendationOverview