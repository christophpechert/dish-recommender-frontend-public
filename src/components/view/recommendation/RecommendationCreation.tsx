import { ChangeEvent, useEffect, useState } from "react";
import { Keyword } from "../../objects/Keyword"
import { useErrorContext } from "../../context/ErrorContext";
import { AxiosError, AxiosResponse } from "axios";
import Loading from "../global/Loading";
import PageHeader from "../global/PageHeader";
import { DishCaloricCategory, DishCookingTimeCategory, DishDietaryCategory, DishType, converter } from "../../config/constant";
import { useNavigate, useParams } from "react-router-dom";
import { retrieveDishesByMenuIdAndCriteria } from "../../api/DishApiService";
import { Dish } from "../../objects/Dish";
import DishElements from "../dish/DishElement";
import { Button, Modal } from "react-bootstrap";
import { retrieveUserGroupWithMenusAndKeywords } from "../../api/UserGroupApiService";
import { UserGroupWithMenusAndKeywords } from "../../objects/UserGroup";
import { Menu } from "../../objects/Menu";
import { Recommendation } from "../../objects/Recommendation";
import { addRecommendation } from "../../api/RecommendationApiService";
import { useTranslation } from "react-i18next";
import { TFunction, t } from "i18next";

type DishCategory = DishType | DishCookingTimeCategory | DishDietaryCategory | DishCaloricCategory;

interface KeywordExtend extends Keyword {
    isActive: boolean;
}

interface ButtonProps {
    keyword: KeywordExtend;
    onClick: (id: number) => void;
}

const KeywordButton: React.FC<ButtonProps> = ({ keyword, onClick }) => (
    <button className={keyword.isActive ? "btn btn-primary" : "btn btn-outline-secondary"} onClick={() => onClick(keyword.id!)}>
        {keyword.name}
    </button>
)

