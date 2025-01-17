import classNames from "classnames";
import {Icon} from "./Icon.tsx";
import {useEffect, useState} from "react";
import {AttachmentType, IAttachment, IMessage} from "../../types.ts";
import moment from 'moment-mini'
import {TIME_SHORT_FMT} from "../../variables.ts";
import {groupBy} from "lodash";
import {isVideo} from "./utilities/chatUtilities.ts";
import playVideo from '../assets/playVideo.svg'

type MessageCardProps = {
    message: IMessage; userId: string; onClickAttachment: (x: any) => void;
};


export const httpsHost = 'https://xn--2-stbc.xn----7sbecl2dbcfoo.xn--p1ai';
export const makeUrl = (url: string) => url.indexOf('https:') !== -1 ? url : url.indexOf('http:') !== -1 ? url.replace('http:', 'https:') : `${httpsHost}${url}`;

export const timeFormat = (time: string): string => {
    return moment(time).format(TIME_SHORT_FMT);
};

export const MessageCard = ({message, userId, onClickAttachment}: MessageCardProps) => {
    const [files, setFiles] = useState<IAttachment[] | undefined>(undefined);
    const [images, setImages] = useState<IAttachment[] | undefined>(undefined);


    useEffect(() => {
        if (message && message.attachments && message.attachments.length) {
            const attachments: Record<Partial<AttachmentType>, IAttachment[]> = groupBy(message.attachments, "type") as any;

            if (attachments.file && attachments.file.length) {
                setFiles(attachments.file);
            }

            if (attachments.image && attachments.image.length) {
                setImages(attachments.image);
            }
        }
    }, [message]);

    return (<>
        <div className={classNames({
            "py-2 px-3 rounded-md ": true,
            "bg-[#E0E0E0] self-start": userId && +userId !== message.sender.id,
            "bg-[#FFFFFF] self-end": userId && +userId === message.sender.id,
            "self-start": userId && +userId !== message.sender.id,
            "self-end": userId && +userId === message.sender.id,
        })}>
            <div className="flex gap-[6px] items-end justify-end">
                <div>{message.text}</div>
                <div className="text-[#4A4A4A] flex gap-[2px] items-center">
                    <span className="text-sm">{timeFormat(message.createDate)}</span>
                    <Icon type="mark-read"/>
                </div>
            </div>
        </div>
        {files && files.length && <div className={classNames({
            "flex flex-col gap-[6px] py-[6px] px-3 rounded-md": true,
            "bg-[#E0E0E0] self-start": userId && +userId !== message.sender.id,
            "bg-[#FFFFFF] self-end": userId && +userId === message.sender.id,
        })}>
            {files.map((item, idx) => (<div key={idx}>
                <a target="_blank" href={makeUrl(item.file)} className={classNames({
                    "flex items-center gap-[4px]": true,
                })}>
                    <Icon type="attachment" width={24} height={24}/>
                    <span>{item.name}</span>
                </a>
            </div>))}
        </div>}

        {images && images.length && <div className={classNames({
            "flex flex-wrap gap-[2px]": true,
            "self-start": userId && +userId !== message.sender.id,
            "self-end justify-end": userId && +userId === message.sender.id,
        })}>
            {images.map((item, idx) => (<div key={idx} className="overflow-hidden rounded-md bg-[#00000010] relative">
                {isVideo(item.file) ? <div onClick={() => onClickAttachment(item.file)}>
                    <video className="object-contain max-h-[200px] cursor-pointer" src={item.file}/>
                    <img alt='play' src={playVideo} className={'absolute inset-0 m-auto max-h-[50%] max-w-[80%] cursor-pointer'}/>
                </div> : <img className="object-contain max-w-[200px] h-full cursor-pointer" src={makeUrl(item.file)}
                    onClick={() => onClickAttachment(item.file)} alt=""/>}

                <div
                    className="absolute bottom-[10px] right-[10px] bg-[#FFFFFF99] text-[#4A4A4A] px-[10px] py-[4px] rounded-md">
                    {timeFormat(message.createDate)}
                </div>
            </div>))}
        </div>}
    </>);
};