import { useEffect, useState } from 'react';
import { Keyword } from '../../objects/Keyword';
import KeywordElement from './KeywordElement';
import { retrieveAllKeywords } from '../../api/KeywordApiService';
import Loading from '../global/Loading';
import { useErrorContext } from '../../context/ErrorContext';
import { AxiosError, AxiosResponse } from 'axios';
import PageHeader from '../global/PageHeader';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NEW_ELEMENT, UserRole } from '../../config/constant';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../global/SearchBar';

function KeywordOverview() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const checkPermission = useAuth().checkPermission;
    const errorContext = useErrorContext();
    const [loader, setLoader] = useState<boolean>(false)
    const [keywords, setKeywords] = useState<Keyword[]>([])

    const [permissionEdit, setPermissionEdit] = useState<boolean>(false)

    useEffect(() => {
        setLoader(true)
        retrieveAllKeywords()
            .then((response: AxiosResponse<Keyword[]>) => {
                setKeywords(response.data)
            })
            .catch((error: AxiosError) => {
                errorContext.setError(error);
            })
            .finally(() => setLoader(false));

        setPermissionEdit(checkPermission(UserRole.ROLE_CHEF));
    }, [])

    const handleGoToKeyword = (id: number): void => {
        navigate(`/keyword/${id}`)
    }

    return (
        <div>
            <section className='container'>
                <PageHeader text={t("keyword.overview.header")} withBackButton={true} />
                <div>
                    {loader ?
                        <Loading />
                        :
                        <div>
                            <SearchBar values={keywords} setValues={setKeywords} keyName="name" />
                            {keywords.length === 0 ?
                                <div className='text-center'>
                                    <h4 className='text-uppercase mt-4'>{t("keyword.overview.noKeywords")}</h4>
                                </div>
                                :
                                <div  className='row'>
                                {keywords.map(
                                    (keyword, index) => (
                                        <div className='col-lg-2 col-md-3 col-sm-6 mb-4' key={index}>
                                            <KeywordElement keyword={keyword} onClick={handleGoToKeyword} disable={!permissionEdit} />
                                        </div>
                                    )
                                )}
                                </div>}
                        </div>}
                </div>
            </section>
        </div>
    )
}

export default KeywordOverview