const MenuRadioButton = (props: { menus: Menu[], menuId: number, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <div className="col-12 card shadow">
            <div className="card-body">
                <h5 className="card-title">{t(`recommendation.creation.menus`)}</h5>
                {props.menus.map((menu, index) => (
                    <div className="form-check form-check-inline" key={index}>
                        <input
                            className="form-check-input"
                            type="radio" name="inlineRadioOptions"
                            id={`menuRecommendation${menu.id!}`}
                            value={menu.id!}
                            onChange={e => props.onChange(e)}
                            checked={props.menuId === menu.id}
                        />
                        <label className="form-check-label" htmlFor={`menuRecommendation${menu.id!}`}>{menu.name}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CategoryCheckBox = <T extends DishCategory>(
    props: {
        t: TFunction<"translation", undefined>,
        description: string,
        categories: T[],
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
        activeValues: T[]
    }) => {
    return (
        <div className="col-lg-6 col-md-6 col-sm-12 card shadow">
            <div className="card-body">
                <h5 className="card-title">{props.t(`recommendation.creation.${props.description}`)}</h5>
                {props.categories.map((category, index) => (
                    <div className="form-check form-check-inline" key={index}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value={category}
                            id={category}
                            onChange={e => props.onChange(e)}
                            checked={props.activeValues.includes(category)}
                        />
                        <label className="form-check-label" htmlFor={category}>{props.t(`recommendation.creation.${category.toLowerCase()}`)}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ResultHeader = (props: { t: TFunction<"translation", undefined>, dishes: Dish[], hasSearching: boolean }) => {
    if (props.hasSearching) {
        if (props.dishes.length > 0) {
            return (
                <h4 className="text-center my-4">{`Result: ${props.dishes.length} ${props.dishes.length === 1 ? "dish" : "dishes"} found`}</h4>
            )
        } else {
            return (
                <h4 className="text-center my-4">{props.t("recommendation.creation.noResult")}</h4>
            )
        }
    }

    return (
        <div></div>
    )
}

const SaveModal = (
    props: {
        t: TFunction<"translation", undefined>,
        disabled: boolean,
        onClickSave: (recommendationName: string) => void
    }) => {
    const [error, setError] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [recommendationName, setRecommendationName] = useState<string>("");

    const init = () => {
        setRecommendationName("");
        setError("");
    }

    const handleClose = () => {
        init();
        setShow(false)
    };

    const handleShow = () => {
        init();
        setShow(true)
    };

    const handleSave = () => {
        if (recommendationName.length < 4) {
            setError("Recommendation name have to 4 characters at least")
        } else {
            props.onClickSave(recommendationName);
            setShow(false)
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow} disabled={props.disabled}>
                <i className="fa-regular fa-floppy-disk"></i>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("recommendation.creation.saveModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.length > 0 && <div className="alert alert-warning" role="alert">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="saveModalInput" className="form-label">{props.t("recommendation.creation.saveModal.name")}</label>
                        <input type="text" className="form-control" id="saveModalInput" onChange={(e) => setRecommendationName(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {props.t("recommendation.creation.saveModal.closeBtn")}
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {props.t("recommendation.creation.saveModal.saveBtn")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const IsSavedModal = (
    props: {
        t: TFunction<"translation", undefined>,
        show: boolean,
        onClickClose: () => void,
        onCLickGoTo: () => void
    }) => {

    return (
        <>
            <Modal show={props.show} onHide={props.onClickClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("recommendation.creation.isSavedModal.header")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.t("recommendation.creation.isSavedModal.body")}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClickClose}>
                        {props.t("recommendation.creation.isSavedModal.closeBtn")}
                    </Button>
                    <Button variant="primary" onClick={props.onCLickGoTo}>
                        {props.t("recommendation.creation.isSavedModal.gotoBtn")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


function RecommendationCreation() {
    const errorContext = useErrorContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { menuId: menuIdPara } = useParams<{ menuId: string }>();

    const [loader, setLoader] = useState<boolean>(false);
    const [menuId, setMenuId] = useState<number>(0);
    const [menuIdSearch, setMenuIdSearch] = useState<number>(0);
    const [dishLoader, setDishLoader] = useState<boolean>(false);
    const [hasSearching, setHasSearching] = useState<boolean>(false);
    const [keywords, setKeywords] = useState<KeywordExtend[]>([]);
    const [allKeywordsReq, setAllKeywordsReq] = useState<boolean>(false);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [showSavedModal, setShowSavedModal] = useState<boolean>(false);

    const [activeDishTypes, setActiveDishTypes] = useState<DishType[]>([]);
    const dishTypeArray: DishType[] = Object.values(DishType);

    const [activeDishCookingTimeCategory, setActiveDishCookingTimeCategory] = useState<DishCookingTimeCategory[]>([]);
    const dishCookingTimeCategoryArray: DishCookingTimeCategory[] = Object.values(DishCookingTimeCategory);

    const [activeDishDietaryCategory, setActiveDishDietaryCategory] = useState<DishDietaryCategory[]>([]);
    const DishDietaryCategoryArray: DishDietaryCategory[] = Object.values(DishDietaryCategory);

    const [activeDishCaloricCategory, setActiveDishCaloricCategory] = useState<DishCaloricCategory[]>([]);
    const DishCaloricCategoryArray: DishCaloricCategory[] = Object.values(DishCaloricCategory);

    useEffect(() => {
        try {
            if (menuIdPara) {
                const newMenuId = parseInt(menuIdPara);
                setMenuId(newMenuId);
            }
        } catch {
            console.log(`Cannot parse ${menuIdPara} to int`);
        }

        setLoader(true);
        retrieveUserGroupWithMenusAndKeywords()
            .then((response: AxiosResponse<UserGroupWithMenusAndKeywords>) => {
                const responseKeyword = response.data.keywords as KeywordExtend[];
                responseKeyword.forEach(e => e.isActive = false);
                setKeywords(responseKeyword)
                setMenus(response.data.menus);
            })
            .catch((error: AxiosError) => errorContext.setError(error))
            .finally(() => {
                setLoader(false);
            });


    }, [])

    const handleGoToSavedModal = () => {
        handleCloseSavedModal();
        navigate(`/recommendation/menu/${menuIdSearch}`);
    }

    const handleCloseSavedModal = () => {
        setShowSavedModal(false);
        handleOnClickDeleteSearch();
    }

    const handleOnClick = (id: number): void => {
        const newKeywords = [...keywords];
        newKeywords.find(e => {
            if (e.id! === id) {
                if (e.isActive) {
                    e.isActive = false;
                } else {
                    e.isActive = true;
                }
            }
        })
        setKeywords([...newKeywords]);
    }

    const handleOnChange = <T,>(e: ChangeEvent<HTMLInputElement>, states: T[], setStates: React.Dispatch<React.SetStateAction<T[]>>): void => {
        const value = e.target.value as T;
        const newStates = [...states];

        if (newStates.includes(value)) {
            newStates.splice(newStates.indexOf(value), 1);
        } else {
            newStates.push(value);
        }
        setStates([...newStates]);
    }

    const handleOnClickKeywordButton = (): void => {
        if (allKeywordsReq) {
            setAllKeywordsReq(false);
        } else {
            setAllKeywordsReq(true);
        }
    }

    const handleOnChangeMenuRadioButton = (e: ChangeEvent<HTMLInputElement>): void => {
        setMenuId(+e.target.value);
    }

    const handleOnClickSearchButton = (): void => {
        setHasSearching(true);
        const keywordIds: number[] = keywords.filter(e => e.isActive).map(e => e.id!);
        const newMenuId = menuId;

        setDishLoader(true);
        retrieveDishesByMenuIdAndCriteria(newMenuId, keywordIds, allKeywordsReq, activeDishTypes, activeDishCookingTimeCategory, activeDishDietaryCategory, activeDishCaloricCategory)
            .then((response: AxiosResponse) => setDishes(response.data))
            .catch((error: AxiosError) => errorContext.setError(error))
            .finally(() => {
                setDishLoader(false);
                setMenuIdSearch(newMenuId);
            });
    }

    const handleOnClickDeleteSearch = (): void => {
        setDishes([]);
        setHasSearching(false);
        setMenuIdSearch(0);
    }

    const handleOnClickRemoveDish = (id: number): void => {
        const newDishes = dishes.filter(e => e.id !== id);
        setDishes([...newDishes]);
    }

    const handleOnClickSave = (recommendationName: string): void => {
        const newRecommendation: Recommendation = {
            name: recommendationName,
            dishes: dishes,
            menu: menus.find(e => e.id == menuIdSearch)!
        }
        addRecommendation(newRecommendation)
            .then((response: AxiosResponse<Recommendation>) => {
                setShowSavedModal(true);
            })
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    const handleOnCLickEraseFilter = (): void => {
        setMenuId(0);
        const newKeywords = [...keywords];
        newKeywords.forEach(e => e.isActive = false);
        setKeywords([...newKeywords]);
        setActiveDishTypes([]);
        setActiveDishCookingTimeCategory([]);
        setActiveDishDietaryCategory([]);
        setActiveDishCaloricCategory([]);
    }

    return (
        <div>
            <section className='container'>
                <PageHeader text={t("recommendation.creation.header")} withBackButton={true} />
                {loader ?
                    <Loading />
                    :
                    <div>
                        <div className="row g-2">
                            {menuId <= 0 && <div className="alert alert-warning" role="alert">{t("recommendation.creation.errMsg")}</div>}
                            <MenuRadioButton menus={menus} menuId={menuId} onChange={handleOnChangeMenuRadioButton} />
                            <div className="col-12 card shadow">
                                <div className="card-body">
                                    <h5 className="card-title">{t("recommendation.creation.keywords")}</h5>
                                    <div className="d-flex flex-row align-content-start flex-wrap">
                                        {keywords.map((keyword, index) => (
                                            <div className="me-2 mb-2" key={index}>
                                                <KeywordButton keyword={keyword} onClick={handleOnClick} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='card-footer text-end pe-3 mt-2 '>
                                    <button className={allKeywordsReq ? "btn btn-primary" : "btn btn-outline-primary"} onClick={handleOnClickKeywordButton}>
                                        {allKeywordsReq ? t("recommendation.creation.keywordBtn2") : t("recommendation.creation.keywordBtn1")}
                                    </button>
                                </div>
                            </div>
                            <CategoryCheckBox<DishType>
                                t={t}
                                description="type"
                                categories={dishTypeArray}
                                onChange={e => handleOnChange(e, activeDishTypes, setActiveDishTypes)}
                                activeValues={activeDishTypes}
                            />
                            <CategoryCheckBox<DishCookingTimeCategory>
                                t={t}
                                description="cookingTimeCategory"
                                categories={dishCookingTimeCategoryArray}
                                onChange={e => handleOnChange(e, activeDishCookingTimeCategory, setActiveDishCookingTimeCategory)}
                                activeValues={activeDishCookingTimeCategory}
                            />
                            <CategoryCheckBox<DishDietaryCategory>
                                t={t}
                                description="dietaryCategory"
                                categories={DishDietaryCategoryArray}
                                onChange={e => handleOnChange(e, activeDishDietaryCategory, setActiveDishDietaryCategory)}
                                activeValues={activeDishDietaryCategory}
                            />
                            <CategoryCheckBox<DishCaloricCategory>
                                t={t}
                                description="caloricCategory"
                                categories={DishCaloricCategoryArray}
                                onChange={e => handleOnChange(e, activeDishCaloricCategory, setActiveDishCaloricCategory)}
                                activeValues={activeDishCaloricCategory}
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <div>
                                <button className="btn btn-success my-2 me-2" onClick={handleOnClickSearchButton} disabled={menuId <= 0}>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                                <button className="btn btn-danger me-2" onClick={handleOnClickDeleteSearch}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                                <SaveModal t={t} disabled={dishes.length === 0 || menuIdSearch <= 0} onClickSave={handleOnClickSave} />
                            </div>
                            <button className="btn btn-warning my-2" onClick={handleOnCLickEraseFilter}>
                                <i className="fa-solid fa-eraser"></i>
                            </button>
                        </div>
                        <IsSavedModal t={t} show={showSavedModal} onClickClose={handleCloseSavedModal} onCLickGoTo={handleGoToSavedModal} />
                        {dishLoader ?
                            <Loading />
                            :
                            <div>
                                <ResultHeader t={t} dishes={dishes} hasSearching={hasSearching} />
                                <DishElements t={t} dishes={dishes} recommendation={{ onClick: (id) => handleOnClickRemoveDish(id), hasModal: false }} setDishes={setDishes} />
                            </div>
                        }
                    </div>
                }
            </section>
        </div>
    )
}

export default RecommendationCreation