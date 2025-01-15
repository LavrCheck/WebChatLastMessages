import './LoadMoreButton.sass'

export const LoadMoreButton = ({
    onClick,
    disabled
}: {
    onClick: () => void,
    disabled?: boolean
}) => {
    return <>
        <button className={'LoadMoreButton'} disabled={disabled} onClick={onClick}>
            Загрузить еще
        </button>
    </>
}