import WebSocketClient from '@gamestdio/websocket';
export declare class Connection extends WebSocketClient {
    private _enqueuedCalls;
    constructor(url: string, autoConnect?: boolean);
    onOpenCallback(event: any): void;
    send(data: any): void;
}
