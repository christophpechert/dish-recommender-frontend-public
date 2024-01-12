import { useNavigate, useParams } from "react-router-dom";
import { useErrorContext } from "../../context/ErrorContext";
import { DishCaloricCategory, DishCookingTimeCategory, DishDietaryCategory, DishType, LocationType, NEW_ELEMENT, UserRole } from "../../config/constant";
import { ChangeEvent, useEffect, useState } from "react";
import { TFunction, t } from "i18next";
import PageHeader from "../global/PageHeader";
import { useTranslation } from "react-i18next";
import Loading from "../global/Loading";
import { Location } from "../../objects/Location";
import { Button, Modal } from "react-bootstrap";
import DeleteModal from "../global/DeleteModal";
import { Menu } from "../../objects/Menu";
import { retrieveUserGroupWithMenusAndKeywords } from "../../api/UserGroupApiService";
import { UserGroupWithMenusAndKeywords } from "../../objects/UserGroup";
import { AxiosError, AxiosResponse } from "axios";
import { Keyword } from "../../objects/Keyword";
import { Dish } from "../../objects/Dish";
import { addNewDish, deleteById, retrieveDishById, updateDish } from "../../api/DishApiService";
import { useAuth } from "../../context/AuthContext";

type DishCategory = DishType | DishCookingTimeCategory | DishDietaryCategory | DishCaloricCategory;

interface CheckBoxProps<T> {
    className?: string;
    t: TFunction<"translation", undefined>;
    description: string;
    categories: T[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    activeValue: T;
    name: string;
}

const CategoryRadio = <T extends DishCategory>(props: CheckBoxProps<T>) => {
    return (
        <div className={props.className}>
            <div className="fw-bold">{t(`dish.detail.${props.description}`)}</div>
            {props.categories.map((category, index) => (
                <div className="form-check form-check-inline" key={index}>
                    <input
                        className="form-check-input"
                        type="radio"
                        value={category}
                        id={`dish-detail-${category.toString().toLowerCase()}`}
                        name={props.name}
                        onChange={e => props.onChange(e)}
                        checked={props.activeValue === category}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`dish-detail-${category.toString().toLowerCase()}`}
                    >
                        {props.t(`dish.detail.${category.toString().toLowerCase()}`)}
                    </label>
                </div>
            ))}
        </div>
    );
}

const MenuCheckBox = (props: { className?: string, t: TFunction<"translation", undefined>, menus: Menu[], activeMenus: Menu[], onChange: (id: number) => void }) => {
    return (
        <div className={props.className}>
            <div className="fw-bold">{props.menus.length > 1 ? props.t("dish.detail.menus") : props.t("dish.detail.menu")}</div>
            {props.menus.map((menu, index) => (
                <div className="form-check" key={index}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`dish-detail-menu-${menu.id!}`}
                        value={menu.id!}
                        onChange={e => props.onChange(menu.id!)}
                        checked={props.activeMenus.some(e => e.id === menu.id)}
                    />
                    <label className="form-check-label" htmlFor={`dish-detail-menu-${menu.id!}`}>{menu.name}</label>
                </div>
            ))}
        </div>
    )
}

const KeywordComponent = (props: { className?: string, keywords: Keyword[], activeKeywords?: Keyword[], onClick: (id: number) => void }) => {
    return (
        <div className="d-flex flex-wrap">
            {props.keywords.map((keyword, index) => (
                <button
                    className={props.className?.includes("btn btn-") ? props.className : `btn btn-secondary ${props.className}`}
                    key={index}
                    onClick={() => props.onClick(keyword.id!)}
                    type="button"
                    disabled={props.activeKeywords !== undefined && props.activeKeywords.some(e => e.id === keyword.id)}
                >
                    {keyword.name}
                </button>
            ))}
        </div>
    )
}

