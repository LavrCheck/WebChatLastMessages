import './LoadMoreButton.sass'

export const LoadMoreButton = ({
    onClick
}: {
    onClick: () => void,
}) => {
    return <>
        <button className={'LoadMoreButton mt-3 '} onClick={onClick}>
            Загрузить еще
        </button>
    </>
}