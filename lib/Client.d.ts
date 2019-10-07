import { Room, RoomAvailable } from './Room';
import { Auth } from './Auth';
import { Push } from './Push';
import { RootSchemaConstructor } from './serializer/SchemaSerializer';
export declare type JoinOptions = any;
export declare class MatchMakeError extends Error {
    code: number;
    constructor(message: string, code: number);
}
export declare class Client {
    auth: Auth;
    push: Push;
    protected endpoint: string;
    constructor(endpoint: string);
    joinOrCreate<T = any>(roomName: string, options?: JoinOptions, rootSchema?: RootSchemaConstructor): Promise<Room<T>>;
    create<T = any>(roomName: string, options?: JoinOptions, rootSchema?: RootSchemaConstructor): Promise<Room<T>>;
    join<T = any>(roomName: string, options?: JoinOptions, rootSchema?: RootSchemaConstructor): Promise<Room<T>>;
    joinById<T = any>(roomId: string, options?: JoinOptions, rootSchema?: RootSchemaConstructor): Promise<Room<T>>;
    reconnect<T = any>(roomId: string, sessionId: string, rootSchema?: RootSchemaConstructor): Promise<Room<T>>;
    getAvailableRooms<Metadata = any>(roomName?: string): Promise<RoomAvailable<Metadata>[]>;
    protected createMatchMakeRequest<T>(method: string, roomName: string, options?: JoinOptions, rootSchema?: RootSchemaConstructor): Promise<Room<T>>;
    protected createRoom<T>(roomName: string, rootSchema?: RootSchemaConstructor): Room<T>;
    protected buildEndpoint(room: any, options?: any): string;
}
