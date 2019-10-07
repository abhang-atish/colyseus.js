export declare enum Protocol {
    JOIN_ROOM = 10,
    JOIN_ERROR = 11,
    LEAVE_ROOM = 12,
    ROOM_DATA = 13,
    ROOM_STATE = 14,
    ROOM_STATE_PATCH = 15
}
export declare function utf8Read(view: DataView, offset: number): string;
export declare function utf8Length(str?: string): number;
