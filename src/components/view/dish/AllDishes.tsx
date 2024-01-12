import { useEffect, useState } from 'react'
import { retrieveAllDishes } from '../../api/DishApiService'
import { Dish } from '../../objects/Dish';
import PageHeader from '../global/PageHeader';
import { AxiosError, AxiosResponse } from 'axios';
import { useErrorContext } from '../../context/ErrorContext';
import Loading from '../global/Loading';
import DishElements from './DishElement';
import { useTranslation } from 'react-i18next';
import SearchBar from '../global/SearchBar';

function AllDishes() {
    const { t } = useTranslation();

    const [dishes, setDishes] = useState<Dish[]>([]);

    const [loader, setLoader] = useState<boolean>(false);

    const errorContext = useErrorContext();

    useEffect(
        () => {
            setLoader(true)
            retrieveAllDishes()
                .then((response: AxiosResponse<Dish[]>) => {
                    setDishes(response.data);
                })
                .catch((error: AxiosError) => {
                    errorContext.setError(error);
                })
                .finally(() => setLoader(false))
        }, []
    )

    return (
        <div>
            <section className='container'>
                <PageHeader text={`${t("dish.element.header")} (${dishes.length})`} withBackButton={true} />
                <div className='row'>
                    {loader ? (
                        <Loading />
                    ) :
                        <div>
                            <SearchBar values={dishes} setValues={setDishes} keyName="name"/>

                            {dishes.length === 0 ?
                                <h4 className='text-center text-uppercase py-4'>There are no dishes</h4>
                                :
                                <DishElements t={t} dishes={dishes} setDishes={setDishes} />
                            }
                        </div>}
                </div>
            </section>
        </div>
    )
}

export default AllDishes