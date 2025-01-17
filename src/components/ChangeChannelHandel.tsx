import {useEffect, useState} from "react";

export const ChangeChannelHandel = ({
    channelId, onChange
}: {
    channelId: string
    onChange: (x: string) => void
}) => {

    const [id, setId] = useState<string>(channelId)

    useEffect(() => {
        id && onChange(id)
    }, [id])

    return <>
        <div className={'flex justify-center items-center mb-5'}>
            <span className={'me-3 text-xl'}>Change channel ID</span>
            <input value={id} onChange={(e) => setId(e.target.value)} type={'number'} className={'border-2'}/>
        </div>
    </>
}