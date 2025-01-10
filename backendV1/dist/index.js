"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const gamemanager_1 = require("./gamemanager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
console.log("server started successfuly");
const gameManager = new gamemanager_1.GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    wss.on('close', () => gameManager.removeUser(ws));
    console.log("conection established successfuly by");
});
