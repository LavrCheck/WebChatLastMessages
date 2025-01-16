import {useEffect, useRef, useState} from "react";
import {WebSocketConnector} from "../websocket.ts";
import {DATETIME_SHORT_FMT, DATETIME_SORTABLE} from "../../variables.ts";
import {MessagesGroup} from "./MessagesGroup.tsx";
import {MessageCard} from "./MessageCard.tsx";
import {entries, fromPairs, groupBy, keys, sortBy} from "lodash";
import moment from "moment-mini";
import {IMessage} from "../../types.ts";
import {LoadMoreButton} from "./LoadMoreButton.tsx";


export const WebChatLM = ({
    userId = "237503",
    userToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNTQyNDl9.yVqKPKlGWpYkTKFOTADEf_kzihpgSVBpMz22Aul2osM",
    channelId = 9
}: {
    userId?: string // change declaration
    userToken?: string
    channelId?: number
}) => {

    const [groupedMessages, setGroupedMessages] = useState<Array<[string, IMessage[]]>>([])

    const limit = 30
    const [offset, setOffset] = useState<number>(limit)
    const [isHasMoreMessages, setIsHasMoreMessages] = useState<boolean>(true)

    const wsRef = useRef<WebSocketConnector>();


    const initWS = async () => {
        wsRef.current = WebSocketConnector.getInstance({
            onClose: () => {},
            onMessage: async (payload) => {
                    if (payload.type === 'NEW_MESSAGE') {
                        const resp = await wsRef?.current?.get<any>({
                            type: 'GET_MESSAGES', channelId: channelId, offset: 0, limit: 1
                        })

                        removeDuplicatesOfBottomMonthAndSafe(resp.payload.items)
                    }
                },
            onConnect: () => {}
        })

        await wsRef.current.connected()
        await wsRef.current.get<any>({
            type: 'LOGIN', userId: userId, userKey: userToken,
        })
    }


    const getMessages = async () => {
        if (wsRef.current) {
            const resp = await wsRef.current.get<any>({
                type: 'GET_MESSAGES', channelId: channelId, offset: offset, limit: limit

            })
            removeDuplicatesOfTopMonthAndSafe(resp.payload.items)

            const newOffset = offset + limit
            if (resp.payload.count <= newOffset) {
                setIsHasMoreMessages(false)
                return
            }
            setOffset(newOffset)
        }
    }

    const removeDuplicatesOfTopMonthAndSafe = (data: any[]) => {
        const newGroupedMessages = groupMessages(data)

        if (groupedMessages.length !== 0 && newGroupedMessages[newGroupedMessages.length - 1][0] === groupedMessages[0][0]) {
            const mergedMessages = [...groupedMessages[0][1], ...newGroupedMessages[newGroupedMessages.length - 1][1]]
            setGroupedMessages(prev => [...newGroupedMessages.slice(0, -1), [newGroupedMessages[newGroupedMessages.length - 1][0], mergedMessages], ...prev.slice(1)])
        } else {
            setGroupedMessages(prev => [...newGroupedMessages, ...prev])
        }
    }

    const removeDuplicatesOfBottomMonthAndSafe = (data: any[]) => {
        const newGroupedMessages = groupMessages(data)

        if (groupedMessages.length !== 0 && newGroupedMessages[0][0] === groupedMessages[groupedMessages.length - 1][0]) {
            const mergedMessages = [...groupedMessages[groupedMessages.length - 1][0], ...newGroupedMessages[0][0]]
            setGroupedMessages(prev => [...prev.slice(0, -1), [newGroupedMessages[0][0], mergedMessages], ...newGroupedMessages.slice(1)])
        } else {
            setGroupedMessages(prev => [...newGroupedMessages, ...prev])
        }
    }

    const groupMessages = (data: any[]) => {
        const grouped = groupBy(data.map((item) => ({
            ...item,
            dateSortable: moment(item.createDate).format(DATETIME_SORTABLE),
            dateNormalized: moment(item.createDate).format(DATETIME_SHORT_FMT),
        })), "dateNormalized");

        const sortedGrouped = keys(grouped).sort((a, b) => moment(a, DATETIME_SHORT_FMT).diff(moment(b, DATETIME_SHORT_FMT)));

        return entries(fromPairs(sortedGrouped.map((key) => [key, grouped[key]])))
    }

    useEffect(() => {
        (async () => {
            await initWS()
            const resp = await wsRef?.current?.get<any>({
                type: 'GET_MESSAGES', channelId: channelId, offset: 0, limit: limit
            })
            setGroupedMessages(groupMessages(resp.payload.items))
        })()
    }, [])

    return <>
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[1000px] h-[1000px] "> {/* <--- Delete me ↑↑↑ */}
                <div className={'bg-[#EEEEEE] p-4 w-full h-full overflow-x-auto'}>
                    <LoadMoreButton onClick={getMessages} disabled={!isHasMoreMessages}/>
                    {groupedMessages?.map(([title, messages], i) => (<MessagesGroup key={i} title={title}>
                        {sortBy(messages, ["dateSortable"]).map((message) => (
                            <MessageCard userId={userId} key={message.id} message={message}/>))}
                    </MessagesGroup>))}
                </div>
            </div>
        </div>
    </>
}