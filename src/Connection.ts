import WebSocketClient from '@gamestdio/websocket';
import * as msgpack from './msgpack';

export class Connection extends WebSocketClient {
    private _enqueuedCalls: any[] = [];

    constructor(url: string, autoConnect: boolean = true, cookie: string) {
        super(url, undefined, { connect: autoConnect, cookie });
    }

    public onOpenCallback(event) {
        super.onOpenCallback();

        this.binaryType = 'arraybuffer';

        if (this._enqueuedCalls.length > 0) {
            for (const [method, args] of this._enqueuedCalls) {
                this[method].apply(this, args);
            }

            // clear enqueued calls.
            this._enqueuedCalls = [];
        }
    }

    public send(data: any): void {
        if (this.ws.readyState === WebSocketClient.OPEN) {
            return super.send(msgpack.encode(data));

        } else {
            // WebSocket not connected.
            // Enqueue data to be sent when readyState == OPEN
            this._enqueuedCalls.push(['send', [data]]);
        }
    }

}
