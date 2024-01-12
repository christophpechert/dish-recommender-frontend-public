import { TFunction } from "i18next"
import { aws } from "../../config/constant"
import { ImageData } from "../../objects/ImageData"
import DeleteModal from "../global/DeleteModal"

function DishImageElement(
    props: { 
        t: TFunction<"translation", undefined>,
        recipeImageData: ImageData, 
        permissionDelete: boolean, 
        onClickDelete: (id: number) => void, 
    }) {
    return (
        <div>
            <div className="card shadow">
                <div className="card-body">
                    <img
                        src={`https://${props.recipeImageData.bucket}${aws}${props.recipeImageData.fileName}`}
                        style={{ width: '100%', height: 'auto' }}
                    />
                    <DeleteModal
                        t={props.t}
                        className='mt-2'
                        name={`ID: ${props.recipeImageData.id!}`}
                        disabled={!props.permissionDelete}
                        onClick={() => props.onClickDelete(props.recipeImageData.id!)}
                    />
                </div>
            </div>
        </div >
    )
}

export default DishImageElement