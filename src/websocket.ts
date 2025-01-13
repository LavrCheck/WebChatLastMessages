import { objectToCamel, objectToSnake } from 'ts-case-convert';
import { v4 } from 'uuid';
import { IEvent } from '../types.ts';

type WebSocketProps = {
    onConnect?: () => void;
    onClose: () => void;
    onMessage: (payload: IEvent) => void;
};

type WebSocketMessage = {
    type: string;
    messageId: string;
};

export class WebSocketConnector {
    private webSocket: WebSocket;
    private resolveStorage: Map<
        string,
        [(payload: any) => void, (payload: any) => void]
    >;
    private connectedResolve: Promise<void>;
    private pingIntervalTimer: NodeJS.Timer | undefined;

    private static _instance: WebSocketConnector | undefined;

    private constructor(props: WebSocketProps) {
        let connectResolver: () => void;
        let connectRejecter: () => void;

        const onConnectionFinished = () => {
            WebSocketConnector._instance = undefined;

            if (this.pingIntervalTimer) {
                clearInterval(this.pingIntervalTimer);
            }

            if (connectRejecter) {
                connectRejecter();
            }

            if (props.onClose) {
                props.onClose();
            }
        };

        this.connectedResolve = new Promise<void>((resolve, reject) => {
            connectResolver = resolve;
            connectRejecter = reject;
        });

        this.resolveStorage = new Map();
        this.webSocket = new WebSocket(
            'wss://xn--2-stbc.xn----7sbecl2dbcfoo.xn--p1ai/webchat'
        );

        this.webSocket.onclose = onConnectionFinished;
        this.webSocket.onerror = onConnectionFinished;

        this.webSocket.onopen = () => {
            connectResolver();
            this.runPing();

            if (props.onConnect) {
                props.onConnect();
            }
        };

        this.webSocket.onmessage = ({ data }) => {
            data = objectToCamel(JSON.parse(data));

            if (this.resolveStorage.has(data.messageId)) {
                const [resolve, reject] = this.resolveStorage.get(data.messageId)!;

                if (data.success) {
                    resolve(data);
                } else {
                    reject(data);
                }

                this.resolveStorage.delete(data.messageId);
            } else if (props.onMessage) {
                props.onMessage(data);
            }
        };
    }

    private runPing(): void {
        this.pingIntervalTimer = setInterval(() => {
            const messageId = v4();

            this.webSocket.send(
                JSON.stringify(objectToSnake({ messageId, type: 'PING' }))
            );
        }, 3000);
    }

    public static getInstance(props?: WebSocketProps): WebSocketConnector {
        if (!this._instance && props) {
            this._instance = new WebSocketConnector(props);
        }

        if (!this._instance) {
            throw new Error('Error while create WS instance');
        }

        return this._instance;
    }

    public connected(): Promise<void> {
        return this.connectedResolve;
    }

    public get<R>(
        payload: Omit<WebSocketMessage, 'message_id'> & any
    ): Promise<R>;
    public get<R, T>(
        payload: Omit<WebSocketMessage, 'message_id'> & T
    ): Promise<R> {
        const messageId = v4();
        let resolver: (payload: R) => void;
        let rejecter: (payload: R) => void;
        const promise = new Promise<R>((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        });

        this.resolveStorage.set(messageId, [resolver!, rejecter!]);
        this.webSocket.send(
            JSON.stringify(objectToSnake({ ...payload, messageId }))
        );

        return promise;
    }
}