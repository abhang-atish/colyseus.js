import { Serializer } from "./Serializer";
import { Schema } from "@colyseus/schema";
export declare type RootSchemaConstructor = new (...args: any[]) => Schema;
export declare class SchemaSerializer<T extends Schema = any> implements Serializer<T> {
    state: T;
    setState(rawState: any): void;
    getState(): T;
    patch(patches: any): void;
    teardown(): void;
    handshake(bytes: number[]): void;
}
