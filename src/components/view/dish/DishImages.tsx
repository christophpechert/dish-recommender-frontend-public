import { useEffect, useState } from 'react'
import { useErrorContext } from '../../context/ErrorContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Dish } from '../../objects/Dish';
import { retrieveDishById } from '../../api/DishApiService';
import { AxiosError, AxiosResponse } from 'axios';
import PageHeader from '../global/PageHeader';
import Loading from '../global/Loading';
import DishImageElement from './DishImageElement';
import { UserRole } from '../../config/constant';
import { deleteImageFile } from '../../api/ImageDataApiService';

function DishImages() {
    const errorContext = useErrorContext();
    const checkPermission = useAuth().checkPermission;
    const { t } = useTranslation();
    const { dishId } = useParams<{ dishId: string }>();
    const [loader, setLoader] = useState<boolean>(false);
    const navigate = useNavigate();

    const [permissionDelete, setPermissionDelete] = useState<boolean>(false);

    const [dish, setDish] = useState<Dish>();

    useEffect(() => {
        if (dishId) {
            retrieveDishById(dishId)
                .then((response: AxiosResponse<Dish>) => {
                    setDish(response.data)
                })
                .catch((error: AxiosError) => errorContext.setError(error))
                .finally(() => setLoader(false));
        }

        setPermissionDelete(checkPermission(UserRole.ROLE_CHEF));
    }, [dishId])

    const handleDelete = (id: number): void => {
        setLoader(true);
        deleteImageFile(id)
            .then(() => {
                const newImageData = dish?.imageData.filter(e => e.id !== id);
                if (newImageData) {
                    if (newImageData.length > 0) {
                        setDish({ ...dish!, imageData: newImageData });
                    } else {
                        navigate(-1);
                    }
                }
            })
            .catch((error: AxiosError) => errorContext.setError(error))
            .finally(() => setLoader(false))
    }

    return (
        <div>
            <section className='container'>
                <PageHeader text={t("dish.images.header", { name: dish?.name })} withBackButton={true} />
                <div className='row'>
                    {loader ?
                        <Loading />
                        :
                        dish && dish.imageData.map((recipeImage, index) => (
                            <div className='col-lg-4 col-md-6 col-sm-12 mb-4' key={index}>
                                <DishImageElement t={t} recipeImageData={recipeImage} permissionDelete={permissionDelete} onClickDelete={handleDelete} />
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}

export default DishImages