import {useEffect, useRef, useState} from "react";
import {WebSocketConnector} from "../websocket.ts";
import {channelId, DATETIME_SHORT_FMT, DATETIME_SORTABLE, userId, userToken} from "../../variables.ts";
import {MessagesGroup} from "./MessagesGroup.tsx";
import {MessageCard} from "./MessageCard.tsx";
import {entries, fromPairs, groupBy, keys, sortBy} from "lodash";
import moment from "moment-mini";
import {IMessage} from "../../types.ts";
import {LoadMoreButton} from "./LoadMoreButton.tsx";


export const WebChatLM = () => {

    const [groupedMessages, setGroupedMessages] = useState<Array<[string, IMessage[]]> | undefined>();

    const wsRef = useRef<WebSocketConnector>();

    const initWS = async () => {
        wsRef.current = WebSocketConnector.getInstance({
            onClose: () => {
            }, onMessage: () => {
            }, onConnect: () => {
            }
        });
        await wsRef.current.connected()
        await wsRef.current.get<any>({
            type: 'LOGIN', userId: userId, userKey: userToken,
        });
    }

    const getMessages = async () => {
        if (wsRef.current) {
            const resp = await wsRef.current.get<any>({
                type: 'GET_MESSAGES', channelId: channelId, offset: 0, limit: 50

            })
            console.log(resp.payload)
            setGroupedMessages(groupMessages(resp.payload));
        }
    }

    const groupMessages = (data: any[]) => {
        const grouped = groupBy(data.map((item) => ({
            ...item,
            dateSortable: moment(item.createDate).format(DATETIME_SORTABLE),
            dateNormalized: moment(item.createDate).format(DATETIME_SHORT_FMT),
        })), "dateNormalized");

        return entries(fromPairs(keys(grouped).sort((a, b) => moment(a, DATETIME_SHORT_FMT).diff(moment(b, DATETIME_SHORT_FMT))).map((key) => [key, grouped[key]])))
    }

    const onLoadMoreClick = () => {

    }

    useEffect(() => {
        (async () => {
            await initWS()
            await getMessages()
        })()
    }, [])

    return <>
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[1000px] h-[1000px] "> {/* <--- Delete me ↑↑↑ */}
                <div className={'bg-[#EEEEEE] px-4 w-full h-full overflow-x-auto'}>
                    <LoadMoreButton onClick={onLoadMoreClick}/>
                    {groupedMessages?.map(([title, messages]) => (<MessagesGroup key={title} title={title}>
                        {sortBy(messages, ["dateSortable"]).map((message) => (
                            <MessageCard key={message.id} message={message}/>))}
                    </MessagesGroup>))}
                </div>
            </div>
        </div>
    </>
}