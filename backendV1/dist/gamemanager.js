"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
require('dotenv').config();
const messages_1 = require("./messages");
const chess_js_1 = require("chess.js");
const backendUrl = process.env.backendUrl;
const axios_1 = __importDefault(require("axios"));
class Game {
    constructor(player1, player2, p1Metadata, p2Metadata) {
        this.p1 = { sc: player1, color: messages_1.COLOR_WHITE, metaData: p1Metadata };
        this.p2 = { sc: player2, color: messages_1.COLOR_BLACK, metaData: p2Metadata };
        this.moveCount = 0;
        this.chess = new chess_js_1.Chess();
        this.startTime = new Date();
        this.p1.metaData.map((i) => {
            i.color = messages_1.COLOR_WHITE;
        });
        this.p2.metaData.map((i) => {
            i.color = messages_1.COLOR_BLACK;
        });
        this.metaMetadata = this.p1.metaData.concat(this.p2.metaData);
        // console.log(this.p1.metaData)
        // console.log(this.p2.metaData)
        // console.log(this.metaMetadata)
        this.p1.sc.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: messages_1.COLOR_WHITE,
                metadata: this.metaMetadata
            },
        }));
        this.p2.sc.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: messages_1.COLOR_BLACK,
                metadata: this.metaMetadata
            },
        }));
    }
    makeMove(sc, move) {
        if (this.p1.sc && this.p2.sc) {
            if (this.moveCount % 2 == 0 && sc !== this.p1.sc) {
                console.log("white expected to move");
                return;
            }
            if (this.moveCount % 2 !== 0 && sc !== this.p2.sc) {
                console.log("black expected to move");
                return;
            }
            try {
                this.chess.move(move);
                this.moveCount++;
            }
            catch (e) {
                console.log(e);
                return;
            }
            if (this.chess.isGameOver()) {
                const winner = this.moveCount % 2 == 0 ? messages_1.COLOR_BLACK : messages_1.COLOR_WHITE;
                this.p1.sc.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: winner,
                    },
                }));
                this.p2.sc.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: {
                        winner: winner,
                    },
                }));
            }
            this.p2.sc.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                },
            }));
            this.p1.sc.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move,
                },
            }));
        }
    }
}
/////////////////////////////////////////
class GameManager {
    constructor() {
        this.games = [];
        this.userOnline = [];
        this.pendinguser = { sc: null, metaData: [] };
    }
    addUser(sc) {
        this.userOnline.push(sc);
        this.handleEvent(sc);
    }
    removeUser(sc) {
        this.userOnline = this.userOnline.filter(function (u) {
            u !== sc;
        });
    }
    handleEvent(sc) {
        return __awaiter(this, void 0, void 0, function* () {
            sc.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                const message = JSON.parse(data.toString());
                if (message.type === messages_1.INIT_GAME) {
                    const game = this.games.find((g) => g.p1.sc === sc || g.p2.sc === sc);
                    if (game) {
                        this.games = this.games.filter((g) => g !== game);
                    }
                    if (this.pendinguser.sc && this.pendinguser.sc !== sc) {
                        //start game
                        this.games.push(new Game(this.pendinguser.sc, sc, this.pendinguser.metaData, message.payload.metadata));
                        console.log("match started");
                        try {
                            const gameDb = yield axios_1.default.post(`${backendUrl}/createGame`, {
                                whiteId: this.pendinguser.id,
                                blackId: message.payload.id
                            });
                            console.log(gameDb.data);
                        }
                        catch (e) {
                            console.log(e);
                        }
                        this.pendinguser.sc = null;
                    }
                    else {
                        this.pendinguser.sc = sc;
                        this.pendinguser.id = message.payload.id;
                        this.pendinguser.metaData = message.payload.metadata;
                    }
                }
                if (message.type === messages_1.MOVE) {
                    const game = this.games.find((g) => g.p1.sc === sc || g.p2.sc === sc);
                    if (game) {
                        game.makeMove(sc, message.move);
                    }
                }
            }));
        });
    }
}
exports.GameManager = GameManager;
