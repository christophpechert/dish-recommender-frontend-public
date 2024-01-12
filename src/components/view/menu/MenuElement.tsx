import { Link } from 'react-router-dom'
import { MenuWithNumberOfDishes } from '../../objects/Menu'
import { useEffect, useState } from 'react'
import { TFunction } from 'i18next';

function MenuElement(props: { t: TFunction<"translation", undefined>, menu: MenuWithNumberOfDishes, onClick: (path: string) => void, permissionEdit: boolean }) {

    return (
        <div>
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">{props.menu.name}</h5>
                    <p className="card-text">{props.menu.description}</p>
                    <div className="d-flex justify-content-between">
                        <div>
                            <button
                                className='btn btn-primary me-2'
                                disabled={props.menu.numberOfDishes <= 0}
                                onClick={() => props.onClick(`/dish/menu/${props.menu.id}`)}
                            >
                                {`${props.menu.numberOfDishes} ${props.menu.numberOfDishes === 1 ? props.t("menu.element.dish") : props.t("menu.element.dishes")}`}
                            </button>
                            <button className='btn btn-primary' onClick={() => props.onClick(`/newrecommendation/menu/${props.menu.id}`)}>
                                <i className="fa-solid fa-book-open-reader"></i>
                            </button>
                        </div>
                        <button className='btn btn-warning' onClick={() => props.onClick(`/menu/${props.menu.id}`)} disabled={!props.permissionEdit} >
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MenuElement