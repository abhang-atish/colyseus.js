import { Connection } from './Connection';
import { Serializer } from './serializer/Serializer';
import { Protocol } from './Protocol';
import { Listener } from '@gamestdio/state-listener';
import { RootSchemaConstructor } from './serializer/SchemaSerializer';
export interface RoomAvailable<Metadata> {
    roomId: string;
    clients: number;
    maxClients: number;
    metadata?: Metadata;
}
export declare class Room<State = any> {
    id: string;
    sessionId: string;
    name: string;
    onJoin: {
        (this: any, cb: (...args: any[]) => void | Promise<any>): import("strong-events/lib").EventEmitter<(...args: any[]) => void | Promise<any>>;
        once(cb: (...args: any[]) => void | Promise<any>): void;
        remove(cb: (...args: any[]) => void | Promise<any>): void;
        invoke(...args: any[]): void;
        invokeAsync(...args: any[]): Promise<any[]>;
        clear(): void;
    };
    onStateChange: {
        (this: any, cb: (state: State) => void): import("strong-events/lib").EventEmitter<(state: State) => void>;
        once(cb: (state: State) => void): void;
        remove(cb: (state: State) => void): void;
        invoke(state: State): void;
        invokeAsync(state: State): Promise<any[]>;
        clear(): void;
    };
    onMessage: {
        (this: any, cb: (data: any) => void): import("strong-events/lib").EventEmitter<(data: any) => void>;
        once(cb: (data: any) => void): void;
        remove(cb: (data: any) => void): void;
        invoke(data: any): void;
        invokeAsync(data: any): Promise<any[]>;
        clear(): void;
    };
    onError: {
        (this: any, cb: (message: string) => void): import("strong-events/lib").EventEmitter<(message: string) => void>;
        once(cb: (message: string) => void): void;
        remove(cb: (message: string) => void): void;
        invoke(message: string): void;
        invokeAsync(message: string): Promise<any[]>;
        clear(): void;
    };
    onLeave: {
        (this: any, cb: (code: number) => void): import("strong-events/lib").EventEmitter<(code: number) => void>;
        once(cb: (code: number) => void): void;
        remove(cb: (code: number) => void): void;
        invoke(code: number): void;
        invokeAsync(code: number): Promise<any[]>;
        clear(): void;
    };
    connection: Connection;
    serializerId: string;
    protected serializer: Serializer<State>;
    protected previousCode: Protocol;
    protected rootSchema: RootSchemaConstructor;
    constructor(name: string, rootSchema?: RootSchemaConstructor);
    connect(endpoint: string): void;
    leave(consented?: boolean): void;
    send(data: any): void;
    readonly state: State;
    listen(segments: string, callback: Function, immediate?: boolean): Listener;
    removeListener(listener: Listener): void;
    removeAllListeners(): void;
    protected onMessageCallback(event: MessageEvent): void;
    protected setState(encodedState: any): void;
    protected patch(binaryPatch: any): void;
}
