import {WebSocketConnector} from "./src/websocket";
import {userId, userToken} from "./variables";

export const api = {
    init: async () => {
        const webSocket = WebSocketConnector.getInstance({
            onClose: () => {},
            onMessage: () => {},
            onConnect: () => {}
        });
        await webSocket.connected()
        await webSocket.get<any>({
            type: 'LOGIN', userId: userId, userKey: userToken,
        });
        return webSocket;
    },

    getMessages: async () => {

    }
}