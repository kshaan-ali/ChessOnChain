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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/createGame", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new Error("Request body is undefined");
        }
        const x = req.body;
        const game = yield prisma.game.create({
            data: {
                white: { connect: { id: x.whiteId } },
                black: { connect: { id: x.blackId } },
            },
        });
        console.log(game);
        res.status(200).json(game);
    }
    catch (e) {
        console.log(e);
        res.status(400).send("Error in body");
    }
}));
app.post("/createAccount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new Error("Request body is undefined");
        }
        const { name, address } = req.body;
        console.log(name, address);
        const user = yield createAccountDb({ name, address });
        res.status(200).json(user);
    }
    catch (e) {
        console.log(e);
        res.status(400).send("Error in body");
    }
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
function createAccountDb(x) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield prisma.user.findFirst({
            where: {
                address: x.address,
            },
        });
        if (user) {
            console.log("userExists");
        }
        else {
            user = yield prisma.user.create({
                data: {
                    name: x.name,
                    address: x.address,
                },
            });
        }
        return user;
    });
}
