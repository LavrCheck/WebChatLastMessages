import './MediaViewModal.sass'
import close from '../assets/close.svg'
import {makeUrl} from "./MessageCard.tsx";
import {isVideo} from "./utilities/chatUtilities.ts";


export const MediaViewModal = ({
    isModalVisible, data, onClose,
}: {
    isModalVisible: boolean, data: any, onClose: () => void,
}) => {

    if (!isModalVisible) {
        return null
    }

    return <>
        <div className={'MediaViewModal'} onClick={onClose}>
            <div className={'overlay'}/>
            <img src={close} alt="close" className={'close-icon'}/>
            <div className={'content'} onClick={(e) => e.stopPropagation()}>
                {isVideo(data) ? <video src={data} controls autoPlay/> : <img src={makeUrl(data)} alt=''/>}
            </div>
        </div>
    </>
}