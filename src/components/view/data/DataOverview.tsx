import { ChangeEvent, useEffect, useState } from 'react';
import { addDishes, addKeywords, addMenus, retrieveAllDishes, retrieveAllKeywords, retrieveAllMenus } from '../../api/DataApiService';
import { Dish } from '../../objects/Dish';
import { Keyword } from '../../objects/Keyword';
import { Menu } from '../../objects/Menu';
import PageHeader from '../global/PageHeader';
import { useErrorContext } from '../../context/ErrorContext';
import { AxiosError, AxiosResponse } from 'axios';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../config/constant';
import { useTranslation } from 'react-i18next';


function DataOverview() {
    const checkPermissions = useAuth().checkPermission;
    const errorContext = useErrorContext();

    const { t } = useTranslation();

    const [permissionImport, setPermissionImport] = useState<boolean>(false);
    const [permissionExport, setPermissionExport] = useState<boolean>(false);

    useEffect(() => {
        setPermissionImport(checkPermissions(UserRole.ROLE_CHEF));
        setPermissionExport(checkPermissions(UserRole.ROLE_WAITER));
    }, [])

    type ApiFunctionGetByUserId = () => Promise<AxiosResponse<any, any>>;
    type ApiFunctionPostByUserIdAndJsonArray = (data: any) => Promise<AxiosResponse<any, any>>;

    var handleFileChange = function (e: ChangeEvent<HTMLInputElement>) {
        return new Promise<Dish[] | Keyword[] | Menu[]>((resolve, reject) => {
            if (e.target.files) {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const fileContents = e.target?.result as string;
                            const parsedData = JSON.parse(fileContents);
                            resolve(parsedData);
                        } catch (error) {
                            reject(Error("Error parsing JSON: " + error));
                        }
                    };
                    reader.readAsText(selectedFile);
                }
            }
        })
    }

    function exportJson(data: any, saveAs: string) {
        var stringified = JSON.stringify(data, null, 2);
        var blob = new Blob([stringified], { type: "application/json" });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.download = saveAs + '.json';
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importFile(e: ChangeEvent<HTMLInputElement>, apiFunction: ApiFunctionPostByUserIdAndJsonArray) {
        handleFileChange(e)
            .then(result => {
                apiFunction(result)
                    .then(response => console.log(response))
                    .catch((error: AxiosError) => errorContext.setError(error));
            })
            .catch(error => console.log(error))
    }


    function exportFile(apiFunction: ApiFunctionGetByUserId, filename: string) {
        apiFunction()
            .then(response => exportJson(response.data, filename))
            .catch((error: AxiosError) => errorContext.setError(error));
    }

    return (
        <div className='container'>
            <PageHeader text={t("data.overview.header")} withBackButton={true}/>
            <div className='row'>
                <div className='col-lg-4 col-md-4 col-sm-12'>
                    <div className="card shadow">
                        <div className="card-header text-center text-uppercase">
                            {t("data.overview.dishes")}
                        </div>
                        <div className="card-body">
                            <input className="form-control mb-2" type="file" accept='.json' onChange={(e) => importFile(e, addDishes)} disabled={!permissionImport} />
                            <button className="btn btn-primary" onClick={() => exportFile(retrieveAllDishes, "dishes")} disabled={!permissionExport}>{t("data.overview.exportBtn")}</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-12'>
                    <div className="card shadow">
                        <div className="card-header text-center text-uppercase">
                            {t("data.overview.keywords")}
                        </div>
                        <div className="card-body">
                            <input className="form-control mb-2" type="file" accept='.json' onChange={(e) => importFile(e, addKeywords)} disabled={!permissionImport} />
                            <button className="btn btn-primary" onClick={() => exportFile(retrieveAllKeywords, "keywords")} disabled={!permissionExport}>{t("data.overview.exportBtn")}</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-12'>
                    <div className="card shadow">
                        <div className="card-header text-center text-uppercase">
                            {t("data.overview.menus")}
                        </div>
                        <div className="card-body">
                            <input className="form-control mb-2" type="file" accept='.json' onChange={(e) => importFile(e, addMenus)} disabled={!permissionImport} />
                            <button className="btn btn-primary" onClick={() => exportFile(retrieveAllMenus, "menus")} disabled={!permissionExport}>{t("data.overview.exportBtn")}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DataOverview