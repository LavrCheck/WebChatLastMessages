import { ReactNode } from "react";

type MessagesGroupType = { children: ReactNode; title: string };

export const MessagesGroup = ({ children, title }: MessagesGroupType) => (
    <div className="py-">
        <div className="py-2 text-center sticky top-0 z-10">
            <div className={'bg-[#EEEEEE] p-2 inline-block rounded-md'}>
                <span className={'text-[#4A4A4A] '}>{title}</span>
            </div>
        </div>
        <div className="flex flex-col gap-[10px]">{children}</div>
    </div>
);