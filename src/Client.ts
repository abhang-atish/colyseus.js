import { post, get } from 'httpie';

import { Room, RoomAvailable } from './Room';
import { Auth } from './Auth';
import { Push } from './Push';
import { RootSchemaConstructor } from './serializer/SchemaSerializer';
import { Connection } from './Connection';
import { log } from 'util';
import * as msgpack from './msgpack';

export type JoinOptions = any;

export class MatchMakeError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, MatchMakeError.prototype);
    }
}

export class Client {
    public auth: Auth;
    public push: Push;

    protected endpoint: string;

    constructor(endpoint: string = `${location.protocol.replace('http', 'ws')}//${location.hostname}${(location.port && `:${location.port}`)}`) {
        this.endpoint = endpoint;
        this.auth = new Auth(this.endpoint);
        this.push = new Push(this.endpoint);
    }

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

    public async getAvailableRooms<Metadata = any>(roomName: string = ''): Promise<RoomAvailable<Metadata>[]> {
        const url = `${this.endpoint.replace('ws', 'http')}/matchmake/${roomName}`;
        return (await get(url, { headers: { Accept: 'application/json' } })).data;
    }

    protected async createMatchMakeRequest<T>(
        method: string,
        roomName: string,
        options: JoinOptions = {},
        rootSchema?: RootSchemaConstructor,
    ): Promise<Room<T>> {
        console.log(options);
        let room: Room;

        const _url = `${this.endpoint}/matchmake/${method}/${roomName}`;

        console.log(_url);
        const connection = new Connection(_url);

        connection.onopen = (event: MessageEvent) => {
            console.log('connection open');
            connection.send(JSON.stringify(options));
        };
        return new Promise((resolve, reject) => {
            connection.onmessage = (event: MessageEvent) => {
                const response = JSON.parse(event.data);
                console.log(response);
                room = this.createRoom<T>(roomName, rootSchema);
                room.id = response.room.roomId;
                room.sessionId = response.sessionId;

                const _url2 = this.buildEndpoint(response.room, { sessionId: room.sessionId });

                room.connect(_url2);

                const onError = (message: any) => {
                    console.error('ERROR', message);
                    reject(message);
                };
                room.onError.once(onError);

                room.onJoin.once(() => {
                    room.onError.remove(onError);
                    console.log('onJoin', room.id);
                    resolve(room);
                });
            };
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
