"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./legacy");
var Client_1 = require("./Client");
exports.Client = Client_1.Client;
var Protocol_1 = require("./Protocol");
exports.Protocol = Protocol_1.Protocol;
var Room_1 = require("./Room");
exports.Room = Room_1.Room;
var Auth_1 = require("./Auth");
exports.Auth = Auth_1.Auth;
exports.Platform = Auth_1.Platform;
/*
 * Serializers
 */
var FossilDeltaSerializer_1 = require("./serializer/FossilDeltaSerializer");
exports.FossilDeltaSerializer = FossilDeltaSerializer_1.FossilDeltaSerializer;
var SchemaSerializer_1 = require("./serializer/SchemaSerializer");
exports.SchemaSerializer = SchemaSerializer_1.SchemaSerializer;
var Serializer_1 = require("./serializer/Serializer");
exports.registerSerializer = Serializer_1.registerSerializer;
var schema_1 = require("@colyseus/schema");
exports.Schema = schema_1.Schema;
exports.type = schema_1.type;
Serializer_1.registerSerializer('fossil-delta', FossilDeltaSerializer_1.FossilDeltaSerializer);
Serializer_1.registerSerializer('schema', SchemaSerializer_1.SchemaSerializer);
