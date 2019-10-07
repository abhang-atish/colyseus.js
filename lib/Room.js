"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var msgpack = __importStar(require("./msgpack"));
var strong_events_1 = require("strong-events");
var Connection_1 = require("./Connection");
var Serializer_1 = require("./serializer/Serializer");
var Protocol_1 = require("./Protocol");
var Room = /** @class */ (function () {
    function Room(name, rootSchema) {
        var _this = this;
        // Public signals
        this.onJoin = strong_events_1.createSignal();
        this.onStateChange = strong_events_1.createSignal();
        this.onMessage = strong_events_1.createSignal();
        this.onError = strong_events_1.createSignal();
        this.onLeave = strong_events_1.createSignal();
        this.id = null;
        this.name = name;
        if (rootSchema) {
            this.serializer = new (Serializer_1.getSerializer("schema"));
            this.rootSchema = rootSchema;
            this.serializer.state = new (rootSchema)();
        }
        else {
            // TODO: remove default serializer. it should arrive only after JOIN_ROOM.
            this.serializer = new (Serializer_1.getSerializer("fossil-delta"));
        }
        this.onError(function (message) { return console.error(message); });
        this.onLeave(function () { return _this.removeAllListeners(); });
    }
    Room.prototype.connect = function (endpoint) {
        var _this = this;
        this.connection = new Connection_1.Connection(endpoint, false);
        this.connection.reconnectEnabled = false;
        this.connection.onmessage = this.onMessageCallback.bind(this);
        this.connection.onclose = function (e) {
            _this.onLeave.invoke(e.code);
        };
        this.connection.onerror = function (e) {
            console.warn("Room, onError (" + e.code + "): " + e.reason);
            _this.onError.invoke(e.reason);
        };
        this.connection.open();
    };
    Room.prototype.leave = function (consented) {
        if (consented === void 0) { consented = true; }
        if (this.connection) {
            if (consented) {
                this.connection.send([Protocol_1.Protocol.LEAVE_ROOM]);
            }
            else {
                this.connection.close();
            }
        }
        else {
            this.onLeave.invoke(4000); // "consented" code
        }
    };
    Room.prototype.send = function (data) {
        this.connection.send([Protocol_1.Protocol.ROOM_DATA, data]);
    };
    Object.defineProperty(Room.prototype, "state", {
        get: function () {
            return this.serializer.getState();
        },
        enumerable: true,
        configurable: true
    });
    // TODO: deprecate / move somewhere else
    // this method is useful only for FossilDeltaSerializer
    Room.prototype.listen = function (segments, callback, immediate) {
        if (this.serializerId === "schema") {
            console.error("'" + this.serializerId + "' serializer doesn't support .listen() method.");
            return;
        }
        else if (!this.serializerId) {
            console.warn("room.Listen() should be called after room.onJoin has been called (DEPRECATION WARNING)");
        }
        return this.serializer.api.listen(segments, callback, immediate);
    };
    // TODO: deprecate / move somewhere else
    // this method is useful only for FossilDeltaSerializer
    Room.prototype.removeListener = function (listener) {
        return this.serializer.api.removeListener(listener);
    };
    Room.prototype.removeAllListeners = function () {
        if (this.serializer) {
            this.serializer.teardown();
        }
        this.onJoin.clear();
        this.onStateChange.clear();
        this.onMessage.clear();
        this.onError.clear();
        this.onLeave.clear();
    };
    Room.prototype.onMessageCallback = function (event) {
        if (!this.previousCode) {
            var view = new DataView(event.data);
            var code = view.getUint8(0);
            if (code === Protocol_1.Protocol.JOIN_ROOM) {
                var offset = 1;
                this.serializerId = Protocol_1.utf8Read(view, offset);
                offset += Protocol_1.utf8Length(this.serializerId);
                // get serializer implementation
                var serializer = Serializer_1.getSerializer(this.serializerId);
                if (!serializer) {
                    throw new Error("missing serializer: " + this.serializerId);
                }
                // TODO: remove this check
                if (this.serializerId !== "fossil-delta" && !this.rootSchema) {
                    this.serializer = new serializer();
                }
                if (view.buffer.byteLength > offset && this.serializer.handshake) {
                    var bytes = Array.from(new Uint8Array(view.buffer.slice(offset)));
                    this.serializer.handshake(bytes);
                }
                this.onJoin.invoke();
            }
            else if (code === Protocol_1.Protocol.JOIN_ERROR) {
                this.onError.invoke(Protocol_1.utf8Read(view, 1));
            }
            else if (code === Protocol_1.Protocol.LEAVE_ROOM) {
                this.leave();
            }
            else {
                this.previousCode = code;
            }
        }
        else {
            if (this.previousCode === Protocol_1.Protocol.ROOM_STATE) {
                // TODO: improve here!
                this.setState(Array.from(new Uint8Array(event.data)));
            }
            else if (this.previousCode === Protocol_1.Protocol.ROOM_STATE_PATCH) {
                this.patch(Array.from(new Uint8Array(event.data)));
            }
            else if (this.previousCode === Protocol_1.Protocol.ROOM_DATA) {
                this.onMessage.invoke(msgpack.decode(event.data));
            }
            this.previousCode = undefined;
        }
    };
    Room.prototype.setState = function (encodedState) {
        this.serializer.setState(encodedState);
        this.onStateChange.invoke(this.serializer.getState());
    };
    Room.prototype.patch = function (binaryPatch) {
        this.serializer.patch(binaryPatch);
        this.onStateChange.invoke(this.serializer.getState());
    };
    return Room;
}());
exports.Room = Room;
