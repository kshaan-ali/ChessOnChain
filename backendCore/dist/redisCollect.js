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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    username: 'default',
    password: 'd8ueP5KTZusXInsSIsOp4K268srtbuBa',
    socket: {
        host: 'redis-11496.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11496
    }
});
function code() {
    return __awaiter(this, void 0, void 0, function* () {
        client.on('error', err => console.log('Redis Client Error', err));
        yield client.connect();
        while (true) {
            const result = yield client.get('java');
            console.log(result); // >>> bar
        }
    });
}
code();
