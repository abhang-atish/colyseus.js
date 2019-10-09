import { get, post } from 'httpie';

import { Auth } from './Auth';
import { Push } from './Push';
import { Room, RoomAvailable } from './Room';
import { RootSchemaConstructor } from './serializer/SchemaSerializer';
const https = require('https');

export type JoinOptions = any;

export class MatchMakeError extends Error {
    public code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, MatchMakeError.prototype);
    }
}

// tslint:disable-next-line: max-classes-per-file
export class Client {
    public auth: Auth;
    public push: Push;

    protected endpoint: string;

    constructor(endpoint: string, private cookie: string) {
        this.endpoint = endpoint;
        this.auth = new Auth(this.endpoint);
        this.push = new Push(this.endpoint);
    }

    // tslint:disable-next-line: max-line-length
    public async joinOrCreate<T = any>(roomName: string, options: JoinOptions = {}, rootSchema?: RootSchemaConstructor) {
        return await this.createMatchMakeRequest<T>('joinOrCreate', roomName, options, rootSchema);
    }

    public async create<T = any>(roomName: string, options: JoinOptions = {}, rootSchema?: RootSchemaConstructor) {
        return await this.createMatchMakeRequest<T>('create', roomName, options, rootSchema);
    }

    public async join<T = any>(roomName: string, options: JoinOptions = {}, rootSchema?: RootSchemaConstructor) {
        return await this.createMatchMakeRequest<T>('join', roomName, options, rootSchema);
    }

    public async joinById<T = any>(roomId: string, options: JoinOptions = {}, rootSchema?: RootSchemaConstructor) {
        return await this.createMatchMakeRequest<T>('joinById', roomId, options, rootSchema);
    }

    public async reconnect<T = any>(roomId: string, sessionId: string, rootSchema?: RootSchemaConstructor) {
        return await this.createMatchMakeRequest<T>('joinById', roomId, { sessionId }, rootSchema);
    }

    public async getAvailableRooms<Metadata = any>(roomName: string = ''): Promise<Array<RoomAvailable<Metadata>>> {
        const url = `${this.endpoint.replace('ws', 'http')}/matchmake/${roomName}`;
        return (await get(url, { headers: { Accept: 'application/json' } })).data;
    }

    protected async createMatchMakeRequest<T>(
        method: string,
        roomName: string,
        options: JoinOptions = {},
        rootSchema?: RootSchemaConstructor,
    ): Promise<Room<T>> {
        const url = `${this.endpoint.replace('ws', 'http')}/matchmake/${method}/${roomName}`;

        // automatically forward auth token, if present
        if (this.auth.hasToken) {
            options.token = this.auth.token;
        }

        // await this.sendRequest('POST', '/heartbeat2', this.cookie);
        // await this.sendRequest('POST', '/heartbeat2', this.cookie);

        const headers = {
            'Accept': 'application/json',
            'credentials': 'same-origin',
            'withCredentials': 'true',
            // tslint:disable-next-line: object-literal-sort-keys
            'Content-Type': 'application/json',
            '`Cookie`': this.cookie,
        };

        const response = (await post(url, {
            body: JSON.stringify(options),
            headers,
        })
        ).data;

        if (response.error) {
            throw new MatchMakeError(response.error, response.code);
        }

        const room = this.createRoom<T>(roomName, rootSchema);
        room.id = response.room.roomId;
        room.sessionId = response.sessionId;

        room.connect(this.buildEndpoint(response.room, { sessionId: room.sessionId }), this.cookie);

        return new Promise((resolve, reject) => {
            const onError = (message) => reject(message);
            room.onError.once(onError);

            room.onJoin.once(() => {
                room.onError.remove(onError);
                resolve(room);
            });
        });
    }

    protected async sendRequest(method: string, path: string, cookie: string) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie,
            },
            hostname: 'prod-matchmaker.getloconow.com',
            method,
            path,
            port: 443,
        };

        console.log('Options =>', options);

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                console.log(res.headers);
                res.setEncoding('utf8');
                res.on('data', () => {
                    resolve();
                });
            });
            req.on('error', (e: { message: string; }) => {
                console.log('error: ' + e.message);
                reject();
            });
            req.end();
        });
    }

    protected createRoom<T>(roomName: string, rootSchema?: RootSchemaConstructor) {
        return new Room<T>(roomName, rootSchema);
    }

    protected buildEndpoint(room: any, options: any = {}) {
        const params = [];

        for (const name in options) {
            if (!options.hasOwnProperty(name)) {
                continue;
            }
            params.push(`${name}=${options[name]}`);
        }

        return `${this.endpoint}/${room.processId}/${room.roomId}?${params.join('&')}`;
    }

}
