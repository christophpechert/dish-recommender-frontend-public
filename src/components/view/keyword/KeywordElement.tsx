import { Link } from 'react-router-dom'
import { Keyword } from '../../objects/Keyword'

function KeywordElement(props: { keyword: Keyword, onClick: (id: number) => void , disable: boolean}) {

    return (
        <div>
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">{props.keyword.name}</h5>
                    <div className="text-end" >
                        <button className='btn btn-warning' disabled={props.disable} onClick={() => props.onClick(props.keyword.id!)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default KeywordElement