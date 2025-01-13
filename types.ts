type EventType = 'NEW_MESSAGE' | 'NEW_CHANNEL' | 'NEW_ATTACHMENT';

export interface IEvent {
    type: EventType;
    channelId?: number | string;
}

export type AttachmentType = 'file' | 'image';

export interface IAttachment {
    file: string;
    name: string;
    type: AttachmentType;
}

export interface IUser {
    avatar: string;
    firstName: string;
    id: number;
    lastName: string;
}

export interface IMessage {
    channel: number;
    createDate: string;
    id: number;
    sender: IUser;
    text: string;
    attachments: IAttachment[];
}