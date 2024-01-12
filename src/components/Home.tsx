import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Loading from './view/global/Loading';
import { retrieveUserByAuth } from './api/UserInfoApiService';
import { AxiosError, AxiosResponse } from 'axios';
import { useErrorContext } from './context/ErrorContext';
import { Menu } from './objects/Menu';
import { retrieveMenus } from './api/MenuApiService';

const NotInUserGroupCard = (props: { t: TFunction<"translation", undefined>, onClick: (path: string) => void }) => {
  return (
    <div className='col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch'>
      <div className="card shadow" style={{ width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title">{props.t("home.notInUserGroup.header")}</h5>
          <p className="card-text">{props.t("home.notInUserGroup.text")}</p>
        </div>
        <div className='card-footer mx-3 mb-2 bg-white'>
          <button style={{ width: "100%" }} className='btn btn-primary' onClick={() => props.onClick("/user-group")}>{props.t("home.notInUserGroup.btn1")}</button>
          <button style={{ width: "100%" }} className='btn btn-primary mt-2' onClick={() => props.onClick("/user-group/search")}>{props.t("home.notInUserGroup.btn2")}</button>
        </div>

      </div>
    </div >
  )
}

const RecommendationCard = (props: { className?: string, t: TFunction<"translation", undefined>, onClick: (path: string) => void, menus: Menu[] }) => {
  return (
    <div className={`${props.className}`}>
      <div className="card shadow" style={{ width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title">{props.t("home.recommendation.header")}</h5>
          <p className="card-text">{props.t("home.recommendation.text")}</p>
        </div>
        <div className='card-footer mx-3 mb-2 bg-white'>
          <button style={{ width: "100%" }} className='btn btn-primary' onClick={() => props.onClick("/newrecommendation/menu/0")}>{props.t("home.recommendation.btn1")}</button>
          {props.menus.map((menu, index) => (
            <div key={index}>
              <button
                style={{ width: "100%" }}
                className='btn btn-primary mt-2'
                onClick={() => props.onClick(`/recommendation/menu/${menu.id!}`)}
              >
                {props.t("home.recommendation.btn2", { name: menu.name })}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

const MenuCard = (props: { className?: string, t: TFunction<"translation", undefined>, onClick: (path: string) => void }) => {
  return (
    <div className={`${props.className}`}>
      <div className="card shadow" style={{ width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title">{props.t("home.menu.header")}</h5>
          <p className="card-text">{props.t("home.menu.text")}</p>
        </div>
        <div className='card-footer mx-3 mb-2 bg-white'>
          <button style={{ width: "100%" }} className='btn btn-primary' onClick={() => props.onClick("/menu")}>{props.t("home.menu.btn1")}</button>
        </div>
      </div>
    </div>
  )
}

const DishCard = (props: { className?: string, t: TFunction<"translation", undefined>, onClick: (path: string) => void }) => {
  return (
    <div className={`${props.className}`}>
      <div className="card shadow" style={{ width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title">{props.t("home.dish.header")}</h5>
          <p className="card-text">{props.t("home.dish.text")}</p>
        </div>
        <div className='card-footer mx-3 mb-2 bg-white'>
          <button style={{ width: "100%" }} className='btn btn-primary' onClick={() => props.onClick("/dish")}>{props.t("home.dish.btn1")}</button>
        </div>
      </div>
    </div>
  )
}


function Home() {
  const { t } = useTranslation();
  const authContext = useAuth();
  const errorContext = useErrorContext();
  const navigate = useNavigate();

  const [loader, setLoader] = useState<boolean>(true);
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    setLoader(true);
    retrieveUserByAuth()
      .then(response => {
        if (response.data.userGroup) {
          authContext.setUserInUserGroup(true);
          retrieveMenus()
            .then((response: AxiosResponse<Menu[]>) => {
              setMenus(response.data);
              setLoader(false);
            })
            .catch((error: AxiosError) => errorContext.setError(error))
        } else {
          authContext.setUserInUserGroup(false);
          setLoader(false);
        }
      })
      .catch((error: AxiosError) => errorContext.setError(error))
  }, []);

  const handleNavigate = (path: string): void => {
    navigate(path);
  }

  return (
    <div>
      <section className='container'>
        <h1 className='text-center'>{t('home.greeting', { name: authContext.username })}</h1>
        <br></br>
        {loader ?
          <Loading />
          :
          !authContext.isInUserGroup ?
            <div className='d-flex justify-content-center'>
              <NotInUserGroupCard t={t} onClick={handleNavigate} />
            </div>
            :
            <div className='row'>
                <RecommendationCard className='col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch mb-2' t={t} onClick={handleNavigate} menus={menus} />
                <MenuCard className='col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch mb-2' t={t} onClick={handleNavigate} />
                <DishCard className='col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch mb-2' t={t} onClick={handleNavigate} />
            </div>
        }
      </section>
    </div>
  );
}

export default Home;
