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
    getFile: string
}

export interface IUser {
    avatar: string;
    firstName: string;
    id: number;
    lastName: string;
    isExpert: boolean;
    isStaff: boolean;
}

export interface IMessage {
    channel: number;
    createDate: string;
    id: number;
    sender: IUser;
    text: string;
    attachments: IAttachment[];
}