"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var httpie_1 = require("httpie");
var Room_1 = require("./Room");
var Auth_1 = require("./Auth");
var Push_1 = require("./Push");
var MatchMakeError = /** @class */ (function (_super) {
    __extends(MatchMakeError, _super);
    function MatchMakeError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        Object.setPrototypeOf(_this, MatchMakeError.prototype);
        return _this;
    }
    return MatchMakeError;
}(Error));
exports.MatchMakeError = MatchMakeError;
var Client = /** @class */ (function () {
    function Client(endpoint) {
        this.endpoint = endpoint;
        this.auth = new Auth_1.Auth(this.endpoint);
        this.push = new Push_1.Push(this.endpoint);
    }
    Client.prototype.joinOrCreate = function (roomName, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('joinOrCreate', roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.create = function (roomName, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('create', roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.join = function (roomName, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('join', roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.joinById = function (roomId, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('joinById', roomId, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.reconnect = function (roomId, sessionId, rootSchema) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('joinById', roomId, { sessionId: sessionId }, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.getAvailableRooms = function (roomName) {
        if (roomName === void 0) { roomName = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.endpoint.replace("ws", "http") + "/matchmake/" + roomName;
                        return [4 /*yield*/, httpie_1.get(url, { headers: { 'Accept': 'application/json' } })];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    Client.prototype.createMatchMakeRequest = function (method, roomName, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, response, room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.endpoint.replace("ws", "http") + "/matchmake/" + method + "/" + roomName;
                        // automatically forward auth token, if present
                        if (this.auth.hasToken) {
                            options.token = this.auth.token;
                        }
                        headers = {
                            'Accept': 'application/json',
                            'credentials': 'same-origin',
                            'withCredentials': 'true',
                            'Content-Type': 'application/json',
                        };
                        return [4 /*yield*/, httpie_1.post(url, {
                                headers: headers,
                                body: JSON.stringify(options),
                            })];
                    case 1:
                        response = (_a.sent()).data;
                        if (response.error) {
                            throw new MatchMakeError(response.error, response.code);
                        }
                        room = this.createRoom(roomName, rootSchema);
                        room.id = response.room.roomId;
                        room.sessionId = response.sessionId;
                        room.connect(this.buildEndpoint(response.room, { sessionId: room.sessionId }));
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var onError = function (message) { return reject(message); };
                                room.onError.once(onError);
                                room.onJoin.once(function () {
                                    room.onError.remove(onError);
                                    resolve(room);
                                });
                            })];
                }
            });
        });
    };
    Client.prototype.createRoom = function (roomName, rootSchema) {
        return new Room_1.Room(roomName, rootSchema);
    };
    Client.prototype.buildEndpoint = function (room, options) {
        if (options === void 0) { options = {}; }
        var params = [];
        for (var name_1 in options) {
            if (!options.hasOwnProperty(name_1)) {
                continue;
            }
            params.push(name_1 + "=" + options[name_1]);
        }
        return this.endpoint + "/" + room.processId + "/" + room.roomId + "?" + params.join('&');
    };
    return Client;
}());
exports.Client = Client;
