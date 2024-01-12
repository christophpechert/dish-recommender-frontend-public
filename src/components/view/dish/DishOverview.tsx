import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Menu } from '../../objects/Menu'
import { Dish } from '../../objects/Dish'
import PageHeader from '../global/PageHeader'
import { AxiosError, AxiosResponse } from 'axios'
import { useErrorContext } from '../../context/ErrorContext'
import { retrieveMenuWithDishes } from '../../api/MenuApiService'
import Loading from '../global/Loading'
import DishElements from './DishElement'
import { useTranslation } from 'react-i18next'
import SearchBar from '../global/SearchBar'

function DishOverview() {

    const { menuId } = useParams<{ menuId: string }>();
    const { t } = useTranslation();

    const [menu, setMenu] = useState<Menu>();
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loader, setLoader] = useState<boolean>(false);

    const errorContext = useErrorContext();

    useEffect(
        () => {
            setLoader(true)
            if (menuId) {
                retrieveMenuWithDishes(menuId)
                    .then((response: AxiosResponse<Menu>) => {
                        const menu = response.data;
                        setMenu(menu);
                        if (menu.dishes) {
                            setDishes(menu.dishes);
                        }
                    })
                    .catch((error: AxiosError) => {
                        errorContext.setError(error);
                    })
                    .finally(() => setLoader(false))
            }
        },
        [menuId]
    )

    return (
        <div>
            <section className='container'>
                <PageHeader text={`Dishes from menu: ${menu?.name}`} />
                <div className='row'>
                    {loader ? (
                        <Loading />
                    ) : (
                        <div>
                            <SearchBar values={dishes} setValues={setDishes} keyName="name"/>
                            <DishElements t={t} dishes={dishes} setDishes={setDishes} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default DishOverview