const LocationModal = (
    props: {
        className?: string,
        t: TFunction<"translation", undefined>,
        location?: Location,
        index?: number,
        onClickAdd: (location: Location) => void,
        onClickChange: (index: number, location: Location) => void
    }) => {

    const locationInit: Location = {
        locationType: LocationType.Internet,
        link: "",
        cookbook: "",
        page: 0
    }

    const [show, setShow] = useState(false);
    const [location, setLocation] = useState<Location>(locationInit);

    const handleClose = () => setShow(false);

    const handleShow = () => {
        if (props.index !== undefined) {
            setLocation(props.location!);
        } else {
            setLocation(locationInit);
        }
        setShow(true);
    };

    const setValue = (e: ChangeEvent<HTMLInputElement>): void => {
        setLocation({ ...location, [e.target.name]: e.target.value });
    }

    const handleTab = (locationType: LocationType) => {
        setLocation({ ...location, locationType: locationType })
    }

    const handleAdd = (): void => {
        const newLocation = location;
        cleanUpLocation(newLocation);

        props.onClickAdd(newLocation);
        handleClose();
    }

    const handleChange = (): void => {
        const newLocation = location;
        cleanUpLocation(newLocation);

        props.onClickChange(props.index!, location);
        handleClose();
    }

    const cleanUpLocation = (newLocation: Location): void => {
        if (location.locationType === LocationType.Internet) {
            newLocation.cookbook = "";
            newLocation.page = 0;
        } else {
            newLocation.link = "";
        }
    }

    return (
        <>
            <button className={`btn btn-${props.index !== undefined ? "warning" : "primary"} ${props.className}`} onClick={handleShow} type="button">
                {props.index !== undefined ?
                    <i className="fa-solid fa-pen-to-square"></i>
                    :
                    <i className="fa-solid fa-plus"></i>
                }

            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {props.index !== undefined ? props.t("dish.detail.locationHeaderUpdate") : props.t("dish.detail.locationHeaderNew")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${location.locationType === LocationType.Internet ? "active" : ""}`}
                                id="web-tab" data-bs-toggle="tab"
                                data-bs-target="#web-tab-pane"
                                type="button"
                                role="tab"
                                aria-controls="web-tab-pane"
                                aria-selected={location.locationType === LocationType.Internet}
                                onClick={() => handleTab(LocationType.Internet)}
                            >
                                {t("dish.detail.web")}
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${location.locationType === LocationType.Internet ? "" : "active"}`}
                                id="cookbook-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#cookbook-tab-pane"
                                type="button"
                                role="tab"
                                aria-controls="cookbook-tab-pane"
                                aria-selected={location.locationType === LocationType.Cookbook}
                                onClick={() => handleTab(LocationType.Cookbook)}
                            >
                                {t("dish.detail.cookbook")}
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content mt-2" id="myTabContent">
                        <div className={`tab-pane fade ${location.locationType === LocationType.Internet ? "show active" : ""}`} id="web-tab-pane" role="tabpanel" aria-labelledby="web-tab" tabIndex={0}>
                            <div className="mb-2">
                                <label htmlFor="dish-detail-location-modal-link" className="form-label">{t("dish.detail.link")}</label>
                                <input type="text" name="link" className="form-control" id="dish-detail-location-modal-link" value={location.link} onChange={setValue} />
                            </div>
                        </div>
                        <div className={`tab-pane fade ${location.locationType === LocationType.Internet ? "" : "show active"}`} id="cookbook-tab-pane" role="tabpanel" aria-labelledby="cookbook-tab" tabIndex={0}>
                            <div className="mb-2">
                                <label htmlFor="dish-detail-location-modal-cookbook" className="form-label">{t("dish.detail.cookbook")}</label>
                                <input type="text" name="cookbook" className="form-control" id="dish-detail-location-modal-cookbook" value={location.cookbook} onChange={setValue} />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="dish-detail-location-modal-page" className="form-label">{t("dish.detail.page")}</label>
                                <input type="number" name="page" className="form-control" id="dish-detail-location-modal-page" value={location.page} onChange={setValue} />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {props.t("dish.detail.close")}
                    </Button>
                    {props.index !== undefined ?
                        <Button variant="primary" onClick={handleChange}>
                            {props.t("dish.detail.save")}
                        </Button>
                        :
                        <Button variant="primary" onClick={handleAdd}>
                            {props.t("dish.detail.addNew")}
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}


const LocationComponent = (
    props: {
        className?: string,
        t: TFunction<"translation", undefined>,
        locations: Location[],
        onClickDelete: (index: number) => void,
        onClickAdd: (location: Location) => void
        onClickChange: (index: number, location: Location) => void
    }) => {
    return (
        <div className={props.className}>
            <div className="fw-bold">{t("dish.detail.location")}</div>
            {props.locations.map((location, index) => (
                <div className='d-flex justify-content-start align-items-center mb-2' key={index}>
                    <LocationModal className="me-2" t={props.t} onClickAdd={props.onClickAdd} onClickChange={props.onClickChange} index={index} location={location} />
                    <button type="button" className="btn btn-danger me-2" onClick={() => props.onClickDelete(index)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                    {location.locationType === LocationType.Internet ?
                        <div className="col-lg-7 col-md-7 col-sm-11 text-truncate fs-5" >{location.link}</div>
                        :
                        <div className="fs-5">{`${location.cookbook}, ${t("dish.detail.page")}: ${location.page}`}</div>}
                </div>
            ))}
            <LocationModal className="mt-2" t={props.t} onClickAdd={props.onClickAdd} onClickChange={props.onClickChange} />
        </div>
    )
}

function DishDetailNew() {
    const errorContext = useErrorContext();
    const checkPermission = useAuth().checkPermission;
    const { t } = useTranslation();
    const { dishId } = useParams<{ dishId: string }>();
    const navigate = useNavigate();

    const [permissionDelete, setPermissionDelete] = useState<boolean>(false);
    const [permissionSave, setPermissionSave] = useState<boolean>(false);

    const [loader, setLoader] = useState<boolean>(false);

    const [dish, setDish] = useState<Dish>({
        name: "",
        description: "",
        comment: "",
        dishType: DishType.MAIN_COURSE,
        dishCookingTimeCategory: DishCookingTimeCategory.MODERATE,
        dishDietaryCategory: DishDietaryCategory.NON_VEGETARIAN,
        dishCaloricCategory: DishCaloricCategory.MEDIUM,
        locations: [],
        menus: [],
        preparations: [],
        keywords: [],
        imageData: []
    });

    const dishTypeArray: DishType[] = Object.values(DishType);
    const dishCookingTimeCategoryArray: DishCookingTimeCategory[] = Object.values(DishCookingTimeCategory);
    const DishDietaryCategoryArray: DishDietaryCategory[] = Object.values(DishDietaryCategory);
    const DishCaloricCategoryArray: DishCaloricCategory[] = Object.values(DishCaloricCategory);

    const [availableMenus, setAvailableMenus] = useState<Menu[]>([]);
    const [availableKeywords, setAvailableKeywords] = useState<Keyword[]>([]);

    useEffect(() => {
        setLoader(true);

        retrieveUserGroupWithMenusAndKeywords()
            .then((response: AxiosResponse<UserGroupWithMenusAndKeywords>) => {
                console.log(response.data);
                setAvailableMenus(response.data.menus)
                setAvailableKeywords(response.data.keywords)
                if (dishId && dishId !== NEW_ELEMENT) {
                    retrieveDishById(dishId)
                        .then((response: AxiosResponse<Dish>) => {
                            setDish(response.data);
                        })
                        .catch((error: AxiosError) => errorContext.setError(error));
                }
            })
            .catch((error: AxiosError) => errorContext.setError(error))
            .finally(() => setLoader(false));

        setPermissionSave(checkPermission(UserRole.ROLE_CHEF));
        setPermissionDelete(checkPermission(UserRole.ROLE_OWNER));

    }, [dishId])

    const setValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setDish({ ...dish, [e.target.name]: e.target.value });
    }

    const handleAddLocation = (location: Location): void => {
        setDish({ ...dish, locations: [...dish.locations!, location] })
    }

    const handleChangeLocation = (index: number, location: Location): void => {
        const newLocations = dish.locations!.map((e, i) => {
            return i === index ? location : e;
        });
        setDish({ ...dish, locations: newLocations });
    }

    const handleDeleteLocation = (index: number): void => {
        const newLocations = dish.locations?.filter((value, i) => i !== index)
        setDish({ ...dish, locations: newLocations })
    }

    const handleAddKeyword = (id: number): void => {
        const keywordToAdd = availableKeywords.find(e => e.id === id);
        const newKeywords = dish.keywords!;
        if (keywordToAdd && !newKeywords.some(e => e.id === keywordToAdd.id)) {
            newKeywords.push(keywordToAdd);
            newKeywords.sort((a: Keyword, b: Keyword) => a.name.localeCompare(b.name));
            setDish({ ...dish, keywords: newKeywords });
        }
    }

    const handleRemoveKeyword = (id: number): void => {
        const newKeywords = dish.keywords?.filter(e => e.id !== id);
        setDish({ ...dish, keywords: newKeywords });
    }

    const handleMenus = (id: number): void => {
        let newMenus: Menu[] = [];
        if (dish.menus) {
            if (dish.menus.some((e => e.id === id))) {
                newMenus = dish.menus.filter(e => e.id !== id);
            } else {
                newMenus = dish.menus;
                const menuToAdd = availableMenus.find(e => e.id === id);
                if (menuToAdd) {
                    newMenus.push(menuToAdd);
                }
            }
        }
        setDish({...dish, menus: newMenus});
    }

    const handleDeleteDish = (): void => {
        if (dishId) {
            deleteById(dishId)
                .then(() => {
                    navigate(-1);
                })
                .catch((error: AxiosError) => errorContext.setError(error));
        }
    }

    const handleSave = () => {
        if (dishId && dishId !== NEW_ELEMENT) {
            updateDish(dishId, dish)
            .then((response: AxiosResponse<Dish>) => {
                navigate(-1);
            })
            .catch((error: AxiosError) => errorContext.setError(error));
        } else {
            addNewDish(dish)
            .then((response: AxiosResponse<Dish>) => {
                navigate(-1);
            })
            .catch((error: AxiosError) => errorContext.setError(error));
        }
    }

    return (
        <div>
            <section className='container'>
                {dishId && dishId !== NEW_ELEMENT ?
                    <PageHeader text={t("dish.detail.headerUpdate")} />
                    :
                    <PageHeader text={t("dish.detail.headerNew")} />}
                {loader ?
                    <Loading />
                    :
                    <div className="row">
                        <div className="col-lg-8 col-md-8 col-sm-12 d-flex align-items-stretch justify-content-center">
                            <div className="card p-2 flex-fill shadow">
                                <div className="card-body">
                                    <form>
                                        <div className="mb-2">
                                            <label htmlFor="dish-detail-name" className="form-label">{t("dish.detail.name")}</label>
                                            <input type="text" name="name" className="form-control" id="dish-detail-name" value={dish.name} onChange={setValue} />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="dish-detail-description" className="form-label">{t("dish.detail.description")}</label>
                                            <input type="text" name="description" className="form-control" id="dish-detail-description" value={dish.description} onChange={setValue} />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="dish-detail-comment" className="form-label">{t("dish.detail.comment")}</label>
                                            <textarea className="form-control" name="comment" id="dish-detail-comment" value={dish.comment} onChange={setValue} rows={3} />
                                        </div>
                                        <CategoryRadio<DishType>
                                            className="mb-2"
                                            t={t}
                                            description="type"
                                            categories={dishTypeArray}
                                            onChange={setValue}
                                            activeValue={dish.dishType}
                                            name="dishType"
                                        />
                                        <CategoryRadio<DishCookingTimeCategory>
                                            className="mb-2"
                                            t={t}
                                            description="cookingTimeCategory"
                                            categories={dishCookingTimeCategoryArray}
                                            onChange={setValue}
                                            activeValue={dish.dishCookingTimeCategory}
                                            name="dishCookingTimeCategory"
                                        />
                                        <CategoryRadio<DishDietaryCategory>
                                            className="mb-2"
                                            t={t}
                                            description="dietaryCategory"
                                            categories={DishDietaryCategoryArray}
                                            onChange={setValue}
                                            activeValue={dish.dishDietaryCategory}
                                            name="dishDietaryCategory"
                                        />
                                        <CategoryRadio<DishCaloricCategory>
                                            className="mb-2"
                                            t={t}
                                            description="caloricCategory"
                                            categories={DishCaloricCategoryArray}
                                            onChange={setValue}
                                            activeValue={dish.dishCaloricCategory}
                                            name="dishCaloricCategory"
                                        />
                                        {dish.locations && <LocationComponent
                                            className="mb-2"
                                            t={t}
                                            locations={dish.locations}
                                            onClickAdd={handleAddLocation}
                                            onClickDelete={handleDeleteLocation}
                                            onClickChange={handleChangeLocation}
                                        />}
                                        <MenuCheckBox className="mb-2" t={t} menus={availableMenus} activeMenus={dish.menus} onChange={handleMenus} />
                                        <KeywordComponent className="btn btn-primary me-2 mb-2" keywords={dish.keywords} onClick={handleRemoveKeyword} />
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-stretch justify-content-center">
                            <div className="card p-2 flex-fill shadow">
                                <div className="card-body">
                                    <h4 className='text-center text-uppercase'>{t("dish.detail.keywords")}</h4>
                                    <KeywordComponent className="me-2 mb-2" keywords={availableKeywords} activeKeywords={dish.keywords} onClick={handleAddKeyword} />
                                </div>
                            </div>
                        </div>
                    </div>}
                <div className='ms-2 mt-2'>
                    <button className="btn btn-primary" type='button' onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button className="btn btn-success ms-2" type="submit" disabled={!permissionSave} onClick={handleSave}>
                        <i className="fa-regular fa-floppy-disk"></i>
                    </button>
                    {(dishId && dishId !== NEW_ELEMENT) && <DeleteModal className='ms-2' t={t} name={dish.name} onClick={handleDeleteDish} disabled={!permissionDelete} />}
                </div>
            </section>
        </div>
    )
}

export default DishDetailNew